import * as path from "node:path";
import { Stack, type StackProps } from "aws-cdk-lib";
import { WebSocketApi, WebSocketStage } from "aws-cdk-lib/aws-apigatewayv2";
import { WebSocketLambdaAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";

export class PlanningPokerServerStack extends Stack {
	public readonly table: Table;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const functions = this.createLambdaFunctions([
			"onConnect",
			"onDisconnect",
			"default",
		]);

		const api = this.createWebSocketApi(functions);

		new WebSocketStage(this, "planningPokerServerStage", {
			stageName: "v1",
			webSocketApi: api,
			autoDeploy: true,
		});

		this.table = this.createDynamoDBTable();

		this.grantTablePermissions(this.table, functions);
	}

	private createLambdaFunction = (name: string): NodejsFunction =>
		new NodejsFunction(this, name, {
			entry: path.join(__dirname, `../src/functions/${name}/index.ts`),
			functionName: name,
		});

	private createLambdaFunctions(
		names: string[],
	): Record<string, NodejsFunction> {
		return names.reduce(
			(acc, name) => {
				acc[name] = this.createLambdaFunction(name);
				return acc;
			},
			{} as Record<string, NodejsFunction>,
		);
	}

	private createWebSocketApi(
		functions: Record<string, NodejsFunction>,
	): WebSocketApi {
		const authorizerFunction = new NodejsFunction(this, "authorizerFunction", {
			entry: path.join(__dirname, "../src/functions/authorizer/index.ts"),
			functionName: "authorizer",
		});
		const authorizer = new WebSocketLambdaAuthorizer(
			"Authorizer",
			authorizerFunction,
			{
				identitySource: ["route.request.header.Origin"],
			},
		);
		const api = new WebSocketApi(this, "api", {
			apiName: "planningPokerServer",
			connectRouteOptions: {
				integration: new WebSocketLambdaIntegration(
					"webSocketLambdaIntegration",
					functions.onConnect,
				),
				authorizer: authorizer,
			},
		});
		api.grantManageConnections(authorizerFunction);
		api.grantManageConnections(functions.onConnect);

		const routes = [
			{ route: "$default", func: "default" },
			{ route: "joinRoom", func: "default" },
			{ route: "submitCard", func: "default" },
			{ route: "revealAllCards", func: "default" },
			{ route: "resetRoom", func: "default" },
			{ route: "resetTimer", func: "default" },
			{ route: "pauseTimer", func: "default" },
			{ route: "resumeTimer", func: "default" },
			{ route: "$disconnect", func: "onDisconnect" },
		];

		for (const { route, func } of routes) {
			api.addRoute(route, {
				integration: new WebSocketLambdaIntegration(
					`${func}Integration`,
					functions[func],
				),
			});
			api.grantManageConnections(functions[func]);
		}
		return api;
	}

	private createDynamoDBTable = (): Table => {
		const table = new Table(this, "planningPokerTable", {
			tableName: "PlanningPoker",
			billingMode: BillingMode.PAY_PER_REQUEST,
			partitionKey: { name: "roomId", type: AttributeType.STRING },
			sortKey: { name: "clientId", type: AttributeType.STRING },
		});

		table.addGlobalSecondaryIndex({
			indexName: "ClientIdIndex",
			partitionKey: { name: "clientId", type: AttributeType.STRING },
		});

		return table;
	};

	private grantTablePermissions(
		table: Table,
		functions: Record<string, NodejsFunction>,
	): void {
		for (const func of Object.values(functions)) {
			table.grantFullAccess(func);
		}
	}
}
