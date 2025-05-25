import { planningPokerRepository } from "../repository/PlanningPokerRepository";
import { notificationService } from "../service/NotificationService";
import type { SubmitCardParams } from "../types/actionParams";

export const submitCardUsecase = async (body: SubmitCardParams) => {
		await planningPokerRepository.updateCardNumberInRoomAndUser(
			body.roomId,
			body.clientId,
			body.cardNumber
		);
		await notificationService.notifyCurrentUsers({roomId: body.roomId});
	};
