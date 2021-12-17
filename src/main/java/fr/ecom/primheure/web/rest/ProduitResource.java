package fr.ecom.primheure.web.rest;

import com.fasterxml.jackson.databind.ser.std.StdKeySerializers.Default;
import fr.ecom.primheure.domain.Categorie;
import fr.ecom.primheure.domain.Produit;
import fr.ecom.primheure.domain.enumeration.TypeProduit;
import fr.ecom.primheure.repository.ProduitRepository;
import fr.ecom.primheure.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import javax.persistence.criteria.CriteriaBuilder.Case;
import javax.ws.rs.DefaultValue;
import net.bytebuddy.dynamic.loading.PackageDefinitionStrategy.Definition.Undefined;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.ecom.primheure.domain.Produit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProduitResource {

    private final Logger log = LoggerFactory.getLogger(ProduitResource.class);

    private static final String ENTITY_NAME = "produit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProduitRepository produitRepository;

    public ProduitResource(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    /**
     * {@code POST  /produits} : Create a new produit.
     *
     * @param produit the produit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new produit, or with status {@code 400 (Bad Request)} if the produit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/produits")
    public ResponseEntity<Produit> createProduit(@RequestBody Produit produit) throws URISyntaxException {
        log.debug("REST request to save Produit : {}", produit);
        if (produit.getId() != null) {
            throw new BadRequestAlertException("A new produit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Produit result = produitRepository.save(produit);
        return ResponseEntity
            .created(new URI("/api/produits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /produits/:id} : Updates an existing produit.
     *
     * @param id the id of the produit to save.
     * @param produit the produit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produit,
     * or with status {@code 400 (Bad Request)} if the produit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the produit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/produits/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable(value = "id", required = false) final Long id, @RequestBody Produit produit)
        throws URISyntaxException {
        log.debug("REST request to update Produit : {}, {}", id, produit);
        if (produit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Produit result = produitRepository.save(produit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, produit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /produits/:id} : Partial updates given fields of an existing produit, field will ignore if it is null
     *
     * @param id the id of the produit to save.
     * @param produit the produit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produit,
     * or with status {@code 400 (Bad Request)} if the produit is not valid,
     * or with status {@code 404 (Not Found)} if the produit is not found,
     * or with status {@code 500 (Internal Server Error)} if the produit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/produits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Produit> partialUpdateProduit(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Produit produit
    ) throws URISyntaxException {
        log.debug("REST request to partial update Produit partially : {}, {}", id, produit);
        if (produit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Produit> result = produitRepository
            .findById(produit.getId())
            .map(existingProduit -> {
                if (produit.getNom() != null) {
                    existingProduit.setNom(produit.getNom());
                }
                if (produit.getVendableUnite() != null) {
                    existingProduit.setVendableUnite(produit.getVendableUnite());
                }
                if (produit.getPrix() != null) {
                    existingProduit.setPrix(produit.getPrix());
                }
                if (produit.getQuantite() != null) {
                    existingProduit.setQuantite(produit.getQuantite());
                }
                if (produit.getPas() != null) {
                    existingProduit.setPas(produit.getPas());
                }
                if (produit.getDescription() != null) {
                    existingProduit.setDescription(produit.getDescription());
                }
                if (produit.getProvenance() != null) {
                    existingProduit.setProvenance(produit.getProvenance());
                }
                if (produit.getImage() != null) {
                    existingProduit.setImage(produit.getImage());
                }
                if (produit.getSaison() != null) {
                    existingProduit.setSaison(produit.getSaison());
                }
                if (produit.getNumeroVersion() != null) {
                    existingProduit.setNumeroVersion(produit.getNumeroVersion());
                }

                return existingProduit;
            })
            .map(produitRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, produit.getId().toString())
        );
    }

    /**
     * {@code GET  /produits} : get all the produits.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of produits in body.
     */
    @GetMapping("/produits")
    public List<Produit> getProduits(
        @RequestParam(name = "type", required = false) String type,
        @RequestParam(name = "name", required = false) String name,
        @RequestParam(name = "page", required = false) Integer page
    ) {
        log.debug("REST request to all Produits");
        return produitRepository.findAll();
    }

    /**
     * {@code GET  /produits/:id} : get the "id" produit.
     *
     * @param id the id of the produit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the produit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/produits/{id}")
    public ResponseEntity<Produit> getProduit(@PathVariable Long id) {
        log.debug("REST request to get Produit : {}", id);
        Optional<Produit> produit = produitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(produit);
    }

    /**
     * {@code DELETE  /produits/:id} : delete the "id" produit.
     *
     * @param id the id of the produit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/produits/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        log.debug("REST request to delete Produit : {}", id);
        produitRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code PATCH  /produits/updateStock/:id} : update the "id" produit quantity.
     *
     * @param id the id of the produit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PutMapping("/produits/stock/{id}")
    public int updateStockProduit(@PathVariable(value = "id", required = false) final Long id, @RequestBody Map<String, String> json)
        throws URISyntaxException {
        int quantite = Integer.parseInt(json.get("quantite"));
        int numeroVer = Integer.parseInt(json.get("numeroVer"));

        log.debug("REST request to update Produit : {}", id);
        if (id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        if (!produitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Produit prod = this.getProduit(id).getBody();
        int newQuantite = prod.getQuantite() - quantite;
        int updateRes = produitRepository.updateStock(id, newQuantite, numeroVer);

        // la modification du stock n'a pas fonctionnée, on recommence
        while (updateRes == 0 && prod.getQuantite() - quantite >= 0) {
            prod = this.getProduit(id).getBody();
            newQuantite = prod.getQuantite() - quantite;
            updateRes = produitRepository.updateStock(id, newQuantite, prod.getNumeroVersion());
        }

        return updateRes;
    }
}
