import type {
	APIGatewayProxyWebsocketEventV2,
	APIGatewayProxyWebsocketHandlerV2,
} from "aws-lambda";
import type { ActionParams } from "../../types/actionParams";
import { joinRoom } from "./joinRoom";
import { resetRoom } from "./resetRoom";
import { revealAllCards } from "./revealAllCards";
import { submitCard } from "./submitCard";
import { reaction } from "./reaction";
import { resetTimer } from "./resetTimer";
import { pauseTimer } from "./pauseTimer";
import { resumeTimer } from "./resumeTimer";

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
			await resetTimer(params);
			break;
		case "pauseTimer":
			await pauseTimer(params)
			break;
		case "resumeTimer":
			await resumeTimer(params);
			break;
		case "reaction":
			await reaction(params);
			break;
		default:
			break;
	}
};
