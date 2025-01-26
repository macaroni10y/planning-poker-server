import type {
	APIGatewayProxyWebsocketEventV2,
	APIGatewayProxyWebsocketHandlerV2,
} from "aws-lambda";
import { NotificationService } from "../../service/NotificationService";
import type { ActionParams } from "../../types/actionParams";
import { joinRoom } from "./joinRoom";
import { resetRoom } from "./resetRoom";
import { revealAllCards } from "./revealAllCards";
import { submitCard } from "./submitCard";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (
	event: APIGatewayProxyWebsocketEventV2,
) => {
	console.info("Received event:", JSON.stringify(event, null, 2));
	const body = JSON.parse(event.body ?? "{}");
	const routeKey = event.requestContext.routeKey;
	const params: ActionParams = {
		type: routeKey,
		clientId: event.requestContext.connectionId,
		...body,
	};
	try {
		await route(params);
	} catch (e) {
		console.error(e);
		return {
			statusCode: 400,
			body: `Cannot ${routeKey}.`,
		};
	}
	const { domainName, stage } = event.requestContext;
	await notify(params, `${domainName}/${stage}`);
	return {
		statusCode: 200,
		body: `succeeded to ${routeKey}.`,
	};
};

const route = async (params: ActionParams) => {
	switch (params.type) {
		case "joinRoom":
			await joinRoom(params);
			break;
		case "submitCard":
			await submitCard(params);
			break;
		case "revealAllCards":
			await revealAllCards(params);
			break;
		case "resetRoom":
			await resetRoom(params);
			break;
		case "resetTimer":
		case "pauseTimer":
		case "resumeTimer":
			console.info(`${params.type} called but there is nothing to do now`);
			break;
		case "reaction":
			console.info(`${params.type} called but there is nothing to do now`);
			break;
		default:
			break;
	}
};

const notify = async (params: ActionParams, endpoint: string) => {
	const notificationService = new NotificationService(endpoint);
	switch (params.type) {
		case "resetTimer":
			await notificationService.notifyTimer(params.type, params.roomId);
			break;
		case "pauseTimer":
		case "resumeTimer":
			await notificationService.notifyTimer(
				params.type,
				params.roomId,
				params.time,
			);
			break;
		case "reaction":
			await notificationService.notifyReaction(
				params.kind,
				params.roomId,
				params.clientId,
			);
			break;
		case "joinRoom":
			await notificationService.notifyCurrentUsers(params.roomId, false);
			await notificationService.notifyTimer("resetTimer", params.roomId);
			break;
		case "submitCard":
		case "revealAllCards":
			await notificationService.notifyCurrentUsers(params.roomId, false);
			break;
		case "resetRoom":
			await notificationService.notifyCurrentUsers(params.roomId, true);
	}
};
