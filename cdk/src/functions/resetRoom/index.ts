
import { APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
import PlanningPokerRepository, {User} from "../../repository/PlanningPokerRepository";
import {sendMessageToClient} from "../../service/webSocketSender";

const repository = new PlanningPokerRepository();
export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const user: User = JSON.parse(event.body ?? "{}");
    await repository.updateAllCardNumberInRoom(user.roomId, null);
    const endpoint = event.requestContext.domainName + '/' + event.requestContext.stage;
    const data = await repository.findUsersInRoom(user.roomId);
    await sendMessageToClient(endpoint, event.requestContext.connectionId, JSON.stringify(data));
    return {
        statusCode: 200,
        body: 'Hello from resetRoom!',
    };
}
