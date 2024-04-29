import {joinRoom} from "../../../src/functions/default/joinRoom";
import {planningPokerRepository} from "../../../src/repository/PlanningPokerRepository";
import {JoinRoomParams} from "../../../src/types/actionParams";

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
        const body: JoinRoomParams = {
            type: 'joinRoom',
            roomId: '__room_id__',
            userName: '__user_name__',
            clientId: '__client_id__'
        };
        registerUserSpy.mockResolvedValue(undefined);

        // when
        await joinRoom(body);

        // then
        expect(registerUserSpy)
            .toHaveBeenCalledWith({
                clientId: '__client_id__',
                roomId: '__room_id__',
                name: '__user_name__',
                cardNumber: 'not yet',
            });
    });
    it('should occur error when registration fails', async () => {
        // given
        const body: JoinRoomParams = {
            type: 'joinRoom',
            roomId: '__room_id__',
            userName: '__user_name__',
            clientId: '__client_id__'
        };
        registerUserSpy.mockRejectedValue(new Error('test error'));

        // when
        const promise = joinRoom(body);
        await expect(promise).rejects.toThrow();
    });
});
