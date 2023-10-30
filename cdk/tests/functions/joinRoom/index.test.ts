import {joinRoom} from "../../../src/functions/joinRoom";
import {planningPokerRepository} from "../../../src/repository/PlanningPokerRepository";
import {NotificationService} from "../../../src/service/NotificationService";

describe('joinRoom', () => {
    let registerUserSpy: jest.SpyInstance;
    let notifyMock: jest.SpyInstance;
    beforeEach(() => {
        registerUserSpy = jest.spyOn(planningPokerRepository, 'registerUser');
        notifyMock = jest.spyOn(NotificationService.prototype, 'notifyCurrentUsers');
    });

    afterEach(() => {
        registerUserSpy.mockRestore();
        notifyMock.mockRestore();
    });
    it('should join successfully', async () => {
        // given
        const body = {
            roomId: '__room_id__',
            userName: '__user_name__',
        };
        registerUserSpy.mockResolvedValue(undefined);
        notifyMock.mockResolvedValue(undefined);

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
    });
    it('should occur error when the body is invalid', async () => {
        // given
        const body = {
            hoge: '__hoge__',
            fuga: '__fuga__',
        };
        registerUserSpy.mockRejectedValue(new Error('test error'));
        notifyMock.mockResolvedValue(undefined);

        // when
        const promise = joinRoom(body, '__client_id__', '__domain_name__', '__stage__');
        await expect(promise).rejects.toThrow();
    });
    it('should occur error when notification failed', async () => {
        // given
        const body = {
            roomId: '__room_id__',
            userName: '__user_name__',
        };
        registerUserSpy.mockResolvedValue(undefined);
        notifyMock.mockRejectedValue(new Error('test error'));

        // when
        const promise = joinRoom(body, '__client_id__', '__domain_name__', '__stage__');
        await expect(promise).rejects.toThrow();
    });
});
