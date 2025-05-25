import type { APIGatewayProxyWebsocketHandlerV2 } from "aws-lambda";
import { planningPokerRepository } from "../../repository/PlanningPokerRepository";
import { notificationService } from "../../service/NotificationService";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    try {
        const found = await planningPokerRepository.findUserById({
            clientId: event.requestContext.connectionId,
        });
        if (found) {
            await planningPokerRepository.deleteUser({
                roomId: found.roomId,
                clientId: event.requestContext.connectionId,
            });
            await notificationService.notifyCurrentUsers({
                roomId: found.roomId,
            });
        }
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: "Cannot disconnect.",
        };
    }
    return {
        statusCode: 200,
        body: "succeeded to disconnect.",
    };
};
