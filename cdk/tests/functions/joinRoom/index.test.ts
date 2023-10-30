import {joinRoom} from "../../../src/functions/joinRoom";
import {planningPokerRepository} from "../../../src/repository/PlanningPokerRepository";
import {NotificationService} from "../../../src/service/NotificationService";

describe('joinRoom', () => {
    it('should join successfully', async () => {
        // given
        const body = {
            roomId: '__room_id__',
            userName: '__user_name__',
        };
        const registerUserSpy = jest.spyOn(planningPokerRepository, 'registerUser').mockResolvedValue();
        const notifyMock = jest.spyOn(NotificationService.prototype, 'notifyCurrentUsers').mockResolvedValue();

        // when
        await joinRoom(body, '__client_id__', '__domain_name__', '__stage__');

        // then
        expect(registerUserSpy)
            .toHaveBeenCalledWith({
                clientId: '__client_id__',
                roomId: '__room_id__',
                name: '__user_name__',
                cardNumber: null,
            });
        expect(notifyMock).toHaveBeenCalledWith('__room_id__');

        // teardown
        registerUserSpy.mockRestore();
        notifyMock.mockRestore();
    });
    it('should occur error when the body is invalid', async () => {
        // given
        const body = {
            hoge: '__hoge__',
            fuga: '__fuga__',
        };
        const registerUserSpy = jest.spyOn(planningPokerRepository, 'registerUser').mockRejectedValue(new Error('test error'));
        const notifyMock = jest.spyOn(NotificationService.prototype, 'notifyCurrentUsers');

        // when
        const promise = joinRoom(body, '__client_id__', '__domain_name__', '__stage__');
        await expect(promise).rejects.toThrow();

        // teardown
        registerUserSpy.mockRestore();
        notifyMock.mockRestore();
    });
    it('should occur error when notification failed', async () => {
        // given
        const body = {
            roomId: '__room_id__',
            userName: '__user_name__',
        };
        const registerUserSpy = jest.spyOn(planningPokerRepository, 'registerUser').mockResolvedValue();
        const notifyMock = jest.spyOn(NotificationService.prototype, 'notifyCurrentUsers').mockRejectedValue(new Error('test error'));

        // when
        const promise = joinRoom(body, '__client_id__', '__domain_name__', '__stage__');
        await expect(promise).rejects.toThrow();

        // teardown
        registerUserSpy.mockRestore();
        notifyMock.mockRestore();
    });

});
