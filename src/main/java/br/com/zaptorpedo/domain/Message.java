package br.com.zaptorpedo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Message.
 */
@Entity
@Table(name = "message")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Message implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "body", nullable = false)
    private String body;

    @NotNull
    @Column(name = "destiny_phone_number", nullable = false)
    private Long destinyPhoneNumber;

    @ManyToOne
    @JsonIgnoreProperties(value = { "messages", "company" }, allowSetters = true)
    private Atendente atendente;

    @ManyToOne
    @JsonIgnoreProperties(value = { "messages", "campaigns", "company" }, allowSetters = true)
    private WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Message id(Long id) {
        this.id = id;
        return this;
    }

    public String getBody() {
        return this.body;
    }

    public Message body(String body) {
        this.body = body;
        return this;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Long getDestinyPhoneNumber() {
        return this.destinyPhoneNumber;
    }

    public Message destinyPhoneNumber(Long destinyPhoneNumber) {
        this.destinyPhoneNumber = destinyPhoneNumber;
        return this;
    }

    public void setDestinyPhoneNumber(Long destinyPhoneNumber) {
        this.destinyPhoneNumber = destinyPhoneNumber;
    }

    public Atendente getAtendente() {
        return this.atendente;
    }

    public Message atendente(Atendente atendente) {
        this.setAtendente(atendente);
        return this;
    }

    public void setAtendente(Atendente atendente) {
        this.atendente = atendente;
    }

    public WhatsAppSourcePhoneNumber getWhatsAppSourcePhoneNumber() {
        return this.whatsAppSourcePhoneNumber;
    }

    public Message whatsAppSourcePhoneNumber(WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber) {
        this.setWhatsAppSourcePhoneNumber(whatsAppSourcePhoneNumber);
        return this;
    }

    public void setWhatsAppSourcePhoneNumber(WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber) {
        this.whatsAppSourcePhoneNumber = whatsAppSourcePhoneNumber;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Message)) {
            return false;
        }
        return id != null && id.equals(((Message) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Message{" +
            "id=" + getId() +
            ", body='" + getBody() + "'" +
            ", destinyPhoneNumber=" + getDestinyPhoneNumber() +
            "}";
    }
}
