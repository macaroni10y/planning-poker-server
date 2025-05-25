import { notificationService } from "../../service/NotificationService";
import { ResumeTimerParams } from "../../types/actionParams";

export const resumeTimer = async (body: ResumeTimerParams) => {
    await notificationService.notifyTimer(
                    body.type,
                    body.roomId,
                    body.time,
                );
}
