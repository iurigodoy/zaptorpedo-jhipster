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
 * A Campaign.
 */
@Entity
@Table(name = "campaign")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Campaign implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "template", nullable = false)
    private String template;

    @OneToMany(mappedBy = "campaign")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "campaign" }, allowSetters = true)
    private Set<CampaignExecution> campaignExecutions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "messages", "campaigns", "company" }, allowSetters = true)
    private WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber;

    @ManyToOne
    @JsonIgnoreProperties(value = { "campaigns", "company" }, allowSetters = true)
    private Menu menu;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Campaign id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Campaign name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTemplate() {
        return this.template;
    }

    public Campaign template(String template) {
        this.template = template;
        return this;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public Set<CampaignExecution> getCampaignExecutions() {
        return this.campaignExecutions;
    }

    public Campaign campaignExecutions(Set<CampaignExecution> campaignExecutions) {
        this.setCampaignExecutions(campaignExecutions);
        return this;
    }

    public Campaign addCampaignExecution(CampaignExecution campaignExecution) {
        this.campaignExecutions.add(campaignExecution);
        campaignExecution.setCampaign(this);
        return this;
    }

    public Campaign removeCampaignExecution(CampaignExecution campaignExecution) {
        this.campaignExecutions.remove(campaignExecution);
        campaignExecution.setCampaign(null);
        return this;
    }

    public void setCampaignExecutions(Set<CampaignExecution> campaignExecutions) {
        if (this.campaignExecutions != null) {
            this.campaignExecutions.forEach(i -> i.setCampaign(null));
        }
        if (campaignExecutions != null) {
            campaignExecutions.forEach(i -> i.setCampaign(this));
        }
        this.campaignExecutions = campaignExecutions;
    }

    public WhatsAppSourcePhoneNumber getWhatsAppSourcePhoneNumber() {
        return this.whatsAppSourcePhoneNumber;
    }

    public Campaign whatsAppSourcePhoneNumber(WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber) {
        this.setWhatsAppSourcePhoneNumber(whatsAppSourcePhoneNumber);
        return this;
    }

    public void setWhatsAppSourcePhoneNumber(WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber) {
        this.whatsAppSourcePhoneNumber = whatsAppSourcePhoneNumber;
    }

    public Menu getMenu() {
        return this.menu;
    }

    public Campaign menu(Menu menu) {
        this.setMenu(menu);
        return this;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Campaign)) {
            return false;
        }
        return id != null && id.equals(((Campaign) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Campaign{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", template='" + getTemplate() + "'" +
            "}";
    }
}
