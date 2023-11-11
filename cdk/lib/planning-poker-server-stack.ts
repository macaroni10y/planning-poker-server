import {Construct} from 'constructs';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {WebSocketApi, WebSocketStage} from '@aws-cdk/aws-apigatewayv2-alpha';
import {WebSocketLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {Stack, StackProps} from 'aws-cdk-lib';
import * as path from 'path';
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb';

export class PlanningPokerServerStack extends Stack {
    public readonly table: Table;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const functions = this.createLambdaFunctions([
            'onConnect',
            'joinRoom',
            'resetRoom',
            'submitCard',
            'onDisconnect',
            'default',
        ]);

        const api = this.createWebSocketApi(functions);

        new WebSocketStage(this, 'planningPokerServerStage', {
            stageName: 'v1',
            webSocketApi: api,
            autoDeploy: true,
        });

        this.table = this.createDynamoDBTable();

        this.grantTablePermissions(this.table, functions);
    }

    private createLambdaFunction = (name: string): NodejsFunction => new NodejsFunction(this, name, {
        entry: path.join(__dirname, `../src/functions/${name}/index.ts`),
        functionName: name,
    });

    private createLambdaFunctions(names: string[]): Record<string, NodejsFunction> {
        return names.reduce((acc, name) => {
            acc[name] = this.createLambdaFunction(name);
            return acc;
        }, {} as Record<string, NodejsFunction>);
    }

    private createWebSocketApi(functions: Record<string, NodejsFunction>): WebSocketApi {
        const api = new WebSocketApi(this, 'api', {
            apiName: 'planningPokerServer',
        });

        const routes = [
            {route: '$connect', func: 'onConnect'},
            {route: '$disconnect', func: 'onDisconnect'},
            {route: 'joinRoom', func: 'joinRoom'},
            {route: 'resetRoom', func: 'resetRoom'},
            {route: 'submitCard', func: 'submitCard'},
            {route: '$default', func: 'default'},
        ];

        routes.forEach(({route, func}) => {
            api.addRoute(route, {
                integration: new WebSocketLambdaIntegration(`${func}Integration`, functions[func])
            });
            api.grantManageConnections(functions[func]);
        });

        return api;
    }

    private createDynamoDBTable = (): Table => {
        const table = new Table(this, 'planningPokerTable', {
            tableName: 'PlanningPoker',
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: {name: 'roomId', type: AttributeType.STRING},
            sortKey: {name: 'clientId', type: AttributeType.STRING},
        });

        table.addGlobalSecondaryIndex({
            indexName: 'ClientIdIndex',
            partitionKey: {name: 'clientId', type: AttributeType.STRING},
        });

        return table;
    };

    private grantTablePermissions(table: Table, functions: Record<string, NodejsFunction>): void {
        Object.values(functions).forEach((func) => table.grantFullAccess(func));
    }
}
