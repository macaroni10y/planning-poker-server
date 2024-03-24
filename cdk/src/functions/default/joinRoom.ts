import {planningPokerRepository} from "../../repository/PlanningPokerRepository";

export const joinRoom = async (body: any, clientId: string) => {
    await planningPokerRepository.registerUser({
        clientId: clientId,
        roomId: body.roomId,
        name: body.userName,
        cardNumber: "not yet",
    });
}
