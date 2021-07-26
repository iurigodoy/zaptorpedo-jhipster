package br.com.zaptorpedo.web.rest;

import br.com.zaptorpedo.domain.CampaignExecution;
import br.com.zaptorpedo.repository.CampaignExecutionRepository;
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
 * REST controller for managing {@link br.com.zaptorpedo.domain.CampaignExecution}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CampaignExecutionResource {

    private final Logger log = LoggerFactory.getLogger(CampaignExecutionResource.class);

    private static final String ENTITY_NAME = "campaignExecution";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CampaignExecutionRepository campaignExecutionRepository;

    public CampaignExecutionResource(CampaignExecutionRepository campaignExecutionRepository) {
        this.campaignExecutionRepository = campaignExecutionRepository;
    }

    /**
     * {@code POST  /campaign-executions} : Create a new campaignExecution.
     *
     * @param campaignExecution the campaignExecution to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new campaignExecution, or with status {@code 400 (Bad Request)} if the campaignExecution has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/campaign-executions")
    public ResponseEntity<CampaignExecution> createCampaignExecution(@Valid @RequestBody CampaignExecution campaignExecution)
        throws URISyntaxException {
        log.debug("REST request to save CampaignExecution : {}", campaignExecution);
        if (campaignExecution.getId() != null) {
            throw new BadRequestAlertException("A new campaignExecution cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CampaignExecution result = campaignExecutionRepository.save(campaignExecution);
        return ResponseEntity
            .created(new URI("/api/campaign-executions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /campaign-executions/:id} : Updates an existing campaignExecution.
     *
     * @param id the id of the campaignExecution to save.
     * @param campaignExecution the campaignExecution to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated campaignExecution,
     * or with status {@code 400 (Bad Request)} if the campaignExecution is not valid,
     * or with status {@code 500 (Internal Server Error)} if the campaignExecution couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/campaign-executions/{id}")
    public ResponseEntity<CampaignExecution> updateCampaignExecution(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CampaignExecution campaignExecution
    ) throws URISyntaxException {
        log.debug("REST request to update CampaignExecution : {}, {}", id, campaignExecution);
        if (campaignExecution.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, campaignExecution.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!campaignExecutionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CampaignExecution result = campaignExecutionRepository.save(campaignExecution);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, campaignExecution.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /campaign-executions/:id} : Partial updates given fields of an existing campaignExecution, field will ignore if it is null
     *
     * @param id the id of the campaignExecution to save.
     * @param campaignExecution the campaignExecution to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated campaignExecution,
     * or with status {@code 400 (Bad Request)} if the campaignExecution is not valid,
     * or with status {@code 404 (Not Found)} if the campaignExecution is not found,
     * or with status {@code 500 (Internal Server Error)} if the campaignExecution couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/campaign-executions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<CampaignExecution> partialUpdateCampaignExecution(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CampaignExecution campaignExecution
    ) throws URISyntaxException {
        log.debug("REST request to partial update CampaignExecution partially : {}, {}", id, campaignExecution);
        if (campaignExecution.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, campaignExecution.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!campaignExecutionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CampaignExecution> result = campaignExecutionRepository
            .findById(campaignExecution.getId())
            .map(
                existingCampaignExecution -> {
                    if (campaignExecution.getBody() != null) {
                        existingCampaignExecution.setBody(campaignExecution.getBody());
                    }
                    if (campaignExecution.getBodyContentType() != null) {
                        existingCampaignExecution.setBodyContentType(campaignExecution.getBodyContentType());
                    }
                    if (campaignExecution.getSheduleDttm() != null) {
                        existingCampaignExecution.setSheduleDttm(campaignExecution.getSheduleDttm());
                    }
                    if (campaignExecution.getExecutionDttm() != null) {
                        existingCampaignExecution.setExecutionDttm(campaignExecution.getExecutionDttm());
                    }

                    return existingCampaignExecution;
                }
            )
            .map(campaignExecutionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, campaignExecution.getId().toString())
        );
    }

    /**
     * {@code GET  /campaign-executions} : get all the campaignExecutions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of campaignExecutions in body.
     */
    @GetMapping("/campaign-executions")
    public List<CampaignExecution> getAllCampaignExecutions() {
        log.debug("REST request to get all CampaignExecutions");
        return campaignExecutionRepository.findAll();
    }

    /**
     * {@code GET  /campaign-executions/:id} : get the "id" campaignExecution.
     *
     * @param id the id of the campaignExecution to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the campaignExecution, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/campaign-executions/{id}")
    public ResponseEntity<CampaignExecution> getCampaignExecution(@PathVariable Long id) {
        log.debug("REST request to get CampaignExecution : {}", id);
        Optional<CampaignExecution> campaignExecution = campaignExecutionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(campaignExecution);
    }

    /**
     * {@code DELETE  /campaign-executions/:id} : delete the "id" campaignExecution.
     *
     * @param id the id of the campaignExecution to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/campaign-executions/{id}")
    public ResponseEntity<Void> deleteCampaignExecution(@PathVariable Long id) {
        log.debug("REST request to delete CampaignExecution : {}", id);
        campaignExecutionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
