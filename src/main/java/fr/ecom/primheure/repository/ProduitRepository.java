package fr.ecom.primheure.repository;

import fr.ecom.primheure.domain.Categorie;
import fr.ecom.primheure.domain.Produit;
import fr.ecom.primheure.domain.enumeration.TypeProduit;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Produit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    // Requète pour modifier la quantité
    @Transactional
    @Modifying
    @Query(
        "UPDATE Produit SET quantite = :quantite, numero_version = MOD(:numero_version + 1, 100000) WHERE id = :id AND numero_version= :numero_version"
    )
    int updateStock(@Param("id") Number id, @Param("quantite") Number quantite, @Param("numero_version") Number numero_version);

    @Query("select p from Produit p inner join p.categories c where :type in c.type")
    Page<Produit> findByType(@Param("type") String type, Pageable pageable);

    @Query("select p from Produit p where lower(p.nom) like lower(CONCAT(:name, '%')) ")
    Page<Produit> findByName(@Param("name") String name, Pageable pageable);

    @Query("select p from Produit p join p.categories c where :type in c.type and lower(p.nom) like lower(CONCAT(:name, '%')) ")
    Page<Produit> findByNameAndType(@Param("name") String name, @Param("type") String type, Pageable pageable);

    @Query("select p from Produit p")
    Page<Produit> findAll(Pageable pageable);
}
