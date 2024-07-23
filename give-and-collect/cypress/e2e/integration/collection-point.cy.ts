describe('Tests E2E - Gestion des points de collecte', () => {
    beforeEach(() => {
        // Se connecter avant chaque test
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type('admin@example.com');
        cy.get('input[name="password"]').type('Admin.123');
        cy.get('button').contains('Se connecter').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('Ajout, vérification et suppression d\'un point de collecte', () => {
        cy.visit('http://localhost:3000/admin/collection-point');

        // Ouvrir le formulaire d'ajout
        cy.get('[data-testid="add-button"]').click();

        // Remplir et soumettre le formulaire
        cy.get('[data-testid="address-input"]').type('123 Rue de Test');
        cy.get('[data-testid="city-input"]').type('Testville');
        cy.get('[data-testid="postalcode-input"]').type('75001');
        cy.get('[data-testid="latitude-input"]').type('48.8566');
        cy.get('[data-testid="longitude-input"]').type('2.3522');
        cy.get('[data-testid="description-input"]').type('Point de collecte de test');
        cy.get('[data-testid="submit-button"]').click();

        // Vérifier que la description existe déjà
        cy.contains('Point de collecte de test').should('exist');

        // Supprimez le point de collecte
        cy.get('[data-testid="delete-button-1"]').click();

        // Vérifiez que le point de collecte a été supprimé
        cy.wait(1000);
        cy.contains('Le point de collecte a été supprimé.').should('exist');
        cy.get('[data-testid="description-1"]').should('not.exist');
    });
});
