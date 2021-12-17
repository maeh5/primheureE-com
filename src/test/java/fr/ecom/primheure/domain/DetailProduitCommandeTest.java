package fr.ecom.primheure.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.ecom.primheure.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DetailProduitCommandeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DetailProduitCommande.class);
        DetailProduitCommande detailProduitCommande1 = new DetailProduitCommande();
        detailProduitCommande1.setId(1L);
        DetailProduitCommande detailProduitCommande2 = new DetailProduitCommande();
        detailProduitCommande2.setId(detailProduitCommande1.getId());
        assertThat(detailProduitCommande1).isEqualTo(detailProduitCommande2);
        detailProduitCommande2.setId(2L);
        assertThat(detailProduitCommande1).isNotEqualTo(detailProduitCommande2);
        detailProduitCommande1.setId(null);
        assertThat(detailProduitCommande1).isNotEqualTo(detailProduitCommande2);
    }
}
