describe('Statistics Page', () => {
    beforeEach(() => {
        // Se connecter avant chaque test
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type(Cypress.env('CYPRESS_EMAIL'), { delay: 100 });
        cy.get('input[name="password"]').type(Cypress.env('CYPRESS_PASSWORD'), { delay: 100 });
        cy.get('button').contains('Se connecter').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('Test the consultation of statistics', () => {
        cy.visit('http://localhost:3000/admin/stats');

        // Vérifier que les cartes statistiques sont présentes et affichent les labels corrects
        cy.contains('Nombre d\'annonces').should('be.visible');
        cy.contains('Nombre d\'événements').should('be.visible');
        cy.contains('Nombre d\'utilisateurs').should('be.visible');
    });
});
