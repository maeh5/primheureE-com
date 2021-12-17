package fr.ecom.primheure.repository;

import fr.ecom.primheure.domain.DetailProduitCommande;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the DetailProduitCommande entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DetailProduitCommandeRepository extends JpaRepository<DetailProduitCommande, Long> {}
