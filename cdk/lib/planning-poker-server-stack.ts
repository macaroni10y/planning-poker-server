import {Construct} from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {WebSocketApi, WebSocketStage} from "@aws-cdk/aws-apigatewayv2-alpha";
import {WebSocketLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {Stack, StackProps} from "aws-cdk-lib";
import * as path from "path";
import {AttributeType, BillingMode, Table} from "aws-cdk-lib/aws-dynamodb";

export class PlanningPokerServerStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const nameToFunction = (name: string) =>
            new NodejsFunction(this, name, {
                entry: path.join(__dirname, `../src/functions/${name}/index.ts`),
                functionName: name,
            });

        const [onConnect, joinRoom, resetRoom, submitCard, onDisconnect, defaultFunc]: NodejsFunction[]
            = ['onConnect', 'joinRoom', 'resetRoom', 'submitCard', 'onDisconnect', 'default']
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

        api.addRoute('joinRoom', {
            integration: new WebSocketLambdaIntegration('joinRoomIntegration', joinRoom),
        });
        api.addRoute('resetRoom', {
            integration: new WebSocketLambdaIntegration('resetRoomIntegration', resetRoom),
        });
        api.addRoute('submitCard', {
            integration: new WebSocketLambdaIntegration('submitCardIntegration', submitCard)
        });
        api.grantManageConnections(onConnect);
        api.grantManageConnections(joinRoom);
        api.grantManageConnections(submitCard);
        api.grantManageConnections(onDisconnect);
        api.grantManageConnections(defaultFunc);
        api.grantManageConnections(resetRoom);

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
        table.grantFullAccess(joinRoom);
        table.grantFullAccess(submitCard);
        table.grantFullAccess(onDisconnect);
        table.grantFullAccess(defaultFunc);
        table.grantFullAccess(resetRoom);

    }
}
