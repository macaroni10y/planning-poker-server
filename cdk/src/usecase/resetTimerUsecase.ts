import { notificationService } from "../service/NotificationService";
import { ResetTimerParams } from "../types/actionParams";

export const resetTimerUsecase = async (body: ResetTimerParams) => {
    await notificationService.notifyTimer({type: body.type, roomId: body.roomId});
}
