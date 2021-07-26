package br.com.zaptorpedo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.zaptorpedo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AtendenteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Atendente.class);
        Atendente atendente1 = new Atendente();
        atendente1.setId(1L);
        Atendente atendente2 = new Atendente();
        atendente2.setId(atendente1.getId());
        assertThat(atendente1).isEqualTo(atendente2);
        atendente2.setId(2L);
        assertThat(atendente1).isNotEqualTo(atendente2);
        atendente1.setId(null);
        assertThat(atendente1).isNotEqualTo(atendente2);
    }
}
