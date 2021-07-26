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
 * A Menu.
 */
@Entity
@Table(name = "menu")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Menu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "json", nullable = false)
    private String json;

    @OneToMany(mappedBy = "menu")
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

    public Menu id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Menu name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getJson() {
        return this.json;
    }

    public Menu json(String json) {
        this.json = json;
        return this;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public Set<Campaign> getCampaigns() {
        return this.campaigns;
    }

    public Menu campaigns(Set<Campaign> campaigns) {
        this.setCampaigns(campaigns);
        return this;
    }

    public Menu addCampaign(Campaign campaign) {
        this.campaigns.add(campaign);
        campaign.setMenu(this);
        return this;
    }

    public Menu removeCampaign(Campaign campaign) {
        this.campaigns.remove(campaign);
        campaign.setMenu(null);
        return this;
    }

    public void setCampaigns(Set<Campaign> campaigns) {
        if (this.campaigns != null) {
            this.campaigns.forEach(i -> i.setMenu(null));
        }
        if (campaigns != null) {
            campaigns.forEach(i -> i.setMenu(this));
        }
        this.campaigns = campaigns;
    }

    public Company getCompany() {
        return this.company;
    }

    public Menu company(Company company) {
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
        if (!(o instanceof Menu)) {
            return false;
        }
        return id != null && id.equals(((Menu) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Menu{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", json='" + getJson() + "'" +
            "}";
    }
}
