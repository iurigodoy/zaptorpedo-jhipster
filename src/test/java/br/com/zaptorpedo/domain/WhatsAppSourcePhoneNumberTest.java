package br.com.zaptorpedo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.zaptorpedo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class WhatsAppSourcePhoneNumberTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WhatsAppSourcePhoneNumber.class);
        WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber1 = new WhatsAppSourcePhoneNumber();
        whatsAppSourcePhoneNumber1.setId(1L);
        WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber2 = new WhatsAppSourcePhoneNumber();
        whatsAppSourcePhoneNumber2.setId(whatsAppSourcePhoneNumber1.getId());
        assertThat(whatsAppSourcePhoneNumber1).isEqualTo(whatsAppSourcePhoneNumber2);
        whatsAppSourcePhoneNumber2.setId(2L);
        assertThat(whatsAppSourcePhoneNumber1).isNotEqualTo(whatsAppSourcePhoneNumber2);
        whatsAppSourcePhoneNumber1.setId(null);
        assertThat(whatsAppSourcePhoneNumber1).isNotEqualTo(whatsAppSourcePhoneNumber2);
    }
}
