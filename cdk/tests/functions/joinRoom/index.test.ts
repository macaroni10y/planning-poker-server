import {joinRoom} from "../../../src/functions/default/joinRoom";
import {planningPokerRepository} from "../../../src/repository/PlanningPokerRepository";
import {NotificationService} from "../../../src/service/NotificationService";

describe('joinRoom', () => {
    let registerUserSpy: jest.SpyInstance;
    beforeEach(() => {
        registerUserSpy = jest.spyOn(planningPokerRepository, 'registerUser');
    });

    afterEach(() => {
        registerUserSpy.mockRestore();
    });
    it('should join successfully', async () => {
        // given
        const body = {
            roomId: '__room_id__',
            userName: '__user_name__',
        };
        registerUserSpy.mockResolvedValue(undefined);

        // when
        await joinRoom(body, '__client_id__');

        // then
        expect(registerUserSpy)
            .toHaveBeenCalledWith({
                clientId: '__client_id__',
                roomId: '__room_id__',
                name: '__user_name__',
                cardNumber: 'not yet',
            });
    });
    it('should occur error when the body is invalid', async () => {
        // given
        const body = {
            hoge: '__hoge__',
            fuga: '__fuga__',
        };
        registerUserSpy.mockRejectedValue(new Error('test error'));

        // when
        const promise = joinRoom(body, '__client_id__');
        await expect(promise).rejects.toThrow();
    });
});
