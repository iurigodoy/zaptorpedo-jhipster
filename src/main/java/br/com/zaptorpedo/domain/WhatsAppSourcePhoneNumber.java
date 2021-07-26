package br.com.zaptorpedo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A WhatsAppSourcePhoneNumber.
 */
@Entity
@Table(name = "whats_app_source_phone_number")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class WhatsAppSourcePhoneNumber implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "instance_id", nullable = false)
    private String instanceId;

    @NotNull
    @Column(name = "msisdn", nullable = false)
    private Long msisdn;

    @OneToMany(mappedBy = "whatsAppSourcePhoneNumber")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "atendente", "whatsAppSourcePhoneNumber" }, allowSetters = true)
    private Set<Message> messages = new HashSet<>();

    @OneToMany(mappedBy = "whatsAppSourcePhoneNumber")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "campaignExecutions", "whatsAppSourcePhoneNumber", "menu" }, allowSetters = true)
    private Set<Campaign> campaigns = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "atendentes", "whatsAppSourcePhoneNumbers", "menus" }, allowSetters = true)
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WhatsAppSourcePhoneNumber id(Long id) {
        this.id = id;
        return this;
    }

    public String getInstanceId() {
        return this.instanceId;
    }

    public WhatsAppSourcePhoneNumber instanceId(String instanceId) {
        this.instanceId = instanceId;
        return this;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public Long getMsisdn() {
        return this.msisdn;
    }

    public WhatsAppSourcePhoneNumber msisdn(Long msisdn) {
        this.msisdn = msisdn;
        return this;
    }

    public void setMsisdn(Long msisdn) {
        this.msisdn = msisdn;
    }

    public Set<Message> getMessages() {
        return this.messages;
    }

    public WhatsAppSourcePhoneNumber messages(Set<Message> messages) {
        this.setMessages(messages);
        return this;
    }

    public WhatsAppSourcePhoneNumber addMessage(Message message) {
        this.messages.add(message);
        message.setWhatsAppSourcePhoneNumber(this);
        return this;
    }

    public WhatsAppSourcePhoneNumber removeMessage(Message message) {
        this.messages.remove(message);
        message.setWhatsAppSourcePhoneNumber(null);
        return this;
    }

    public void setMessages(Set<Message> messages) {
        if (this.messages != null) {
            this.messages.forEach(i -> i.setWhatsAppSourcePhoneNumber(null));
        }
        if (messages != null) {
            messages.forEach(i -> i.setWhatsAppSourcePhoneNumber(this));
        }
        this.messages = messages;
    }

    public Set<Campaign> getCampaigns() {
        return this.campaigns;
    }

    public WhatsAppSourcePhoneNumber campaigns(Set<Campaign> campaigns) {
        this.setCampaigns(campaigns);
        return this;
    }

    public WhatsAppSourcePhoneNumber addCampaign(Campaign campaign) {
        this.campaigns.add(campaign);
        campaign.setWhatsAppSourcePhoneNumber(this);
        return this;
    }

    public WhatsAppSourcePhoneNumber removeCampaign(Campaign campaign) {
        this.campaigns.remove(campaign);
        campaign.setWhatsAppSourcePhoneNumber(null);
        return this;
    }

    public void setCampaigns(Set<Campaign> campaigns) {
        if (this.campaigns != null) {
            this.campaigns.forEach(i -> i.setWhatsAppSourcePhoneNumber(null));
        }
        if (campaigns != null) {
            campaigns.forEach(i -> i.setWhatsAppSourcePhoneNumber(this));
        }
        this.campaigns = campaigns;
    }

    public Company getCompany() {
        return this.company;
    }

    public WhatsAppSourcePhoneNumber company(Company company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WhatsAppSourcePhoneNumber)) {
            return false;
        }
        return id != null && id.equals(((WhatsAppSourcePhoneNumber) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WhatsAppSourcePhoneNumber{" +
            "id=" + getId() +
            ", instanceId='" + getInstanceId() + "'" +
            ", msisdn=" + getMsisdn() +
            "}";
    }
}
