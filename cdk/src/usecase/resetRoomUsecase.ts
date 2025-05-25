import { planningPokerRepository } from "../repository/PlanningPokerRepository";
import { notificationService } from "../service/NotificationService";
import type { ResetRoomParams } from "../types/actionParams";

export const resetRoomUsecase = async (body: ResetRoomParams) => {
		await planningPokerRepository.updateAllCardNumberInRoom(
			body.roomId,
			"not yet"
		);
		await notificationService.notifyCurrentUsers(body.roomId, true);
	};
