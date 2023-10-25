import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {WebSocketApi, WebSocketStage} from "@aws-cdk/aws-apigatewayv2-alpha";
import {WebSocketLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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
