import reducer, {initialState, loginThunk} from "./UserSlice";


describe('Тестирование слайса userSlice', () => {
    const mockUser = {
        email: 'test@test.ru',
        name: 'Test'
    };
    it('request', () => {
        const state = reducer(initialState, {type: loginThunk.pending.type});
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('success', () => {
        const state = reducer(initialState, {type: loginThunk.fulfilled.type, payload: mockUser});
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
    });

    it('failed', () => {
        const error = 'Ошибка авторизации';
        const state = reducer(initialState, {type: loginThunk.rejected.type, error: {message: error}});
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(error);
    });
});