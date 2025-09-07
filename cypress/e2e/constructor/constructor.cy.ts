describe('Конструктор', function () {
  this.beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.visit('http://localhost:4000', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'Bearer test-access');
        win.localStorage.setItem('refreshToken', 'test-refresh');
      }
    });
  });
  it('добавление ингредиентов', () => {
    const ingredient = cy.get('[data-cy="2"]');
    ingredient.find('button').click();
    const constructorIngredient = cy.get('[data-cy="constructor-ingredient-2"]');
    constructorIngredient.contains('Филе Люминесцентного тетраодонтиформа');
  });

  it('открытие модальных окон', () => {
    const ingredient = cy.get('[data-cy="1"]');
    ingredient.click();
    const ingredientDetails = cy.get('[data-cy="ingredient-details-1"]');
    ingredientDetails.contains('Флюоресцентная булка R2-D3');
    const closeButton = cy.get('[data-cy="close"]');
    closeButton.click();
    ingredientDetails.should('not.exist');
  });

  it('создание заказа', () => {
    cy.get('[data-cy="1"]').find('button').click();
    cy.get('[data-cy="2"]').find('button').click();
    cy.get('[data-cy="order-button"]').find('button').click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').contains('87951');
    const closeButton = cy.get('[data-cy="close"]');
    closeButton.click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="choose-bun"]').should('exist');
    cy.get('[data-cy="choose-ingredient"]').should('exist');
  });
});
