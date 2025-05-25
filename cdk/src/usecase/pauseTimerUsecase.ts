import { notificationService } from "../service/NotificationService";
import { PauseTimerParams } from "../types/actionParams";

export const pauseTimerUsecase = async (body: PauseTimerParams) => {
    await notificationService.notifyTimer(
                    {type: body.type,
                    roomId: body.roomId,
                    time: body.time,}
                );
}
