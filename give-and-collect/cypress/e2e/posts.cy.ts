describe('creation posts', () => {
    beforeEach(() => {
        // Se connecter avant chaque test
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type(Cypress.env('CYPRESS_EMAIL'), { delay: 100 });
        cy.get('input[name="password"]').type(Cypress.env('CYPRESS_PASSWORD'), { delay: 100 });
        cy.get('button').contains('Se connecter').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('Complete ad creation test', () => {

        cy.visit('http://localhost:3000/posts');

        cy.get('button').contains('Ajouter une annonce', { timeout: 10000 }).should('be.visible').click();

        cy.get('label').contains('Adresse').parent().find('input').should('be.visible').type('adresse de test');
        cy.get('label').contains('Ville').parent().find('input').should('be.visible').type('Sample City');
        cy.get('label').contains('Code Postal').parent().find('input').should('be.visible').type('12345');
        cy.get('label').contains('Description').parent().find('input').should('be.visible').type('Sample description');

        cy.get('[data-testid="type-select"]').parent().should('be.visible').click();
        cy.get('ul[aria-labelledby="type-label"]').first().should('be.visible').click();

        cy.get('[aria-labelledby="type-category-0"]').parent().should('be.visible').click();
        cy.get('ul[aria-labelledby="type-category-0"]').first().should('be.visible').click();

        cy.get('[aria-labelledby="type-genre-0"]').parent().should('be.visible').click();
        cy.get('ul[aria-labelledby="type-genre-0"]').first().should('be.visible').click();

        cy.get('label').contains('Taille').parent().find('input').should('be.visible').type('12345');
        cy.get('label').contains('Quantité').parent().find('input').should('be.visible').type('2');

        cy.get('button').contains('Publier l\'annonce').should('be.visible').click();

        cy.contains('Sample City').should('be.visible');

        // Sélectionner et cliquer sur le dernier bouton de suppression
        cy.get('[data-testid^="delete-button-"]').last().click();

        // Vérifier que l'annonce a été supprimée
        cy.contains('Sample City').should('not.exist');
    });
});
