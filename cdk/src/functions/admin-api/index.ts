import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { planningPokerRepository } from "../../repository/PlanningPokerRepository";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.queryStringParameters?.roomId) {
		return {
			statusCode: 400,
			body: "Bad Request dayo",
		};
	}
	try {
		const users = await planningPokerRepository.findUsersInRoom({
			roomId: event.queryStringParameters.roomId,
		});
		return {
			statusCode: 200,
			body: JSON.stringify(users),
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify(err),
		};
	}
};
