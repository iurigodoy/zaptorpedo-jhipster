package br.com.zaptorpedo.web.rest;

import br.com.zaptorpedo.domain.Atendente;
import br.com.zaptorpedo.repository.AtendenteRepository;
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
 * REST controller for managing {@link br.com.zaptorpedo.domain.Atendente}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AtendenteResource {

    private final Logger log = LoggerFactory.getLogger(AtendenteResource.class);

    private static final String ENTITY_NAME = "atendente";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AtendenteRepository atendenteRepository;

    public AtendenteResource(AtendenteRepository atendenteRepository) {
        this.atendenteRepository = atendenteRepository;
    }

    /**
     * {@code POST  /atendentes} : Create a new atendente.
     *
     * @param atendente the atendente to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new atendente, or with status {@code 400 (Bad Request)} if the atendente has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/atendentes")
    public ResponseEntity<Atendente> createAtendente(@Valid @RequestBody Atendente atendente) throws URISyntaxException {
        log.debug("REST request to save Atendente : {}", atendente);
        if (atendente.getId() != null) {
            throw new BadRequestAlertException("A new atendente cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Atendente result = atendenteRepository.save(atendente);
        return ResponseEntity
            .created(new URI("/api/atendentes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /atendentes/:id} : Updates an existing atendente.
     *
     * @param id the id of the atendente to save.
     * @param atendente the atendente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated atendente,
     * or with status {@code 400 (Bad Request)} if the atendente is not valid,
     * or with status {@code 500 (Internal Server Error)} if the atendente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/atendentes/{id}")
    public ResponseEntity<Atendente> updateAtendente(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Atendente atendente
    ) throws URISyntaxException {
        log.debug("REST request to update Atendente : {}, {}", id, atendente);
        if (atendente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, atendente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!atendenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Atendente result = atendenteRepository.save(atendente);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, atendente.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /atendentes/:id} : Partial updates given fields of an existing atendente, field will ignore if it is null
     *
     * @param id the id of the atendente to save.
     * @param atendente the atendente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated atendente,
     * or with status {@code 400 (Bad Request)} if the atendente is not valid,
     * or with status {@code 404 (Not Found)} if the atendente is not found,
     * or with status {@code 500 (Internal Server Error)} if the atendente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/atendentes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Atendente> partialUpdateAtendente(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Atendente atendente
    ) throws URISyntaxException {
        log.debug("REST request to partial update Atendente partially : {}, {}", id, atendente);
        if (atendente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, atendente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!atendenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Atendente> result = atendenteRepository
            .findById(atendente.getId())
            .map(
                existingAtendente -> {
                    if (atendente.getName() != null) {
                        existingAtendente.setName(atendente.getName());
                    }

                    return existingAtendente;
                }
            )
            .map(atendenteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, atendente.getId().toString())
        );
    }

    /**
     * {@code GET  /atendentes} : get all the atendentes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of atendentes in body.
     */
    @GetMapping("/atendentes")
    public List<Atendente> getAllAtendentes() {
        log.debug("REST request to get all Atendentes");
        return atendenteRepository.findAll();
    }

    /**
     * {@code GET  /atendentes/:id} : get the "id" atendente.
     *
     * @param id the id of the atendente to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the atendente, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/atendentes/{id}")
    public ResponseEntity<Atendente> getAtendente(@PathVariable Long id) {
        log.debug("REST request to get Atendente : {}", id);
        Optional<Atendente> atendente = atendenteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(atendente);
    }

    /**
     * {@code DELETE  /atendentes/:id} : delete the "id" atendente.
     *
     * @param id the id of the atendente to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/atendentes/{id}")
    public ResponseEntity<Void> deleteAtendente(@PathVariable Long id) {
        log.debug("REST request to delete Atendente : {}", id);
        atendenteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
