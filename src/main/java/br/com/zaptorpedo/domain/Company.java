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
 * A Company.
 */
@Entity
@Table(name = "company")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Company implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "company")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "messages", "company" }, allowSetters = true)
    private Set<Atendente> atendentes = new HashSet<>();

    @OneToMany(mappedBy = "company")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "messages", "campaigns", "company" }, allowSetters = true)
    private Set<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumbers = new HashSet<>();

    @OneToMany(mappedBy = "company")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "campaigns", "company" }, allowSetters = true)
    private Set<Menu> menus = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Company id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Company name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Atendente> getAtendentes() {
        return this.atendentes;
    }

    public Company atendentes(Set<Atendente> atendentes) {
        this.setAtendentes(atendentes);
        return this;
    }

    public Company addAtendente(Atendente atendente) {
        this.atendentes.add(atendente);
        atendente.setCompany(this);
        return this;
    }

    public Company removeAtendente(Atendente atendente) {
        this.atendentes.remove(atendente);
        atendente.setCompany(null);
        return this;
    }

    public void setAtendentes(Set<Atendente> atendentes) {
        if (this.atendentes != null) {
            this.atendentes.forEach(i -> i.setCompany(null));
        }
        if (atendentes != null) {
            atendentes.forEach(i -> i.setCompany(this));
        }
        this.atendentes = atendentes;
    }

    public Set<WhatsAppSourcePhoneNumber> getWhatsAppSourcePhoneNumbers() {
        return this.whatsAppSourcePhoneNumbers;
    }

    public Company whatsAppSourcePhoneNumbers(Set<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumbers) {
        this.setWhatsAppSourcePhoneNumbers(whatsAppSourcePhoneNumbers);
        return this;
    }

    public Company addWhatsAppSourcePhoneNumber(WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber) {
        this.whatsAppSourcePhoneNumbers.add(whatsAppSourcePhoneNumber);
        whatsAppSourcePhoneNumber.setCompany(this);
        return this;
    }

    public Company removeWhatsAppSourcePhoneNumber(WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber) {
        this.whatsAppSourcePhoneNumbers.remove(whatsAppSourcePhoneNumber);
        whatsAppSourcePhoneNumber.setCompany(null);
        return this;
    }

    public void setWhatsAppSourcePhoneNumbers(Set<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumbers) {
        if (this.whatsAppSourcePhoneNumbers != null) {
            this.whatsAppSourcePhoneNumbers.forEach(i -> i.setCompany(null));
        }
        if (whatsAppSourcePhoneNumbers != null) {
            whatsAppSourcePhoneNumbers.forEach(i -> i.setCompany(this));
        }
        this.whatsAppSourcePhoneNumbers = whatsAppSourcePhoneNumbers;
    }

    public Set<Menu> getMenus() {
        return this.menus;
    }

    public Company menus(Set<Menu> menus) {
        this.setMenus(menus);
        return this;
    }

    public Company addMenu(Menu menu) {
        this.menus.add(menu);
        menu.setCompany(this);
        return this;
    }

    public Company removeMenu(Menu menu) {
        this.menus.remove(menu);
        menu.setCompany(null);
        return this;
    }

    public void setMenus(Set<Menu> menus) {
        if (this.menus != null) {
            this.menus.forEach(i -> i.setCompany(null));
        }
        if (menus != null) {
            menus.forEach(i -> i.setCompany(this));
        }
        this.menus = menus;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Company)) {
            return false;
        }
        return id != null && id.equals(((Company) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Company{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
