package br.com.zaptorpedo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CampaignExecution.
 */
@Entity
@Table(name = "campaign_execution")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CampaignExecution implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "body", nullable = false)
    private byte[] body;

    @Column(name = "body_content_type", nullable = false)
    private String bodyContentType;

    @Column(name = "shedule_dttm")
    private ZonedDateTime sheduleDttm;

    @Column(name = "execution_dttm")
    private ZonedDateTime executionDttm;

    @ManyToOne
    @JsonIgnoreProperties(value = { "campaignExecutions", "whatsAppSourcePhoneNumber", "menu" }, allowSetters = true)
    private Campaign campaign;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CampaignExecution id(Long id) {
        this.id = id;
        return this;
    }

    public byte[] getBody() {
        return this.body;
    }

    public CampaignExecution body(byte[] body) {
        this.body = body;
        return this;
    }

    public void setBody(byte[] body) {
        this.body = body;
    }

    public String getBodyContentType() {
        return this.bodyContentType;
    }

    public CampaignExecution bodyContentType(String bodyContentType) {
        this.bodyContentType = bodyContentType;
        return this;
    }

    public void setBodyContentType(String bodyContentType) {
        this.bodyContentType = bodyContentType;
    }

    public ZonedDateTime getSheduleDttm() {
        return this.sheduleDttm;
    }

    public CampaignExecution sheduleDttm(ZonedDateTime sheduleDttm) {
        this.sheduleDttm = sheduleDttm;
        return this;
    }

    public void setSheduleDttm(ZonedDateTime sheduleDttm) {
        this.sheduleDttm = sheduleDttm;
    }

    public ZonedDateTime getExecutionDttm() {
        return this.executionDttm;
    }

    public CampaignExecution executionDttm(ZonedDateTime executionDttm) {
        this.executionDttm = executionDttm;
        return this;
    }

    public void setExecutionDttm(ZonedDateTime executionDttm) {
        this.executionDttm = executionDttm;
    }

    public Campaign getCampaign() {
        return this.campaign;
    }

    public CampaignExecution campaign(Campaign campaign) {
        this.setCampaign(campaign);
        return this;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CampaignExecution)) {
            return false;
        }
        return id != null && id.equals(((CampaignExecution) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CampaignExecution{" +
            "id=" + getId() +
            ", body='" + getBody() + "'" +
            ", bodyContentType='" + getBodyContentType() + "'" +
            ", sheduleDttm='" + getSheduleDttm() + "'" +
            ", executionDttm='" + getExecutionDttm() + "'" +
            "}";
    }
}
