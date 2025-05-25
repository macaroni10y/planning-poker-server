import { planningPokerRepository } from "../repository/PlanningPokerRepository";
import { notificationService } from "../service/NotificationService";
import type { ResetRoomParams } from "../types/actionParams";

export const resetRoomUsecase = async (body: ResetRoomParams) => {
    await planningPokerRepository.updateAllCardNumberInRoom({
        roomId: body.roomId,
        cardNumber: "not yet",
    });
    await notificationService.notifyCurrentUsers({
        roomId: body.roomId,
        shouldReset: true,
    });
};
