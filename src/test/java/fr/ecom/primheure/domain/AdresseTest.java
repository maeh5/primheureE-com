package fr.ecom.primheure.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.ecom.primheure.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdresseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Adresse.class);
        Adresse adresse1 = new Adresse();
        adresse1.setId(1L);
        Adresse adresse2 = new Adresse();
        adresse2.setId(adresse1.getId());
        assertThat(adresse1).isEqualTo(adresse2);
        adresse2.setId(2L);
        assertThat(adresse1).isNotEqualTo(adresse2);
        adresse1.setId(null);
        assertThat(adresse1).isNotEqualTo(adresse2);
    }
}
