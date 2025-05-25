import { notificationService } from "../service/NotificationService";
import type { ResetTimerParams } from "../types/actionParams";

export const resetTimerUsecase = async (body: ResetTimerParams) => {
    await notificationService.notifyTimer({
        type: body.type,
        roomId: body.roomId,
    });
};
