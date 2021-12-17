package fr.ecom.primheure.service;

import fr.ecom.primheure.repository.ProduitRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing product stock.
 */
@Service
@Transactional
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final Logger log = LoggerFactory.getLogger(ProduitService.class);

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    public int updateStock(int id, int quantite, int numeroVersion) {
        log.debug("Update product stock {}", id);
        return produitRepository.updateStock(id, quantite, numeroVersion);
    }
}
