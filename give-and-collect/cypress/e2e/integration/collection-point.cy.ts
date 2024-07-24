describe('Tests E2E - Gestion des points de collecte', () => {
    beforeEach(() => {
        // Se connecter avant chaque test
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type(Cypress.env('CYPRESS_EMAIL'), { delay: 100 });
        cy.get('input[name="password"]').type(Cypress.env('CYPRESS_PASSWORD'), { delay: 100 });
        cy.get('button').contains('Se connecter').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('Ajout, vérification et suppression d\'un point de collecte', () => {
        cy.visit('http://localhost:3000/admin/collection-point');

        // Ouvrir le formulaire d'ajout
        cy.get('[data-testid="add-button"]').click();

        // Remplir et soumettre le formulaire
        cy.get('label').contains('Adresse').parent().find('input').type('adresse de test', { delay: 100 });
        cy.get('label').contains('Ville').parent().find('input').type('Sample City', { delay: 100 });
        cy.get('label').contains('Code Postal').parent().find('input').type('12345', { delay: 100 });
        cy.get('label').contains('Latitude').parent().find('input').type('48.8566', { delay: 100 });
        cy.get('label').contains('Longitude').parent().find('input').type('2.3522', { delay: 100 });
        cy.get('label').contains('Description').parent().find('input').type('Sample description', { delay: 100 });

        // Vérifier que le bouton "Ajouter" est visible et cliquer dessus
        cy.get('[data-testid="submit-button"]').should('be.visible').click();

        // Vérifier que la description existe déjà
        cy.get('label').contains('Description').parent().find('input').should('be.visible').type('Sample description');

        // Supprimer le point de collecte
        cy.get('[data-testid^="delete-button"]').first().click();

        // Vérifiez que le point de collecte a été supprimé
        cy.wait(1000);
        cy.contains('Sample description').should('not.exist');
    });
});
