import { notificationService } from "../service/NotificationService";
import { ResumeTimerParams } from "../types/actionParams";

export const resumeTimerUsecase = async (body: ResumeTimerParams) => {
    await notificationService.notifyTimer(
                    body.type,
                    body.roomId,
                    body.time,
                );
}
