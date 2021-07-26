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
 * A Atendente.
 */
@Entity
@Table(name = "atendente")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Atendente implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "atendente")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "atendente", "whatsAppSourcePhoneNumber" }, allowSetters = true)
    private Set<Message> messages = new HashSet<>();

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

    public Atendente id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Atendente name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Message> getMessages() {
        return this.messages;
    }

    public Atendente messages(Set<Message> messages) {
        this.setMessages(messages);
        return this;
    }

    public Atendente addMessage(Message message) {
        this.messages.add(message);
        message.setAtendente(this);
        return this;
    }

    public Atendente removeMessage(Message message) {
        this.messages.remove(message);
        message.setAtendente(null);
        return this;
    }

    public void setMessages(Set<Message> messages) {
        if (this.messages != null) {
            this.messages.forEach(i -> i.setAtendente(null));
        }
        if (messages != null) {
            messages.forEach(i -> i.setAtendente(this));
        }
        this.messages = messages;
    }

    public Company getCompany() {
        return this.company;
    }

    public Atendente company(Company company) {
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
        if (!(o instanceof Atendente)) {
            return false;
        }
        return id != null && id.equals(((Atendente) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Atendente{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
