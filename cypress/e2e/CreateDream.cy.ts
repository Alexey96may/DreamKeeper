describe('Create Dream E2E Flow', () => {
    beforeEach(() => {
        // Navigate to the dream creation page
        cy.visit('/dream/new');
    });

    it('should successfully fill title and description, and submit a new dream', () => {
        // 1. Verify that we are on the new dream creation page
        cy.get('h1').should('contain', 'Записать новый сон');

        // 2. Fill in the dream title field
        cy.get('input[placeholder*="Полет над древним городом"]')
            .should('be.visible')
            .clear()
            .type('Полет над ночным городом');

        // 3. Fill in the detailed description field
        cy.get('textarea[placeholder*="Запишите все подробности"]')
            .should('be.visible')
            .clear()
            .type('Мне приснилось, что я лечу над крышами старых зданий под звездным небом.');

        // 4. (Optional) Check tab switching, e.g., switch to the details tab
        cy.contains('button', 'Визуал и детали').click();
        // Ensure the tab has switched (e.g., visual style element appears)
        cy.get('select, [role="combobox"]').should('exist');

        // Return to the "Main" tab
        cy.contains('button', 'Основное').click();

        // 5. Click the form submit/create button
        cy.get('button[type="submit"]').should('not.be.disabled').click();

        // 6. Verify that a redirect to the created dream's details page occurred
        cy.url().should('match', /\/dream(s)?\/.+/);
    });

    it('should show validation errors if required fields are empty', () => {
        // Attempt to submit an empty form
        cy.get('button[type="submit"]').click();

        // Check that validation triggered (e.g., required attribute is present)
        cy.get('input[placeholder*="Полет над древним городом"]').should('have.attr', 'required');
    });
});
