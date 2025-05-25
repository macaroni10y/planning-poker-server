import { planningPokerRepository } from "../repository/PlanningPokerRepository";
import { notificationService } from "../service/NotificationService";
import type { JoinRoomParams } from "../types/actionParams";

export const joinRoomUsecase = async (body: JoinRoomParams) => {
	await planningPokerRepository.registerUser({
		clientId: body.clientId,
		roomId: body.roomId,
		name: body.userName,
		cardNumber: "not yet",
	});
	await notificationService.notifyCurrentUsers({roomId: body.roomId});
	await notificationService.notifyTimer({type: "resetTimer", roomId: body.roomId});
};
