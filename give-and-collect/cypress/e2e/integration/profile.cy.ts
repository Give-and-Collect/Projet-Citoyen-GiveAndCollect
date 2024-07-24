describe('Gestion de profil', () => {
    beforeEach(() => {
        // Se connecter avant chaque test
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type(Cypress.env('CYPRESS_EMAIL'), { delay: 100 });
        cy.get('input[name="password"]').type(Cypress.env('CYPRESS_PASSWORD'), { delay: 100 });
        cy.get('button').contains('Se connecter').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('Test complet de la gestion du profil utilisateur', () => {
        // Accéder à la page de profil
        cy.visit('http://localhost:3000/profile');

        // Modifier les informations du profil
        cy.get('button').contains('Modifier').click();
        cy.get('input[name="firstname"]').clear().type('Admin', { delay: 100 });
        cy.get('input[name="lastname"]').clear().type('Admin', { delay: 100 });
        cy.get('input[name="phone"]').clear().type('1234567890', { delay: 100 });
        cy.get('input[name="email"]').clear().type(Cypress.env('CYPRESS_EMAIL'), { delay: 100 });
        cy.get('input[name="nomOrganisation"]').clear().type('Cypress', { delay: 100 });

        // Enregistrer les modifications
        cy.get('button').contains('Enregistrer').click();

        // Vérifier la mise à jour des informations
        cy.get('input[name="firstname"]').should('have.value', 'Admin');
        cy.get('input[name="lastname"]').should('have.value', 'Admin');
        cy.get('input[name="phone"]').should('have.value', '1234567890');
        cy.get('input[name="email"]').should('have.value', Cypress.env('CYPRESS_EMAIL'));
        cy.get('input[name="nomOrganisation"]').should('have.value', 'Cypress');
    });
});
