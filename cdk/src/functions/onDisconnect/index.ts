import {APIGatewayProxyWebsocketHandlerV2} from 'aws-lambda';
import {planningPokerRepository} from "../../repository/PlanningPokerRepository";
import {NotificationService} from "../../service/NotificationService";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try{
        const found = await planningPokerRepository.findUserById(event.requestContext.connectionId);
        if (found) {
            await planningPokerRepository.deleteUser(found.roomId, event.requestContext.connectionId);
            const {domainName, stage} = event.requestContext;
            await new NotificationService(`${domainName}/${stage}`).notifyCurrentUsers(found.roomId);
        }
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: 'Cannot disconnect.'
        }
    }
    return {
        statusCode: 200,
        body: 'succeeded to disconnect.',
    };
}
