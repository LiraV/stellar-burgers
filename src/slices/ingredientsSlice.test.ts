import { TIngredient } from '@utils-types';
import reducer, { fetchIngredients, initialState } from './IngredientsSlice';

describe('Тестирование слайса IngredientSlice', () => {
  const ingredient1: TIngredient = {
    _id: '1',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  };

  const ingredient2: TIngredient = {
    _id: '2',
    name: 'Филе Люминесцентного тетраодонтиформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const ingredient3: TIngredient = {
    _id: '3',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 300,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  it('request', () => {
    const state = reducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('success', () => {
    const state = reducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: [ingredient1]
    });
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual([ingredient1]);
  });

  it('failed', () => {
    const error = 'Ошибка загрузки данных';
    const state = reducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: error }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error);
  });
});
