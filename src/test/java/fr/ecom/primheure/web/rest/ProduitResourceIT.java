package fr.ecom.primheure.web.rest;

import static fr.ecom.primheure.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.ecom.primheure.IntegrationTest;
import fr.ecom.primheure.domain.Produit;
import fr.ecom.primheure.domain.enumeration.Saison;
import fr.ecom.primheure.repository.ProduitRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProduitResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProduitResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final Boolean DEFAULT_VENDABLE_UNITE = false;
    private static final Boolean UPDATED_VENDABLE_UNITE = true;

    private static final BigDecimal DEFAULT_PRIX = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRIX = new BigDecimal(2);

    private static final Integer DEFAULT_QUANTITE = 1;
    private static final Integer UPDATED_QUANTITE = 2;

    private static final Integer DEFAULT_PAS = 1;
    private static final Integer UPDATED_PAS = 2;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PROVENANCE = "AAAAAAAAAA";
    private static final String UPDATED_PROVENANCE = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE = "BBBBBBBBBB";

    private static final Saison DEFAULT_SAISON = Saison.PRINTEMPS;
    private static final Saison UPDATED_SAISON = Saison.ETE;

    private static final Integer DEFAULT_NUMERO_VERSION = 1;
    private static final Integer UPDATED_NUMERO_VERSION = 2;

    private static final String ENTITY_API_URL = "/api/produits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProduitMockMvc;

    private Produit produit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Produit createEntity(EntityManager em) {
        Produit produit = new Produit()
            .nom(DEFAULT_NOM)
            .vendableUnite(DEFAULT_VENDABLE_UNITE)
            .prix(DEFAULT_PRIX)
            .quantite(DEFAULT_QUANTITE)
            .pas(DEFAULT_PAS)
            .description(DEFAULT_DESCRIPTION)
            .provenance(DEFAULT_PROVENANCE)
            .image(DEFAULT_IMAGE)
            .saison(DEFAULT_SAISON)
            .numeroVersion(DEFAULT_NUMERO_VERSION);
        return produit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Produit createUpdatedEntity(EntityManager em) {
        Produit produit = new Produit()
            .nom(UPDATED_NOM)
            .vendableUnite(UPDATED_VENDABLE_UNITE)
            .prix(UPDATED_PRIX)
            .quantite(UPDATED_QUANTITE)
            .pas(UPDATED_PAS)
            .description(UPDATED_DESCRIPTION)
            .provenance(UPDATED_PROVENANCE)
            .image(UPDATED_IMAGE)
            .saison(UPDATED_SAISON)
            .numeroVersion(UPDATED_NUMERO_VERSION);
        return produit;
    }

    @BeforeEach
    public void initTest() {
        produit = createEntity(em);
    }

    @Test
    @Transactional
    void createProduit() throws Exception {
        int databaseSizeBeforeCreate = produitRepository.findAll().size();
        // Create the Produit
        restProduitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produit)))
            .andExpect(status().isCreated());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeCreate + 1);
        Produit testProduit = produitList.get(produitList.size() - 1);
        assertThat(testProduit.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testProduit.getVendableUnite()).isEqualTo(DEFAULT_VENDABLE_UNITE);
        assertThat(testProduit.getPrix()).isEqualByComparingTo(DEFAULT_PRIX);
        assertThat(testProduit.getQuantite()).isEqualTo(DEFAULT_QUANTITE);
        assertThat(testProduit.getPas()).isEqualTo(DEFAULT_PAS);
        assertThat(testProduit.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProduit.getProvenance()).isEqualTo(DEFAULT_PROVENANCE);
        assertThat(testProduit.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testProduit.getSaison()).isEqualTo(DEFAULT_SAISON);
        assertThat(testProduit.getNumeroVersion()).isEqualTo(DEFAULT_NUMERO_VERSION);
    }

    @Test
    @Transactional
    void createProduitWithExistingId() throws Exception {
        // Create the Produit with an existing ID
        produit.setId(1L);

        int databaseSizeBeforeCreate = produitRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProduitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produit)))
            .andExpect(status().isBadRequest());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProduits() throws Exception {
        // Initialize the database
        produitRepository.saveAndFlush(produit);

        // Get all the produitList
        restProduitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(produit.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].vendableUnite").value(hasItem(DEFAULT_VENDABLE_UNITE.booleanValue())))
            .andExpect(jsonPath("$.[*].prix").value(hasItem(sameNumber(DEFAULT_PRIX))))
            .andExpect(jsonPath("$.[*].quantite").value(hasItem(DEFAULT_QUANTITE)))
            .andExpect(jsonPath("$.[*].pas").value(hasItem(DEFAULT_PAS)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].provenance").value(hasItem(DEFAULT_PROVENANCE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.[*].saison").value(hasItem(DEFAULT_SAISON.toString())))
            .andExpect(jsonPath("$.[*].numeroVersion").value(hasItem(DEFAULT_NUMERO_VERSION)));
    }

    @Test
    @Transactional
    void getProduit() throws Exception {
        // Initialize the database
        produitRepository.saveAndFlush(produit);

        // Get the produit
        restProduitMockMvc
            .perform(get(ENTITY_API_URL_ID, produit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(produit.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.vendableUnite").value(DEFAULT_VENDABLE_UNITE.booleanValue()))
            .andExpect(jsonPath("$.prix").value(sameNumber(DEFAULT_PRIX)))
            .andExpect(jsonPath("$.quantite").value(DEFAULT_QUANTITE))
            .andExpect(jsonPath("$.pas").value(DEFAULT_PAS))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.provenance").value(DEFAULT_PROVENANCE))
            .andExpect(jsonPath("$.image").value(DEFAULT_IMAGE))
            .andExpect(jsonPath("$.saison").value(DEFAULT_SAISON.toString()))
            .andExpect(jsonPath("$.numeroVersion").value(DEFAULT_NUMERO_VERSION));
    }

    @Test
    @Transactional
    void getNonExistingProduit() throws Exception {
        // Get the produit
        restProduitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProduit() throws Exception {
        // Initialize the database
        produitRepository.saveAndFlush(produit);

        int databaseSizeBeforeUpdate = produitRepository.findAll().size();

        // Update the produit
        Produit updatedProduit = produitRepository.findById(produit.getId()).get();
        // Disconnect from session so that the updates on updatedProduit are not directly saved in db
        em.detach(updatedProduit);
        updatedProduit
            .nom(UPDATED_NOM)
            .vendableUnite(UPDATED_VENDABLE_UNITE)
            .prix(UPDATED_PRIX)
            .quantite(UPDATED_QUANTITE)
            .pas(UPDATED_PAS)
            .description(UPDATED_DESCRIPTION)
            .provenance(UPDATED_PROVENANCE)
            .image(UPDATED_IMAGE)
            .saison(UPDATED_SAISON)
            .numeroVersion(UPDATED_NUMERO_VERSION);

        restProduitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProduit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProduit))
            )
            .andExpect(status().isOk());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeUpdate);
        Produit testProduit = produitList.get(produitList.size() - 1);
        assertThat(testProduit.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testProduit.getVendableUnite()).isEqualTo(UPDATED_VENDABLE_UNITE);
        assertThat(testProduit.getPrix()).isEqualTo(UPDATED_PRIX);
        assertThat(testProduit.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testProduit.getPas()).isEqualTo(UPDATED_PAS);
        assertThat(testProduit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProduit.getProvenance()).isEqualTo(UPDATED_PROVENANCE);
        assertThat(testProduit.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testProduit.getSaison()).isEqualTo(UPDATED_SAISON);
        assertThat(testProduit.getNumeroVersion()).isEqualTo(UPDATED_NUMERO_VERSION);
    }

    @Test
    @Transactional
    void putNonExistingProduit() throws Exception {
        int databaseSizeBeforeUpdate = produitRepository.findAll().size();
        produit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProduitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, produit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProduit() throws Exception {
        int databaseSizeBeforeUpdate = produitRepository.findAll().size();
        produit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProduit() throws Exception {
        int databaseSizeBeforeUpdate = produitRepository.findAll().size();
        produit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProduitWithPatch() throws Exception {
        // Initialize the database
        produitRepository.saveAndFlush(produit);

        int databaseSizeBeforeUpdate = produitRepository.findAll().size();

        // Update the produit using partial update
        Produit partialUpdatedProduit = new Produit();
        partialUpdatedProduit.setId(produit.getId());

        partialUpdatedProduit.prix(UPDATED_PRIX).quantite(UPDATED_QUANTITE).pas(UPDATED_PAS).numeroVersion(UPDATED_NUMERO_VERSION);

        restProduitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProduit))
            )
            .andExpect(status().isOk());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeUpdate);
        Produit testProduit = produitList.get(produitList.size() - 1);
        assertThat(testProduit.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testProduit.getVendableUnite()).isEqualTo(DEFAULT_VENDABLE_UNITE);
        assertThat(testProduit.getPrix()).isEqualByComparingTo(UPDATED_PRIX);
        assertThat(testProduit.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testProduit.getPas()).isEqualTo(UPDATED_PAS);
        assertThat(testProduit.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProduit.getProvenance()).isEqualTo(DEFAULT_PROVENANCE);
        assertThat(testProduit.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testProduit.getSaison()).isEqualTo(DEFAULT_SAISON);
        assertThat(testProduit.getNumeroVersion()).isEqualTo(UPDATED_NUMERO_VERSION);
    }

    @Test
    @Transactional
    void fullUpdateProduitWithPatch() throws Exception {
        // Initialize the database
        produitRepository.saveAndFlush(produit);

        int databaseSizeBeforeUpdate = produitRepository.findAll().size();

        // Update the produit using partial update
        Produit partialUpdatedProduit = new Produit();
        partialUpdatedProduit.setId(produit.getId());

        partialUpdatedProduit
            .nom(UPDATED_NOM)
            .vendableUnite(UPDATED_VENDABLE_UNITE)
            .prix(UPDATED_PRIX)
            .quantite(UPDATED_QUANTITE)
            .pas(UPDATED_PAS)
            .description(UPDATED_DESCRIPTION)
            .provenance(UPDATED_PROVENANCE)
            .image(UPDATED_IMAGE)
            .saison(UPDATED_SAISON)
            .numeroVersion(UPDATED_NUMERO_VERSION);

        restProduitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProduit))
            )
            .andExpect(status().isOk());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeUpdate);
        Produit testProduit = produitList.get(produitList.size() - 1);
        assertThat(testProduit.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testProduit.getVendableUnite()).isEqualTo(UPDATED_VENDABLE_UNITE);
        assertThat(testProduit.getPrix()).isEqualByComparingTo(UPDATED_PRIX);
        assertThat(testProduit.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testProduit.getPas()).isEqualTo(UPDATED_PAS);
        assertThat(testProduit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProduit.getProvenance()).isEqualTo(UPDATED_PROVENANCE);
        assertThat(testProduit.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testProduit.getSaison()).isEqualTo(UPDATED_SAISON);
        assertThat(testProduit.getNumeroVersion()).isEqualTo(UPDATED_NUMERO_VERSION);
    }

    @Test
    @Transactional
    void patchNonExistingProduit() throws Exception {
        int databaseSizeBeforeUpdate = produitRepository.findAll().size();
        produit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProduitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, produit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProduit() throws Exception {
        int databaseSizeBeforeUpdate = produitRepository.findAll().size();
        produit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProduit() throws Exception {
        int databaseSizeBeforeUpdate = produitRepository.findAll().size();
        produit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(produit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Produit in the database
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProduit() throws Exception {
        // Initialize the database
        produitRepository.saveAndFlush(produit);

        int databaseSizeBeforeDelete = produitRepository.findAll().size();

        // Delete the produit
        restProduitMockMvc
            .perform(delete(ENTITY_API_URL_ID, produit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Produit> produitList = produitRepository.findAll();
        assertThat(produitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
