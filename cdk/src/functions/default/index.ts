import {APIGatewayProxyWebsocketEventV2, APIGatewayProxyWebsocketHandlerV2} from 'aws-lambda';
import {joinRoom} from "./joinRoom";
import {submitCard} from "./submitCard";
import {revealAllCards} from "./revealAllCards";
import {NotificationService} from "../../service/NotificationService";
import {resetRoom} from "./resetRoom";
import {
    ActionParams
} from "../../types/actionParams";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2) => {
    console.info('Received event:', JSON.stringify(event, null, 2));
    const body = JSON.parse(event.body ?? '{}');
    const routeKey = event.requestContext.routeKey;
    try {
        await route({type: routeKey, clientId: event.requestContext.connectionId, ...body});
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

const route = async (params: ActionParams) => {
    switch (params.type) {
        case 'joinRoom':
            await joinRoom(params);
            break;
        case 'submitCard':
            await submitCard(params);
            break;
        case 'revealAllCards':
            await revealAllCards(params);
            break;
        case 'resetRoom':
            await resetRoom(params);
            break;
        default:
            break;
    }
};
