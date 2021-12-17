package fr.ecom.primheure.web.rest;

import fr.ecom.primheure.domain.Produit;
import fr.ecom.primheure.repository.ProduitRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Transactional
public class HomeResource {

    private final Logger log = LoggerFactory.getLogger(fr.ecom.primheure.web.rest.ProduitResource.class);

    private static final String ENTITY_NAME = "produit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProduitRepository produitRepository;

    public HomeResource(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    @GetMapping("/home")
    public Page<Produit> getProduits(
        @RequestParam(name = "type", required = false) String type,
        @RequestParam(name = "name", required = false) String name,
        @RequestParam(name = "page", required = false) Integer page
    ) {
        log.debug("REST request to Produits");
        Pageable pageable = PageRequest.of(page, 8, Sort.by("nom").ascending());
        if ((type == null && name == null)) {
            return produitRepository.findAll(pageable);
        }
        if (type == null) {
            return produitRepository.findByName(name, pageable);
        }
        if (name == null) {
            return produitRepository.findByType(type, pageable);
        }
        return produitRepository.findByNameAndType(name, type, pageable);
    }
}
