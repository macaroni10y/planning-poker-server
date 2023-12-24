import {APIGatewayProxyWebsocketHandlerV2} from "aws-lambda";
import {NotificationService} from "../../service/NotificationService";
import {planningPokerRepository} from "../../repository/PlanningPokerRepository";


export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        const body = JSON.parse(event.body ?? '{}');
        const {domainName, stage} = event.requestContext;
        await revealAllCards(body);
        await new NotificationService(`${domainName}/${stage}`).notifyCurrentUsers(body.roomId);
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: 'Cannot reveal cards.',
        }
    }
    return {
        statusCode: 200,
        body: 'succeeded to reveal cards.',
    }
}

/**
 * set all card numbers to 'skip' for users who have not yet voted
 * @param body
 */
export const revealAllCards = async (body: any) => {
    const users = await planningPokerRepository.findUsersInRoom(body.roomId);
    const updatePromises = users
        .filter(user => !user.cardNumber)
        .map(user => planningPokerRepository.updateCardNumberInRoomAndUser(user.roomId, user.clientId, 'skip'));
    await Promise.all(updatePromises);
}
