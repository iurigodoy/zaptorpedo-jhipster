package br.com.zaptorpedo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.zaptorpedo.IntegrationTest;
import br.com.zaptorpedo.domain.WhatsAppSourcePhoneNumber;
import br.com.zaptorpedo.repository.WhatsAppSourcePhoneNumberRepository;
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

/**
 * Integration tests for the {@link WhatsAppSourcePhoneNumberResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WhatsAppSourcePhoneNumberResourceIT {

    private static final String DEFAULT_INSTANCE_ID = "AAAAAAAAAA";
    private static final String UPDATED_INSTANCE_ID = "BBBBBBBBBB";

    private static final Long DEFAULT_MSISDN = 1L;
    private static final Long UPDATED_MSISDN = 2L;

    private static final String ENTITY_API_URL = "/api/whats-app-source-phone-numbers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WhatsAppSourcePhoneNumberRepository whatsAppSourcePhoneNumberRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWhatsAppSourcePhoneNumberMockMvc;

    private WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WhatsAppSourcePhoneNumber createEntity(EntityManager em) {
        WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber = new WhatsAppSourcePhoneNumber()
            .instanceId(DEFAULT_INSTANCE_ID)
            .msisdn(DEFAULT_MSISDN);
        return whatsAppSourcePhoneNumber;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WhatsAppSourcePhoneNumber createUpdatedEntity(EntityManager em) {
        WhatsAppSourcePhoneNumber whatsAppSourcePhoneNumber = new WhatsAppSourcePhoneNumber()
            .instanceId(UPDATED_INSTANCE_ID)
            .msisdn(UPDATED_MSISDN);
        return whatsAppSourcePhoneNumber;
    }

    @BeforeEach
    public void initTest() {
        whatsAppSourcePhoneNumber = createEntity(em);
    }

    @Test
    @Transactional
    void createWhatsAppSourcePhoneNumber() throws Exception {
        int databaseSizeBeforeCreate = whatsAppSourcePhoneNumberRepository.findAll().size();
        // Create the WhatsAppSourcePhoneNumber
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isCreated());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeCreate + 1);
        WhatsAppSourcePhoneNumber testWhatsAppSourcePhoneNumber = whatsAppSourcePhoneNumberList.get(
            whatsAppSourcePhoneNumberList.size() - 1
        );
        assertThat(testWhatsAppSourcePhoneNumber.getInstanceId()).isEqualTo(DEFAULT_INSTANCE_ID);
        assertThat(testWhatsAppSourcePhoneNumber.getMsisdn()).isEqualTo(DEFAULT_MSISDN);
    }

    @Test
    @Transactional
    void createWhatsAppSourcePhoneNumberWithExistingId() throws Exception {
        // Create the WhatsAppSourcePhoneNumber with an existing ID
        whatsAppSourcePhoneNumber.setId(1L);

        int databaseSizeBeforeCreate = whatsAppSourcePhoneNumberRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkInstanceIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = whatsAppSourcePhoneNumberRepository.findAll().size();
        // set the field null
        whatsAppSourcePhoneNumber.setInstanceId(null);

        // Create the WhatsAppSourcePhoneNumber, which fails.

        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isBadRequest());

        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMsisdnIsRequired() throws Exception {
        int databaseSizeBeforeTest = whatsAppSourcePhoneNumberRepository.findAll().size();
        // set the field null
        whatsAppSourcePhoneNumber.setMsisdn(null);

        // Create the WhatsAppSourcePhoneNumber, which fails.

        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isBadRequest());

        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllWhatsAppSourcePhoneNumbers() throws Exception {
        // Initialize the database
        whatsAppSourcePhoneNumberRepository.saveAndFlush(whatsAppSourcePhoneNumber);

        // Get all the whatsAppSourcePhoneNumberList
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(whatsAppSourcePhoneNumber.getId().intValue())))
            .andExpect(jsonPath("$.[*].instanceId").value(hasItem(DEFAULT_INSTANCE_ID)))
            .andExpect(jsonPath("$.[*].msisdn").value(hasItem(DEFAULT_MSISDN.intValue())));
    }

    @Test
    @Transactional
    void getWhatsAppSourcePhoneNumber() throws Exception {
        // Initialize the database
        whatsAppSourcePhoneNumberRepository.saveAndFlush(whatsAppSourcePhoneNumber);

        // Get the whatsAppSourcePhoneNumber
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(get(ENTITY_API_URL_ID, whatsAppSourcePhoneNumber.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(whatsAppSourcePhoneNumber.getId().intValue()))
            .andExpect(jsonPath("$.instanceId").value(DEFAULT_INSTANCE_ID))
            .andExpect(jsonPath("$.msisdn").value(DEFAULT_MSISDN.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingWhatsAppSourcePhoneNumber() throws Exception {
        // Get the whatsAppSourcePhoneNumber
        restWhatsAppSourcePhoneNumberMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewWhatsAppSourcePhoneNumber() throws Exception {
        // Initialize the database
        whatsAppSourcePhoneNumberRepository.saveAndFlush(whatsAppSourcePhoneNumber);

        int databaseSizeBeforeUpdate = whatsAppSourcePhoneNumberRepository.findAll().size();

        // Update the whatsAppSourcePhoneNumber
        WhatsAppSourcePhoneNumber updatedWhatsAppSourcePhoneNumber = whatsAppSourcePhoneNumberRepository
            .findById(whatsAppSourcePhoneNumber.getId())
            .get();
        // Disconnect from session so that the updates on updatedWhatsAppSourcePhoneNumber are not directly saved in db
        em.detach(updatedWhatsAppSourcePhoneNumber);
        updatedWhatsAppSourcePhoneNumber.instanceId(UPDATED_INSTANCE_ID).msisdn(UPDATED_MSISDN);

        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWhatsAppSourcePhoneNumber.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWhatsAppSourcePhoneNumber))
            )
            .andExpect(status().isOk());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeUpdate);
        WhatsAppSourcePhoneNumber testWhatsAppSourcePhoneNumber = whatsAppSourcePhoneNumberList.get(
            whatsAppSourcePhoneNumberList.size() - 1
        );
        assertThat(testWhatsAppSourcePhoneNumber.getInstanceId()).isEqualTo(UPDATED_INSTANCE_ID);
        assertThat(testWhatsAppSourcePhoneNumber.getMsisdn()).isEqualTo(UPDATED_MSISDN);
    }

    @Test
    @Transactional
    void putNonExistingWhatsAppSourcePhoneNumber() throws Exception {
        int databaseSizeBeforeUpdate = whatsAppSourcePhoneNumberRepository.findAll().size();
        whatsAppSourcePhoneNumber.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                put(ENTITY_API_URL_ID, whatsAppSourcePhoneNumber.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWhatsAppSourcePhoneNumber() throws Exception {
        int databaseSizeBeforeUpdate = whatsAppSourcePhoneNumberRepository.findAll().size();
        whatsAppSourcePhoneNumber.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWhatsAppSourcePhoneNumber() throws Exception {
        int databaseSizeBeforeUpdate = whatsAppSourcePhoneNumberRepository.findAll().size();
        whatsAppSourcePhoneNumber.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWhatsAppSourcePhoneNumberWithPatch() throws Exception {
        // Initialize the database
        whatsAppSourcePhoneNumberRepository.saveAndFlush(whatsAppSourcePhoneNumber);

        int databaseSizeBeforeUpdate = whatsAppSourcePhoneNumberRepository.findAll().size();

        // Update the whatsAppSourcePhoneNumber using partial update
        WhatsAppSourcePhoneNumber partialUpdatedWhatsAppSourcePhoneNumber = new WhatsAppSourcePhoneNumber();
        partialUpdatedWhatsAppSourcePhoneNumber.setId(whatsAppSourcePhoneNumber.getId());

        partialUpdatedWhatsAppSourcePhoneNumber.msisdn(UPDATED_MSISDN);

        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWhatsAppSourcePhoneNumber.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWhatsAppSourcePhoneNumber))
            )
            .andExpect(status().isOk());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeUpdate);
        WhatsAppSourcePhoneNumber testWhatsAppSourcePhoneNumber = whatsAppSourcePhoneNumberList.get(
            whatsAppSourcePhoneNumberList.size() - 1
        );
        assertThat(testWhatsAppSourcePhoneNumber.getInstanceId()).isEqualTo(DEFAULT_INSTANCE_ID);
        assertThat(testWhatsAppSourcePhoneNumber.getMsisdn()).isEqualTo(UPDATED_MSISDN);
    }

    @Test
    @Transactional
    void fullUpdateWhatsAppSourcePhoneNumberWithPatch() throws Exception {
        // Initialize the database
        whatsAppSourcePhoneNumberRepository.saveAndFlush(whatsAppSourcePhoneNumber);

        int databaseSizeBeforeUpdate = whatsAppSourcePhoneNumberRepository.findAll().size();

        // Update the whatsAppSourcePhoneNumber using partial update
        WhatsAppSourcePhoneNumber partialUpdatedWhatsAppSourcePhoneNumber = new WhatsAppSourcePhoneNumber();
        partialUpdatedWhatsAppSourcePhoneNumber.setId(whatsAppSourcePhoneNumber.getId());

        partialUpdatedWhatsAppSourcePhoneNumber.instanceId(UPDATED_INSTANCE_ID).msisdn(UPDATED_MSISDN);

        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWhatsAppSourcePhoneNumber.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWhatsAppSourcePhoneNumber))
            )
            .andExpect(status().isOk());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeUpdate);
        WhatsAppSourcePhoneNumber testWhatsAppSourcePhoneNumber = whatsAppSourcePhoneNumberList.get(
            whatsAppSourcePhoneNumberList.size() - 1
        );
        assertThat(testWhatsAppSourcePhoneNumber.getInstanceId()).isEqualTo(UPDATED_INSTANCE_ID);
        assertThat(testWhatsAppSourcePhoneNumber.getMsisdn()).isEqualTo(UPDATED_MSISDN);
    }

    @Test
    @Transactional
    void patchNonExistingWhatsAppSourcePhoneNumber() throws Exception {
        int databaseSizeBeforeUpdate = whatsAppSourcePhoneNumberRepository.findAll().size();
        whatsAppSourcePhoneNumber.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, whatsAppSourcePhoneNumber.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWhatsAppSourcePhoneNumber() throws Exception {
        int databaseSizeBeforeUpdate = whatsAppSourcePhoneNumberRepository.findAll().size();
        whatsAppSourcePhoneNumber.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWhatsAppSourcePhoneNumber() throws Exception {
        int databaseSizeBeforeUpdate = whatsAppSourcePhoneNumberRepository.findAll().size();
        whatsAppSourcePhoneNumber.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(whatsAppSourcePhoneNumber))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WhatsAppSourcePhoneNumber in the database
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWhatsAppSourcePhoneNumber() throws Exception {
        // Initialize the database
        whatsAppSourcePhoneNumberRepository.saveAndFlush(whatsAppSourcePhoneNumber);

        int databaseSizeBeforeDelete = whatsAppSourcePhoneNumberRepository.findAll().size();

        // Delete the whatsAppSourcePhoneNumber
        restWhatsAppSourcePhoneNumberMockMvc
            .perform(delete(ENTITY_API_URL_ID, whatsAppSourcePhoneNumber.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WhatsAppSourcePhoneNumber> whatsAppSourcePhoneNumberList = whatsAppSourcePhoneNumberRepository.findAll();
        assertThat(whatsAppSourcePhoneNumberList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
