package br.com.zaptorpedo.web.rest;

import br.com.zaptorpedo.domain.WhatsAppSourcePhoneNumber;
import br.com.zaptorpedo.repository.WhatsAppSourcePhoneNumberRepository;
import br.com.zaptorpedo.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.zaptorpedo.domain.WhatsAppSourcePhoneNumber}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WhatsAppSourcePhoneNumberResource {

    private final Logger log = LoggerFactory.getLogger(WhatsAppSourcePhoneNumberResource.class);

    private static final String ENTITY_NAME = "whatsAppSourcePhoneNumber";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WhatsAppSourcePhoneNumberRepository whatsAppSourcePhoneNumberRepository;

    public WhatsAppSourcePhoneNumberResource(WhatsAppSourcePhoneNumberRepository whatsAppSourcePhoneNumberRepository) {
        this.whatsAppSourcePhoneNumberRepository = whatsAppSourcePhoneNumberRepository;
    }

    /**
     * {@code POST  /whats-app-source-phone-numbers} : Create a new whatsAppSourcePhoneNumber.
     *
     * @param whatsAppSourcePhoneNumber the whatsAppSourcePhoneNumber to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new whatsAppSourcePhoneNumber, or with status {@code 400 (Bad Request)} if the whatsAppSourcePhoneNumber has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/whats-app-source-phone-numbers")
    public ResponseEntity<WhatsAppSourcePhoneNumber> createWhatsAppSourcePhoneNumber(
        @Valid @RequestBody WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber
    ) throws URISyntaxException {
        log.debug("REST request to save WhatsAppSourcePhoneNumber : {}", whatsAppSourcePhoneNumber);
        if (whatsAppSourcePhoneNumber.getId() != null) {
            throw new BadRequestAlertException("A new whatsAppSourcePhoneNumber cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WhatsAppSourcePhoneNumber result = whatsAppSourcePhoneNumberRepository.save(whatsAppSourcePhoneNumber);
        return ResponseEntity
            .created(new URI("/api/whats-app-source-phone-numbers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /whats-app-source-phone-numbers/:id} : Updates an existing whatsAppSourcePhoneNumber.
     *
     * @param id the id of the whatsAppSourcePhoneNumber to save.
     * @param whatsAppSourcePhoneNumber the whatsAppSourcePhoneNumber to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated whatsAppSourcePhoneNumber,
     * or with status {@code 400 (Bad Request)} if the whatsAppSourcePhoneNumber is not valid,
     * or with status {@code 500 (Internal Server Error)} if the whatsAppSourcePhoneNumber couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/whats-app-source-phone-numbers/{id}")
    public ResponseEntity<WhatsAppSourcePhoneNumber> updateWhatsAppSourcePhoneNumber(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber
    ) throws URISyntaxException {
        log.debug("REST request to update WhatsAppSourcePhoneNumber : {}, {}", id, whatsAppSourcePhoneNumber);
        if (whatsAppSourcePhoneNumber.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, whatsAppSourcePhoneNumber.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!whatsAppSourcePhoneNumberRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        WhatsAppSourcePhoneNumber result = whatsAppSourcePhoneNumberRepository.save(whatsAppSourcePhoneNumber);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, whatsAppSourcePhoneNumber.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /whats-app-source-phone-numbers/:id} : Partial updates given fields of an existing whatsAppSourcePhoneNumber, field will ignore if it is null
     *
     * @param id the id of the whatsAppSourcePhoneNumber to save.
     * @param whatsAppSourcePhoneNumber the whatsAppSourcePhoneNumber to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated whatsAppSourcePhoneNumber,
     * or with status {@code 400 (Bad Request)} if the whatsAppSourcePhoneNumber is not valid,
     * or with status {@code 404 (Not Found)} if the whatsAppSourcePhoneNumber is not found,
     * or with status {@code 500 (Internal Server Error)} if the whatsAppSourcePhoneNumber couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/whats-app-source-phone-numbers/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<WhatsAppSourcePhoneNumber> partialUpdateWhatsAppSourcePhoneNumber(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber
    ) throws URISyntaxException {
        log.debug("REST request to partial update WhatsAppSourcePhoneNumber partially : {}, {}", id, whatsAppSourcePhoneNumber);
        if (whatsAppSourcePhoneNumber.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, whatsAppSourcePhoneNumber.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!whatsAppSourcePhoneNumberRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<WhatsAppSourcePhoneNumber> result = whatsAppSourcePhoneNumberRepository
            .findById(whatsAppSourcePhoneNumber.getId())
            .map(
                existingWhatsAppSourcePhoneNumber -> {
                    if (whatsAppSourcePhoneNumber.getInstanceId() != null) {
                        existingWhatsAppSourcePhoneNumber.setInstanceId(whatsAppSourcePhoneNumber.getInstanceId());
                    }
                    if (whatsAppSourcePhoneNumber.getMsisdn() != null) {
                        existingWhatsAppSourcePhoneNumber.setMsisdn(whatsAppSourcePhoneNumber.getMsisdn());
                    }

                    return existingWhatsAppSourcePhoneNumber;
                }
            )
            .map(whatsAppSourcePhoneNumberRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, whatsAppSourcePhoneNumber.getId().toString())
        );
    }

    /**
     * {@code GET  /whats-app-source-phone-numbers} : get all the whatsAppSourcePhoneNumbers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of whatsAppSourcePhoneNumbers in body.
     */
    @GetMapping("/whats-app-source-phone-numbers")
    public List<WhatsAppSourcePhoneNumber> getAllWhatsAppSourcePhoneNumbers() {
        log.debug("REST request to get all WhatsAppSourcePhoneNumbers");
        return whatsAppSourcePhoneNumberRepository.findAll();
    }

    /**
     * {@code GET  /whats-app-source-phone-numbers/:id} : get the "id" whatsAppSourcePhoneNumber.
     *
     * @param id the id of the whatsAppSourcePhoneNumber to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the whatsAppSourcePhoneNumber, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/whats-app-source-phone-numbers/{id}")
    public ResponseEntity<WhatsAppSourcePhoneNumber> getWhatsAppSourcePhoneNumber(@PathVariable Long id) {
        log.debug("REST request to get WhatsAppSourcePhoneNumber : {}", id);
        Optional<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumber = whatsAppSourcePhoneNumberRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(whatsAppSourcePhoneNumber);
    }

    /**
     * {@code DELETE  /whats-app-source-phone-numbers/:id} : delete the "id" whatsAppSourcePhoneNumber.
     *
     * @param id the id of the whatsAppSourcePhoneNumber to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/whats-app-source-phone-numbers/{id}")
    public ResponseEntity<Void> deleteWhatsAppSourcePhoneNumber(@PathVariable Long id) {
        log.debug("REST request to delete WhatsAppSourcePhoneNumber : {}", id);
        whatsAppSourcePhoneNumberRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
