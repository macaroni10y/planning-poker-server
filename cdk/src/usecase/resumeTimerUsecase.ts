import { notificationService } from "../service/NotificationService";
import type { ResumeTimerParams } from "../types/actionParams";

export const resumeTimerUsecase = async (body: ResumeTimerParams) => {
    await notificationService.notifyTimer({
        type: body.type,
        roomId: body.roomId,
        time: body.time,
    });
};
