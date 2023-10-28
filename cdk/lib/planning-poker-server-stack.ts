import {Construct} from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {WebSocketApi, WebSocketStage} from "@aws-cdk/aws-apigatewayv2-alpha";
import {WebSocketLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {RemovalPolicy, Stack, StackProps} from "aws-cdk-lib";
import * as path from "path";
import {AttributeType, BillingMode, Table} from "aws-cdk-lib/aws-dynamodb";

export class PlanningPokerServerStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const nameToFunction = (name: string) =>
            new NodejsFunction(this, name, {
                entry: path.join(__dirname, `../functions/${name}/index.ts`),
                functionName: name,
            });

        const [onConnect, resetRoomFunc, onDisconnect, defaultFunc]
            = ['onConnect', 'resetRoomFunc', 'onDisconnect', 'default']
            .map(nameToFunction);

        const api = new WebSocketApi(this, 'api', {
            apiName: 'planningPokerServer',
            connectRouteOptions: {
                integration: new WebSocketLambdaIntegration('connectIntegration', onConnect),
            },
            disconnectRouteOptions: {
                integration: new WebSocketLambdaIntegration('disconnectIntegration', onDisconnect),
            },
            defaultRouteOptions: {
                integration: new WebSocketLambdaIntegration('defaultIntegration', defaultFunc),
            },
        });

        api.addRoute('resetRoom', {
            integration: new WebSocketLambdaIntegration('resetRoomIntegration', resetRoomFunc),
        });
        api.grantManageConnections(onConnect);
        api.grantManageConnections(onDisconnect);
        api.grantManageConnections(defaultFunc);
        api.grantManageConnections(resetRoomFunc);

        new WebSocketStage(this, 'planningPokerServerStage', {
            stageName: 'v1',
            webSocketApi: api,
            autoDeploy: true,
        });

        const table = new Table(this, 'planningPokerTable', {
            tableName: 'PlanningPoker',
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: {name: 'roomId', type: AttributeType.STRING},
            sortKey: {name: 'clientId', type: AttributeType.STRING},
        });
        table.addGlobalSecondaryIndex({
            indexName: "ClientIdIndex",
            partitionKey: {name: 'clientId', type: AttributeType.STRING},
        });
        table.grantFullAccess(onConnect);
        table.grantFullAccess(onDisconnect);
        table.grantFullAccess(defaultFunc);
        table.grantFullAccess(resetRoomFunc);
    }
}
