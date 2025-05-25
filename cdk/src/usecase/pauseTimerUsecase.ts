import { notificationService } from "../service/NotificationService";
import { PauseTimerParams } from "../types/actionParams";

export const pauseTimerUsecase = async (body: PauseTimerParams) => {
    await notificationService.notifyTimer(
                    body.type,
                    body.roomId,
                    body.time,
                );
}
