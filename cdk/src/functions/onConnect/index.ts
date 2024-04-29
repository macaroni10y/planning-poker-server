import {APIGatewayProxyWebsocketEventV2, APIGatewayProxyWebsocketHandlerV2} from 'aws-lambda';

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event : APIGatewayProxyWebsocketEventV2) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    return {
        statusCode: 200,
        body: 'succeeded to connect.',
    };
}
