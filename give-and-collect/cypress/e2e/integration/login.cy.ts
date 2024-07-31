describe('User authentication', () => {
    it('Complete test of the connection process', () => {
        // Accéder à la page de connexion
        cy.visit('http://ec2-23-21-73-243.compute-1.amazonaws.com/login'); // Assurez-vous de remplacer l'URL par celle de votre page de connexion

        // Entrer les identifiants
        cy.get('input[name="email"]').type(Cypress.env('CYPRESS_EMAIL'), { delay: 100 });
        cy.get('input[name="password"]').type(Cypress.env('CYPRESS_PASSWORD'), { delay: 100 });

        // Cliquer sur le bouton "Se connecter" en utilisant cy.get
        cy.get('button').contains('Se connecter').click();

        // Attendre que la redirection se produise et vérifier l'URL
        cy.url().should('eq', 'http://ec2-23-21-73-243.compute-1.amazonaws.com/'); // Assurez-vous d'adapter cette URL en fonction de la redirection effective

    });
});
