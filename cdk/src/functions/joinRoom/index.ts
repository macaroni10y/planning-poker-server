
import { APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
import PlanningPokerRepository from "../../repository/PlanningPokerRepository";
const repository = new PlanningPokerRepository();
export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: any) => {
    await repository.registerUser({
        clientId: event.requestContext.connectionId,
        roomId: event.body.roomId,
        name: event.body.username,
        cardNumber: null,
    });
    console.log('Received event:', JSON.stringify(event, null, 2));
    return {
        statusCode: 200,
        body: 'Hello from connection!',
    };
}
