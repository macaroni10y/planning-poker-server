import { planningPokerRepository } from "../../repository/PlanningPokerRepository";
import type { JoinRoomParams } from "../../types/actionParams";

export const joinRoom = async (body: JoinRoomParams) => {
	await planningPokerRepository.registerUser({
		clientId: body.clientId,
		roomId: body.roomId,
		name: body.userName,
		cardNumber: "not yet",
	});
};
