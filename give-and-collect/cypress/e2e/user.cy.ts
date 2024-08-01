describe('Vérification de la présence d\'un administrateur', () => {
    beforeEach(() => {
        // Se connecter avant chaque test
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type(Cypress.env('CYPRESS_EMAIL'), { delay: 100 });
        cy.get('input[name="password"]').type(Cypress.env('CYPRESS_PASSWORD'), { delay: 100 });
        cy.get('button').contains('Se connecter').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('Vérifie qu\'un utilisateur avec le rôle d\'administrateur est présent', () => {

        cy.visit('http://localhost:3000/admin/users-list');

        // Vérifier si un utilisateur avec le rôle d'administrateur est présent
        cy.get('[data-testid="users-table"]').contains('Admin');
    });
});
