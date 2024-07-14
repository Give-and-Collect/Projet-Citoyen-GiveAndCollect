describe('User authentication', () => {
    it('Complete test of the connection process', () => {
        // Accéder à la page de connexion
        cy.visit('http://localhost:3000/login'); // Assurez-vous de remplacer l'URL par celle de votre page de connexion

        // Entrer les identifiants
        cy.get('input[name="email"]').type('cypress@yopmail.com');
        cy.get('input[name="password"]').type('Cypress.123');

        // Cliquer sur le bouton "Se connecter" en utilisant cy.get
        cy.get('button').contains('Se connecter').click();

        // Attendre que la redirection se produise et vérifier l'URL
        cy.url().should('eq', 'http://localhost:3000/'); // Assurez-vous d'adapter cette URL en fonction de la redirection effective

    });
});
