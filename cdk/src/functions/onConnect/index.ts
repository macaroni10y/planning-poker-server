
import { APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: any) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    return {
        statusCode: 200,
        body: 'Hello from connection!',
    };
}
