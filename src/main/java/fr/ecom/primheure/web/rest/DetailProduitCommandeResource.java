package fr.ecom.primheure.web.rest;

import fr.ecom.primheure.domain.DetailProduitCommande;
import fr.ecom.primheure.repository.DetailProduitCommandeRepository;
import fr.ecom.primheure.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.ecom.primheure.domain.DetailProduitCommande}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DetailProduitCommandeResource {

    private final Logger log = LoggerFactory.getLogger(DetailProduitCommandeResource.class);

    private static final String ENTITY_NAME = "detailProduitCommande";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DetailProduitCommandeRepository detailProduitCommandeRepository;

    public DetailProduitCommandeResource(DetailProduitCommandeRepository detailProduitCommandeRepository) {
        this.detailProduitCommandeRepository = detailProduitCommandeRepository;
    }

    /**
     * {@code POST  /detail-produit-commandes} : Create a new detailProduitCommande.
     *
     * @param detailProduitCommande the detailProduitCommande to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new detailProduitCommande, or with status {@code 400 (Bad Request)} if the detailProduitCommande has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/detail-produit-commandes")
    public ResponseEntity<DetailProduitCommande> createDetailProduitCommande(@RequestBody DetailProduitCommande detailProduitCommande)
        throws URISyntaxException {
        log.debug("REST request to save DetailProduitCommande : {}", detailProduitCommande);
        if (detailProduitCommande.getId() != null) {
            throw new BadRequestAlertException("A new detailProduitCommande cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DetailProduitCommande result = detailProduitCommandeRepository.save(detailProduitCommande);
        return ResponseEntity
            .created(new URI("/api/detail-produit-commandes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /detail-produit-commandes/:id} : Updates an existing detailProduitCommande.
     *
     * @param id the id of the detailProduitCommande to save.
     * @param detailProduitCommande the detailProduitCommande to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated detailProduitCommande,
     * or with status {@code 400 (Bad Request)} if the detailProduitCommande is not valid,
     * or with status {@code 500 (Internal Server Error)} if the detailProduitCommande couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/detail-produit-commandes/{id}")
    public ResponseEntity<DetailProduitCommande> updateDetailProduitCommande(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DetailProduitCommande detailProduitCommande
    ) throws URISyntaxException {
        log.debug("REST request to update DetailProduitCommande : {}, {}", id, detailProduitCommande);
        if (detailProduitCommande.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, detailProduitCommande.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!detailProduitCommandeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DetailProduitCommande result = detailProduitCommandeRepository.save(detailProduitCommande);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, detailProduitCommande.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /detail-produit-commandes/:id} : Partial updates given fields of an existing detailProduitCommande, field will ignore if it is null
     *
     * @param id the id of the detailProduitCommande to save.
     * @param detailProduitCommande the detailProduitCommande to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated detailProduitCommande,
     * or with status {@code 400 (Bad Request)} if the detailProduitCommande is not valid,
     * or with status {@code 404 (Not Found)} if the detailProduitCommande is not found,
     * or with status {@code 500 (Internal Server Error)} if the detailProduitCommande couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/detail-produit-commandes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DetailProduitCommande> partialUpdateDetailProduitCommande(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DetailProduitCommande detailProduitCommande
    ) throws URISyntaxException {
        log.debug("REST request to partial update DetailProduitCommande partially : {}, {}", id, detailProduitCommande);
        if (detailProduitCommande.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, detailProduitCommande.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!detailProduitCommandeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DetailProduitCommande> result = detailProduitCommandeRepository
            .findById(detailProduitCommande.getId())
            .map(existingDetailProduitCommande -> {
                if (detailProduitCommande.getQuantite() != null) {
                    existingDetailProduitCommande.setQuantite(detailProduitCommande.getQuantite());
                }
                if (detailProduitCommande.getPrix() != null) {
                    existingDetailProduitCommande.setPrix(detailProduitCommande.getPrix());
                }

                return existingDetailProduitCommande;
            })
            .map(detailProduitCommandeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, detailProduitCommande.getId().toString())
        );
    }

    /**
     * {@code GET  /detail-produit-commandes} : get all the detailProduitCommandes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of detailProduitCommandes in body.
     */
    @GetMapping("/detail-produit-commandes")
    public List<DetailProduitCommande> getAllDetailProduitCommandes() {
        log.debug("REST request to get all DetailProduitCommandes");
        return detailProduitCommandeRepository.findAll();
    }

    /**
     * {@code GET  /detail-produit-commandes/:id} : get the "id" detailProduitCommande.
     *
     * @param id the id of the detailProduitCommande to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the detailProduitCommande, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/detail-produit-commandes/{id}")
    public ResponseEntity<DetailProduitCommande> getDetailProduitCommande(@PathVariable Long id) {
        log.debug("REST request to get DetailProduitCommande : {}", id);
        Optional<DetailProduitCommande> detailProduitCommande = detailProduitCommandeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(detailProduitCommande);
    }

    /**
     * {@code DELETE  /detail-produit-commandes/:id} : delete the "id" detailProduitCommande.
     *
     * @param id the id of the detailProduitCommande to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/detail-produit-commandes/{id}")
    public ResponseEntity<Void> deleteDetailProduitCommande(@PathVariable Long id) {
        log.debug("REST request to delete DetailProduitCommande : {}", id);
        detailProduitCommandeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
