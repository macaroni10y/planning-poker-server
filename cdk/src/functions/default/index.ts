import {APIGatewayProxyWebsocketHandlerV2} from 'aws-lambda';
import {joinRoom} from "./joinRoom";
import {submitCard} from "./submitCard";
import {revealAllCards} from "./revealAllCards";
import {NotificationService} from "../../service/NotificationService";
import {resetRoom} from "./resetRoom";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: any) => {
    console.info('Received event:', JSON.stringify(event, null, 2));
    const body = JSON.parse(event.body ?? '{}');
    const routeKey = event.requestContext.routeKey;
    try {
        await route(body, routeKey, event);
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: `Cannot ${routeKey}.`,
        }
    }
    const {domainName, stage} = event.requestContext;
    await new NotificationService(`${domainName}/${stage}`).notifyCurrentUsers(body.roomId, 'resetRoom' === routeKey);
    return {
        statusCode: 200,
        body: `succeeded to ${routeKey}.`,
    };
}

const route = async (body: any, routeKey: any, event: any) => {
    switch (routeKey) {
        case 'joinRoom':
            await joinRoom(body, event.requestContext.connectionId);
            break;
        case 'submitCard':
            await submitCard(body, event.requestContext.connectionId);
            break;
        case 'revealAllCards':
            await revealAllCards(body);
            break;
        case 'resetRoom':
            await resetRoom(body);
            break;
        default:
            break;
    }
};
