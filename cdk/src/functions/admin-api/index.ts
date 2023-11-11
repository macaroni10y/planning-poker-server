import {APIGatewayProxyHandlerV2} from "aws-lambda";
import {planningPokerRepository} from "../../repository/PlanningPokerRepository";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    // return null if event.queryStringParameters does not exist
    if (!event.queryStringParameters?.roomId) {
        return {
            statusCode: 400,
            body: 'Bad Request',
        };
    }
    const users = await planningPokerRepository.findUsersInRoom(event.queryStringParameters.roomId);
    return {
        statusCode: 200,
        body: JSON.stringify(users),
    };
}
