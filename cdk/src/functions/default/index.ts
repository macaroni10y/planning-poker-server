import type {
	APIGatewayProxyWebsocketEventV2,
	APIGatewayProxyWebsocketHandlerV2,
} from "aws-lambda";
import type { ActionParams } from "../../types/actionParams";
import { joinRoomUsecase } from "../../usecase/joinRoomUsecase";
import { resetRoomUsecase } from "../../usecase/resetRoomUsecase";
import { revealAllCardsUsecase } from "../../usecase/revealAllCardsUsecase";
import { submitCardUsecase } from "../../usecase/submitCardUsecase";
import { reactionUsecase } from "../../usecase/reactionUsecase";
import { resetTimerUsecase } from "../../usecase/resetTimerUsecase";
import { pauseTimerUsecase } from "../../usecase/pauseTimerUsecase";
import { resumeTimerUsecase } from "../../usecase/resumeTimerUsecase";

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
			await joinRoomUsecase(params);
			break;
		case "submitCard":
			await submitCardUsecase(params);
			break;
		case "revealAllCards":
			await revealAllCardsUsecase(params);
			break;
		case "resetRoom":
			await resetRoomUsecase(params);
			break;
		case "resetTimer":
			await resetTimerUsecase(params);
			break;
		case "pauseTimer":
			await pauseTimerUsecase(params)
			break;
		case "resumeTimer":
			await resumeTimerUsecase(params);
			break;
		case "reaction":
			await reactionUsecase(params);
			break;
		default:
			break;
	}
};
