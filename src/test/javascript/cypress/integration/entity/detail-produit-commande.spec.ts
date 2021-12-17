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

describe('DetailProduitCommande e2e test', () => {
  const detailProduitCommandePageUrl = '/detail-produit-commande';
  const detailProduitCommandePageUrlPattern = new RegExp('/detail-produit-commande(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const detailProduitCommandeSample = {};

  let detailProduitCommande: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/detail-produit-commandes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/detail-produit-commandes').as('postEntityRequest');
    cy.intercept('DELETE', '/api/detail-produit-commandes/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (detailProduitCommande) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/detail-produit-commandes/${detailProduitCommande.id}`,
      }).then(() => {
        detailProduitCommande = undefined;
      });
    }
  });

  it('DetailProduitCommandes menu should load DetailProduitCommandes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('detail-produit-commande');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('DetailProduitCommande').should('exist');
    cy.url().should('match', detailProduitCommandePageUrlPattern);
  });

  describe('DetailProduitCommande page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(detailProduitCommandePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create DetailProduitCommande page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/detail-produit-commande/new$'));
        cy.getEntityCreateUpdateHeading('DetailProduitCommande');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', detailProduitCommandePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/detail-produit-commandes',
          body: detailProduitCommandeSample,
        }).then(({ body }) => {
          detailProduitCommande = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/detail-produit-commandes+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [detailProduitCommande],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(detailProduitCommandePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details DetailProduitCommande page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('detailProduitCommande');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', detailProduitCommandePageUrlPattern);
      });

      it('edit button click should load edit DetailProduitCommande page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('DetailProduitCommande');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', detailProduitCommandePageUrlPattern);
      });

      it('last delete button click should delete instance of DetailProduitCommande', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('detailProduitCommande').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', detailProduitCommandePageUrlPattern);

        detailProduitCommande = undefined;
      });
    });
  });

  describe('new DetailProduitCommande page', () => {
    beforeEach(() => {
      cy.visit(`${detailProduitCommandePageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('DetailProduitCommande');
    });

    it('should create an instance of DetailProduitCommande', () => {
      cy.get(`[data-cy="quantite"]`).type('63504').should('have.value', '63504');

      cy.get(`[data-cy="prix"]`).type('85771').should('have.value', '85771');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        detailProduitCommande = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', detailProduitCommandePageUrlPattern);
    });
  });
});
