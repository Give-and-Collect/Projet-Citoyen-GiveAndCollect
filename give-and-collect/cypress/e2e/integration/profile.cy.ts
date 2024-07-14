describe('Profile management', () => {
    beforeEach(() => {
        // Se connecter avant chaque test
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type('cypress@yopmail.com');
        cy.get('input[name="password"]').type('Cypress.123');
        cy.get('button').contains('Se connecter').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });


    it('Complete test of user profile management', () => {
        // Accéder à la page de profil
        cy.visit('http://localhost:3000/profile');

        // Modifier les informations du profil
        cy.get('button').contains('Modifier').click();
        cy.get('input[name="firstname"]').clear().type('Cypress');
        cy.get('input[name="lastname"]').clear().type('Cypress');
        cy.get('input[name="phone"]').clear().type('1234567890');
        cy.get('input[name="email"]').clear().type('cypress@yopmail.com');
        cy.get('input[name="nomOrganisation"]').clear().type('Cypress');

        // Enregistrer les modifications
        cy.get('button').contains('Enregistrer').click();


        cy.get('input[name="firstname"]', { timeout: 10000 }).should('have.value', 'Cypress');
        cy.get('input[name="lastname"]', { timeout: 10000 }).should('have.value', 'Cypress');
        cy.get('input[name="phone"]', { timeout: 10000 }).should('have.value', '1234567890');
        cy.get('input[name="email"]', { timeout: 10000 }).should('have.value', 'cypress@yopmail.com');
        cy.get('input[name="nomOrganisation"]', { timeout: 10000 }).should('have.value', 'Cypress');
    });
});
