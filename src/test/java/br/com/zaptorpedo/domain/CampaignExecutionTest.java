package br.com.zaptorpedo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.zaptorpedo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CampaignExecutionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CampaignExecution.class);
        CampaignExecution campaignExecution1 = new CampaignExecution();
        campaignExecution1.setId(1L);
        CampaignExecution campaignExecution2 = new CampaignExecution();
        campaignExecution2.setId(campaignExecution1.getId());
        assertThat(campaignExecution1).isEqualTo(campaignExecution2);
        campaignExecution2.setId(2L);
        assertThat(campaignExecution1).isNotEqualTo(campaignExecution2);
        campaignExecution1.setId(null);
        assertThat(campaignExecution1).isNotEqualTo(campaignExecution2);
    }
}
