import store from "./store";
import {initialState as ingredientsInitial} from '../slices/IngredientsSlice';
import { getIngredientsApi } from "@api";
import { expect, test, jest } from '@jest/globals';

describe('Инициализация rootReducer', () => {
    it('корректная инициализация rootReducer', () => {
        jest.mock('@api', () => ({
            getIngredientsApi: jest.fn()
        }));
        const state = store.getState();
        expect(Object.keys(state).sort()).toEqual(
            ['ingredients', 'burgerConstructor', 'user', 'feed', 'profileOrders'].sort()
        );

        expect(state.ingredients).toEqual(ingredientsInitial)
    })
})