package br.com.zaptorpedo.web.rest;

import static br.com.zaptorpedo.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.zaptorpedo.IntegrationTest;
import br.com.zaptorpedo.domain.CampaignExecution;
import br.com.zaptorpedo.repository.CampaignExecutionRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link CampaignExecutionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CampaignExecutionResourceIT {

    private static final byte[] DEFAULT_BODY = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_BODY = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_BODY_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_BODY_CONTENT_TYPE = "image/png";

    private static final ZonedDateTime DEFAULT_SHEDULE_DTTM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_SHEDULE_DTTM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_EXECUTION_DTTM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EXECUTION_DTTM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/campaign-executions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CampaignExecutionRepository campaignExecutionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCampaignExecutionMockMvc;

    private CampaignExecution campaignExecution;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CampaignExecution createEntity(EntityManager em) {
        CampaignExecution campaignExecution = new CampaignExecution()
            .body(DEFAULT_BODY)
            .bodyContentType(DEFAULT_BODY_CONTENT_TYPE)
            .sheduleDttm(DEFAULT_SHEDULE_DTTM)
            .executionDttm(DEFAULT_EXECUTION_DTTM);
        return campaignExecution;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CampaignExecution createUpdatedEntity(EntityManager em) {
        CampaignExecution campaignExecution = new CampaignExecution()
            .body(UPDATED_BODY)
            .bodyContentType(UPDATED_BODY_CONTENT_TYPE)
            .sheduleDttm(UPDATED_SHEDULE_DTTM)
            .executionDttm(UPDATED_EXECUTION_DTTM);
        return campaignExecution;
    }

    @BeforeEach
    public void initTest() {
        campaignExecution = createEntity(em);
    }

    @Test
    @Transactional
    void createCampaignExecution() throws Exception {
        int databaseSizeBeforeCreate = campaignExecutionRepository.findAll().size();
        // Create the CampaignExecution
        restCampaignExecutionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(campaignExecution))
            )
            .andExpect(status().isCreated());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeCreate + 1);
        CampaignExecution testCampaignExecution = campaignExecutionList.get(campaignExecutionList.size() - 1);
        assertThat(testCampaignExecution.getBody()).isEqualTo(DEFAULT_BODY);
        assertThat(testCampaignExecution.getBodyContentType()).isEqualTo(DEFAULT_BODY_CONTENT_TYPE);
        assertThat(testCampaignExecution.getSheduleDttm()).isEqualTo(DEFAULT_SHEDULE_DTTM);
        assertThat(testCampaignExecution.getExecutionDttm()).isEqualTo(DEFAULT_EXECUTION_DTTM);
    }

    @Test
    @Transactional
    void createCampaignExecutionWithExistingId() throws Exception {
        // Create the CampaignExecution with an existing ID
        campaignExecution.setId(1L);

        int databaseSizeBeforeCreate = campaignExecutionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCampaignExecutionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(campaignExecution))
            )
            .andExpect(status().isBadRequest());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCampaignExecutions() throws Exception {
        // Initialize the database
        campaignExecutionRepository.saveAndFlush(campaignExecution);

        // Get all the campaignExecutionList
        restCampaignExecutionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(campaignExecution.getId().intValue())))
            .andExpect(jsonPath("$.[*].bodyContentType").value(hasItem(DEFAULT_BODY_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].body").value(hasItem(Base64Utils.encodeToString(DEFAULT_BODY))))
            .andExpect(jsonPath("$.[*].sheduleDttm").value(hasItem(sameInstant(DEFAULT_SHEDULE_DTTM))))
            .andExpect(jsonPath("$.[*].executionDttm").value(hasItem(sameInstant(DEFAULT_EXECUTION_DTTM))));
    }

    @Test
    @Transactional
    void getCampaignExecution() throws Exception {
        // Initialize the database
        campaignExecutionRepository.saveAndFlush(campaignExecution);

        // Get the campaignExecution
        restCampaignExecutionMockMvc
            .perform(get(ENTITY_API_URL_ID, campaignExecution.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(campaignExecution.getId().intValue()))
            .andExpect(jsonPath("$.bodyContentType").value(DEFAULT_BODY_CONTENT_TYPE))
            .andExpect(jsonPath("$.body").value(Base64Utils.encodeToString(DEFAULT_BODY)))
            .andExpect(jsonPath("$.sheduleDttm").value(sameInstant(DEFAULT_SHEDULE_DTTM)))
            .andExpect(jsonPath("$.executionDttm").value(sameInstant(DEFAULT_EXECUTION_DTTM)));
    }

    @Test
    @Transactional
    void getNonExistingCampaignExecution() throws Exception {
        // Get the campaignExecution
        restCampaignExecutionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCampaignExecution() throws Exception {
        // Initialize the database
        campaignExecutionRepository.saveAndFlush(campaignExecution);

        int databaseSizeBeforeUpdate = campaignExecutionRepository.findAll().size();

        // Update the campaignExecution
        CampaignExecution updatedCampaignExecution = campaignExecutionRepository.findById(campaignExecution.getId()).get();
        // Disconnect from session so that the updates on updatedCampaignExecution are not directly saved in db
        em.detach(updatedCampaignExecution);
        updatedCampaignExecution
            .body(UPDATED_BODY)
            .bodyContentType(UPDATED_BODY_CONTENT_TYPE)
            .sheduleDttm(UPDATED_SHEDULE_DTTM)
            .executionDttm(UPDATED_EXECUTION_DTTM);

        restCampaignExecutionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCampaignExecution.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCampaignExecution))
            )
            .andExpect(status().isOk());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeUpdate);
        CampaignExecution testCampaignExecution = campaignExecutionList.get(campaignExecutionList.size() - 1);
        assertThat(testCampaignExecution.getBody()).isEqualTo(UPDATED_BODY);
        assertThat(testCampaignExecution.getBodyContentType()).isEqualTo(UPDATED_BODY_CONTENT_TYPE);
        assertThat(testCampaignExecution.getSheduleDttm()).isEqualTo(UPDATED_SHEDULE_DTTM);
        assertThat(testCampaignExecution.getExecutionDttm()).isEqualTo(UPDATED_EXECUTION_DTTM);
    }

    @Test
    @Transactional
    void putNonExistingCampaignExecution() throws Exception {
        int databaseSizeBeforeUpdate = campaignExecutionRepository.findAll().size();
        campaignExecution.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCampaignExecutionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, campaignExecution.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(campaignExecution))
            )
            .andExpect(status().isBadRequest());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCampaignExecution() throws Exception {
        int databaseSizeBeforeUpdate = campaignExecutionRepository.findAll().size();
        campaignExecution.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCampaignExecutionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(campaignExecution))
            )
            .andExpect(status().isBadRequest());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCampaignExecution() throws Exception {
        int databaseSizeBeforeUpdate = campaignExecutionRepository.findAll().size();
        campaignExecution.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCampaignExecutionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(campaignExecution))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCampaignExecutionWithPatch() throws Exception {
        // Initialize the database
        campaignExecutionRepository.saveAndFlush(campaignExecution);

        int databaseSizeBeforeUpdate = campaignExecutionRepository.findAll().size();

        // Update the campaignExecution using partial update
        CampaignExecution partialUpdatedCampaignExecution = new CampaignExecution();
        partialUpdatedCampaignExecution.setId(campaignExecution.getId());

        partialUpdatedCampaignExecution
            .body(UPDATED_BODY)
            .bodyContentType(UPDATED_BODY_CONTENT_TYPE)
            .sheduleDttm(UPDATED_SHEDULE_DTTM)
            .executionDttm(UPDATED_EXECUTION_DTTM);

        restCampaignExecutionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCampaignExecution.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCampaignExecution))
            )
            .andExpect(status().isOk());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeUpdate);
        CampaignExecution testCampaignExecution = campaignExecutionList.get(campaignExecutionList.size() - 1);
        assertThat(testCampaignExecution.getBody()).isEqualTo(UPDATED_BODY);
        assertThat(testCampaignExecution.getBodyContentType()).isEqualTo(UPDATED_BODY_CONTENT_TYPE);
        assertThat(testCampaignExecution.getSheduleDttm()).isEqualTo(UPDATED_SHEDULE_DTTM);
        assertThat(testCampaignExecution.getExecutionDttm()).isEqualTo(UPDATED_EXECUTION_DTTM);
    }

    @Test
    @Transactional
    void fullUpdateCampaignExecutionWithPatch() throws Exception {
        // Initialize the database
        campaignExecutionRepository.saveAndFlush(campaignExecution);

        int databaseSizeBeforeUpdate = campaignExecutionRepository.findAll().size();

        // Update the campaignExecution using partial update
        CampaignExecution partialUpdatedCampaignExecution = new CampaignExecution();
        partialUpdatedCampaignExecution.setId(campaignExecution.getId());

        partialUpdatedCampaignExecution
            .body(UPDATED_BODY)
            .bodyContentType(UPDATED_BODY_CONTENT_TYPE)
            .sheduleDttm(UPDATED_SHEDULE_DTTM)
            .executionDttm(UPDATED_EXECUTION_DTTM);

        restCampaignExecutionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCampaignExecution.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCampaignExecution))
            )
            .andExpect(status().isOk());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeUpdate);
        CampaignExecution testCampaignExecution = campaignExecutionList.get(campaignExecutionList.size() - 1);
        assertThat(testCampaignExecution.getBody()).isEqualTo(UPDATED_BODY);
        assertThat(testCampaignExecution.getBodyContentType()).isEqualTo(UPDATED_BODY_CONTENT_TYPE);
        assertThat(testCampaignExecution.getSheduleDttm()).isEqualTo(UPDATED_SHEDULE_DTTM);
        assertThat(testCampaignExecution.getExecutionDttm()).isEqualTo(UPDATED_EXECUTION_DTTM);
    }

    @Test
    @Transactional
    void patchNonExistingCampaignExecution() throws Exception {
        int databaseSizeBeforeUpdate = campaignExecutionRepository.findAll().size();
        campaignExecution.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCampaignExecutionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, campaignExecution.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(campaignExecution))
            )
            .andExpect(status().isBadRequest());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCampaignExecution() throws Exception {
        int databaseSizeBeforeUpdate = campaignExecutionRepository.findAll().size();
        campaignExecution.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCampaignExecutionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(campaignExecution))
            )
            .andExpect(status().isBadRequest());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCampaignExecution() throws Exception {
        int databaseSizeBeforeUpdate = campaignExecutionRepository.findAll().size();
        campaignExecution.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCampaignExecutionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(campaignExecution))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CampaignExecution in the database
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCampaignExecution() throws Exception {
        // Initialize the database
        campaignExecutionRepository.saveAndFlush(campaignExecution);

        int databaseSizeBeforeDelete = campaignExecutionRepository.findAll().size();

        // Delete the campaignExecution
        restCampaignExecutionMockMvc
            .perform(delete(ENTITY_API_URL_ID, campaignExecution.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CampaignExecution> campaignExecutionList = campaignExecutionRepository.findAll();
        assertThat(campaignExecutionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
