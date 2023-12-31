import {APIGatewayProxyWebsocketHandlerV2} from 'aws-lambda';
import {planningPokerRepository} from "../../repository/PlanningPokerRepository";
import {NotificationService} from "../../service/NotificationService";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        const body = JSON.parse(event.body ?? '{}');
        await planningPokerRepository.updateAllCardNumberInRoom(body.roomId, "not yet");
        const {domainName, stage} = event.requestContext;
        await new NotificationService(`${domainName}/${stage}`).notifyCurrentUsers(body.roomId, true);
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: 'Cannot reset room.'
        }
    }
    return {
        statusCode: 200,
        body: 'succeeded to reset room.',
    };
}
