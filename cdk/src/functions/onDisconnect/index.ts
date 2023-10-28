
import { APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
import PlanningPokerRepository from "../../repository/PlanningPokerRepository";
const repository = new PlanningPokerRepository();
export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: any) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    await repository.deleteUser(event.requestContext.connectionId);
    return {
        statusCode: 200,
        body: 'Hello from disconnection!',
    };
}
