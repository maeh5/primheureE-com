package fr.ecom.primheure.web.rest;

import static fr.ecom.primheure.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.ecom.primheure.IntegrationTest;
import fr.ecom.primheure.domain.DetailProduitCommande;
import fr.ecom.primheure.repository.DetailProduitCommandeRepository;
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
 * Integration tests for the {@link DetailProduitCommandeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DetailProduitCommandeResourceIT {

    private static final Integer DEFAULT_QUANTITE = 1;
    private static final Integer UPDATED_QUANTITE = 2;

    private static final BigDecimal DEFAULT_PRIX = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRIX = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/detail-produit-commandes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DetailProduitCommandeRepository detailProduitCommandeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDetailProduitCommandeMockMvc;

    private DetailProduitCommande detailProduitCommande;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DetailProduitCommande createEntity(EntityManager em) {
        DetailProduitCommande detailProduitCommande = new DetailProduitCommande().quantite(DEFAULT_QUANTITE).prix(DEFAULT_PRIX);
        return detailProduitCommande;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DetailProduitCommande createUpdatedEntity(EntityManager em) {
        DetailProduitCommande detailProduitCommande = new DetailProduitCommande().quantite(UPDATED_QUANTITE).prix(UPDATED_PRIX);
        return detailProduitCommande;
    }

    @BeforeEach
    public void initTest() {
        detailProduitCommande = createEntity(em);
    }

    @Test
    @Transactional
    void createDetailProduitCommande() throws Exception {
        int databaseSizeBeforeCreate = detailProduitCommandeRepository.findAll().size();
        // Create the DetailProduitCommande
        restDetailProduitCommandeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(detailProduitCommande))
            )
            .andExpect(status().isCreated());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeCreate + 1);
        DetailProduitCommande testDetailProduitCommande = detailProduitCommandeList.get(detailProduitCommandeList.size() - 1);
        assertThat(testDetailProduitCommande.getQuantite()).isEqualTo(DEFAULT_QUANTITE);
        assertThat(testDetailProduitCommande.getPrix()).isEqualByComparingTo(DEFAULT_PRIX);
    }

    @Test
    @Transactional
    void createDetailProduitCommandeWithExistingId() throws Exception {
        // Create the DetailProduitCommande with an existing ID
        detailProduitCommande.setId(1L);

        int databaseSizeBeforeCreate = detailProduitCommandeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDetailProduitCommandeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(detailProduitCommande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDetailProduitCommandes() throws Exception {
        // Initialize the database
        detailProduitCommandeRepository.saveAndFlush(detailProduitCommande);

        // Get all the detailProduitCommandeList
        restDetailProduitCommandeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(detailProduitCommande.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantite").value(hasItem(DEFAULT_QUANTITE)))
            .andExpect(jsonPath("$.[*].prix").value(hasItem(sameNumber(DEFAULT_PRIX))));
    }

    @Test
    @Transactional
    void getDetailProduitCommande() throws Exception {
        // Initialize the database
        detailProduitCommandeRepository.saveAndFlush(detailProduitCommande);

        // Get the detailProduitCommande
        restDetailProduitCommandeMockMvc
            .perform(get(ENTITY_API_URL_ID, detailProduitCommande.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(detailProduitCommande.getId().intValue()))
            .andExpect(jsonPath("$.quantite").value(DEFAULT_QUANTITE))
            .andExpect(jsonPath("$.prix").value(sameNumber(DEFAULT_PRIX)));
    }

    @Test
    @Transactional
    void getNonExistingDetailProduitCommande() throws Exception {
        // Get the detailProduitCommande
        restDetailProduitCommandeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDetailProduitCommande() throws Exception {
        // Initialize the database
        detailProduitCommandeRepository.saveAndFlush(detailProduitCommande);

        int databaseSizeBeforeUpdate = detailProduitCommandeRepository.findAll().size();

        // Update the detailProduitCommande
        DetailProduitCommande updatedDetailProduitCommande = detailProduitCommandeRepository.findById(detailProduitCommande.getId()).get();
        // Disconnect from session so that the updates on updatedDetailProduitCommande are not directly saved in db
        em.detach(updatedDetailProduitCommande);
        updatedDetailProduitCommande.quantite(UPDATED_QUANTITE).prix(UPDATED_PRIX);

        restDetailProduitCommandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDetailProduitCommande.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDetailProduitCommande))
            )
            .andExpect(status().isOk());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeUpdate);
        DetailProduitCommande testDetailProduitCommande = detailProduitCommandeList.get(detailProduitCommandeList.size() - 1);
        assertThat(testDetailProduitCommande.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testDetailProduitCommande.getPrix()).isEqualTo(UPDATED_PRIX);
    }

    @Test
    @Transactional
    void putNonExistingDetailProduitCommande() throws Exception {
        int databaseSizeBeforeUpdate = detailProduitCommandeRepository.findAll().size();
        detailProduitCommande.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetailProduitCommandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, detailProduitCommande.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(detailProduitCommande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDetailProduitCommande() throws Exception {
        int databaseSizeBeforeUpdate = detailProduitCommandeRepository.findAll().size();
        detailProduitCommande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailProduitCommandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(detailProduitCommande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDetailProduitCommande() throws Exception {
        int databaseSizeBeforeUpdate = detailProduitCommandeRepository.findAll().size();
        detailProduitCommande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailProduitCommandeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(detailProduitCommande))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDetailProduitCommandeWithPatch() throws Exception {
        // Initialize the database
        detailProduitCommandeRepository.saveAndFlush(detailProduitCommande);

        int databaseSizeBeforeUpdate = detailProduitCommandeRepository.findAll().size();

        // Update the detailProduitCommande using partial update
        DetailProduitCommande partialUpdatedDetailProduitCommande = new DetailProduitCommande();
        partialUpdatedDetailProduitCommande.setId(detailProduitCommande.getId());

        partialUpdatedDetailProduitCommande.quantite(UPDATED_QUANTITE).prix(UPDATED_PRIX);

        restDetailProduitCommandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetailProduitCommande.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDetailProduitCommande))
            )
            .andExpect(status().isOk());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeUpdate);
        DetailProduitCommande testDetailProduitCommande = detailProduitCommandeList.get(detailProduitCommandeList.size() - 1);
        assertThat(testDetailProduitCommande.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testDetailProduitCommande.getPrix()).isEqualByComparingTo(UPDATED_PRIX);
    }

    @Test
    @Transactional
    void fullUpdateDetailProduitCommandeWithPatch() throws Exception {
        // Initialize the database
        detailProduitCommandeRepository.saveAndFlush(detailProduitCommande);

        int databaseSizeBeforeUpdate = detailProduitCommandeRepository.findAll().size();

        // Update the detailProduitCommande using partial update
        DetailProduitCommande partialUpdatedDetailProduitCommande = new DetailProduitCommande();
        partialUpdatedDetailProduitCommande.setId(detailProduitCommande.getId());

        partialUpdatedDetailProduitCommande.quantite(UPDATED_QUANTITE).prix(UPDATED_PRIX);

        restDetailProduitCommandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetailProduitCommande.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDetailProduitCommande))
            )
            .andExpect(status().isOk());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeUpdate);
        DetailProduitCommande testDetailProduitCommande = detailProduitCommandeList.get(detailProduitCommandeList.size() - 1);
        assertThat(testDetailProduitCommande.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testDetailProduitCommande.getPrix()).isEqualByComparingTo(UPDATED_PRIX);
    }

    @Test
    @Transactional
    void patchNonExistingDetailProduitCommande() throws Exception {
        int databaseSizeBeforeUpdate = detailProduitCommandeRepository.findAll().size();
        detailProduitCommande.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetailProduitCommandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, detailProduitCommande.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(detailProduitCommande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDetailProduitCommande() throws Exception {
        int databaseSizeBeforeUpdate = detailProduitCommandeRepository.findAll().size();
        detailProduitCommande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailProduitCommandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(detailProduitCommande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDetailProduitCommande() throws Exception {
        int databaseSizeBeforeUpdate = detailProduitCommandeRepository.findAll().size();
        detailProduitCommande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailProduitCommandeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(detailProduitCommande))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DetailProduitCommande in the database
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDetailProduitCommande() throws Exception {
        // Initialize the database
        detailProduitCommandeRepository.saveAndFlush(detailProduitCommande);

        int databaseSizeBeforeDelete = detailProduitCommandeRepository.findAll().size();

        // Delete the detailProduitCommande
        restDetailProduitCommandeMockMvc
            .perform(delete(ENTITY_API_URL_ID, detailProduitCommande.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DetailProduitCommande> detailProduitCommandeList = detailProduitCommandeRepository.findAll();
        assertThat(detailProduitCommandeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
