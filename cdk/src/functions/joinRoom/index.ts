import {APIGatewayProxyWebsocketHandlerV2} from 'aws-lambda';
import {planningPokerRepository} from "../../repository/PlanningPokerRepository";
import {NotificationService} from "../../service/NotificationService";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        await joinRoom(JSON.parse(event.body ?? '{}'), event.requestContext.connectionId);
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: 'Cannot join room.'
        }
    }
    return {
        statusCode: 200,
        body: 'Hello from connection!',
    };
}

export const joinRoom = async (body: any, clientId: string) => {
    await planningPokerRepository.registerUser({
        clientId: clientId,
        roomId: body.roomId,
        name: body.userName,
        cardNumber: "not yet",
    });
}
