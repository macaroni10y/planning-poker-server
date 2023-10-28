import {APIGatewayProxyWebsocketHandlerV2} from 'aws-lambda';
import {planningPokerRepository} from "../../repository/PlanningPokerRepository";
import {NotificationService} from "../../service/NotificationService";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        const body = JSON.parse(event.body ?? '{}');
        await planningPokerRepository.registerUser({
            clientId: event.requestContext.connectionId,
            roomId: body.roomId,
            name: body.userName,
            cardNumber: null,
        });
        const {domainName, stage} = event.requestContext;
        await new NotificationService(`${domainName}/${stage}`).notifyCurrentUsers(body.roomId);
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
