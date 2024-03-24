import {APIGatewayProxyWebsocketHandlerV2} from 'aws-lambda';
import {planningPokerRepository} from "../../repository/PlanningPokerRepository";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        const body = JSON.parse(event.body ?? '{}');
        await submitCard(body, event.requestContext.connectionId);
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: 'Cannot submit card.'
        }
    }
    return {
        statusCode: 200,
        body: 'succeeded to submit card.',
    };
}

export const submitCard = async (body: any, clientId: string) => {
    await planningPokerRepository.updateCardNumberInRoomAndUser(body.roomId, clientId, body.cardNumber);
}
