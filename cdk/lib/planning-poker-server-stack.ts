import {Construct} from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {WebSocketApi, WebSocketStage} from "@aws-cdk/aws-apigatewayv2-alpha";
import {WebSocketLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {Stack, StackProps} from "aws-cdk-lib";


export class PlanningPokerServerStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const onConnect = new NodejsFunction(this, 'onConnect', {
            functionName: 'onConnect',
        });
        const onMessage = new NodejsFunction(this, 'onMessage', {
            functionName: 'onMessage',
        });
        const onDisconnect = new NodejsFunction(this, 'onDisconnect', {
            functionName: 'onDisconnect',
        });
        const defaultFunc = new NodejsFunction(this, 'default', {
            functionName: 'default',
        });

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

        api.addRoute('send-message', {
            integration: new WebSocketLambdaIntegration('messageIntegration', onMessage),
        });
        api.grantManageConnections(onConnect);
        api.grantManageConnections(onDisconnect);
        api.grantManageConnections(defaultFunc);
        api.grantManageConnections(onMessage);

        new WebSocketStage(this, 'planningPokerServerStage', {
            stageName: 'v1',
            webSocketApi: api,
        });
    }
}
