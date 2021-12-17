import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Produit e2e test', () => {
  const produitPageUrl = '/produit';
  const produitPageUrlPattern = new RegExp('/produit(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const produitSample = {};

  let produit: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/produits+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/produits').as('postEntityRequest');
    cy.intercept('DELETE', '/api/produits/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (produit) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/produits/${produit.id}`,
      }).then(() => {
        produit = undefined;
      });
    }
  });

  it('Produits menu should load Produits page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('produit');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Produit').should('exist');
    cy.url().should('match', produitPageUrlPattern);
  });

  describe('Produit page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(produitPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Produit page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/produit/new$'));
        cy.getEntityCreateUpdateHeading('Produit');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', produitPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/produits',
          body: produitSample,
        }).then(({ body }) => {
          produit = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/produits+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [produit],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(produitPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Produit page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('produit');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', produitPageUrlPattern);
      });

      it('edit button click should load edit Produit page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Produit');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', produitPageUrlPattern);
      });

      it('last delete button click should delete instance of Produit', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('produit').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', produitPageUrlPattern);

        produit = undefined;
      });
    });
  });

  describe('new Produit page', () => {
    beforeEach(() => {
      cy.visit(`${produitPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Produit');
    });

    it('should create an instance of Produit', () => {
      cy.get(`[data-cy="nom"]`).type('mission-critical Midi-Pyrénées Garden').should('have.value', 'mission-critical Midi-Pyrénées Garden');

      cy.get(`[data-cy="vendableUnite"]`).should('not.be.checked');
      cy.get(`[data-cy="vendableUnite"]`).click().should('be.checked');

      cy.get(`[data-cy="prix"]`).type('17734').should('have.value', '17734');

      cy.get(`[data-cy="quantite"]`).type('73465').should('have.value', '73465');

      cy.get(`[data-cy="pas"]`).type('16451').should('have.value', '16451');

      cy.get(`[data-cy="description"]`).type('Dollar tan').should('have.value', 'Dollar tan');

      cy.get(`[data-cy="provenance"]`).type('integrate Grenade Ergonomic').should('have.value', 'integrate Grenade Ergonomic');

      cy.get(`[data-cy="image"]`).type('Basse-Normandie portals République').should('have.value', 'Basse-Normandie portals République');

      cy.get(`[data-cy="saison"]`).select('PRINTEMPS');

      cy.get(`[data-cy="numeroVersion"]`).type('8210').should('have.value', '8210');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        produit = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', produitPageUrlPattern);
    });
  });
});
