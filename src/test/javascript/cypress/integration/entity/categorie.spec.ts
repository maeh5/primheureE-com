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

describe('Categorie e2e test', () => {
  const categoriePageUrl = '/categorie';
  const categoriePageUrlPattern = new RegExp('/categorie(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const categorieSample = {};

  let categorie: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/categories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/categories').as('postEntityRequest');
    cy.intercept('DELETE', '/api/categories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (categorie) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/categories/${categorie.id}`,
      }).then(() => {
        categorie = undefined;
      });
    }
  });

  it('Categories menu should load Categories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('categorie');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Categorie').should('exist');
    cy.url().should('match', categoriePageUrlPattern);
  });

  describe('Categorie page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(categoriePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Categorie page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/categorie/new$'));
        cy.getEntityCreateUpdateHeading('Categorie');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', categoriePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/categories',
          body: categorieSample,
        }).then(({ body }) => {
          categorie = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/categories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [categorie],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(categoriePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Categorie page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('categorie');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', categoriePageUrlPattern);
      });

      it('edit button click should load edit Categorie page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Categorie');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', categoriePageUrlPattern);
      });

      it('last delete button click should delete instance of Categorie', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('categorie').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', categoriePageUrlPattern);

        categorie = undefined;
      });
    });
  });

  describe('new Categorie page', () => {
    beforeEach(() => {
      cy.visit(`${categoriePageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Categorie');
    });

    it('should create an instance of Categorie', () => {
      cy.get(`[data-cy="type"]`).select('AGRUME');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        categorie = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', categoriePageUrlPattern);
    });
  });
});
