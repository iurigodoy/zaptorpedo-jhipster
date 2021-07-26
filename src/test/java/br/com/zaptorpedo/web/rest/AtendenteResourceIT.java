package br.com.zaptorpedo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.zaptorpedo.IntegrationTest;
import br.com.zaptorpedo.domain.Atendente;
import br.com.zaptorpedo.repository.AtendenteRepository;
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
 * Integration tests for the {@link AtendenteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AtendenteResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/atendentes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AtendenteRepository atendenteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAtendenteMockMvc;

    private Atendente atendente;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Atendente createEntity(EntityManager em) {
        Atendente atendente = new Atendente().name(DEFAULT_NAME);
        return atendente;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Atendente createUpdatedEntity(EntityManager em) {
        Atendente atendente = new Atendente().name(UPDATED_NAME);
        return atendente;
    }

    @BeforeEach
    public void initTest() {
        atendente = createEntity(em);
    }

    @Test
    @Transactional
    void createAtendente() throws Exception {
        int databaseSizeBeforeCreate = atendenteRepository.findAll().size();
        // Create the Atendente
        restAtendenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atendente)))
            .andExpect(status().isCreated());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeCreate + 1);
        Atendente testAtendente = atendenteList.get(atendenteList.size() - 1);
        assertThat(testAtendente.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createAtendenteWithExistingId() throws Exception {
        // Create the Atendente with an existing ID
        atendente.setId(1L);

        int databaseSizeBeforeCreate = atendenteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAtendenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atendente)))
            .andExpect(status().isBadRequest());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = atendenteRepository.findAll().size();
        // set the field null
        atendente.setName(null);

        // Create the Atendente, which fails.

        restAtendenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atendente)))
            .andExpect(status().isBadRequest());

        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAtendentes() throws Exception {
        // Initialize the database
        atendenteRepository.saveAndFlush(atendente);

        // Get all the atendenteList
        restAtendenteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(atendente.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getAtendente() throws Exception {
        // Initialize the database
        atendenteRepository.saveAndFlush(atendente);

        // Get the atendente
        restAtendenteMockMvc
            .perform(get(ENTITY_API_URL_ID, atendente.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(atendente.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingAtendente() throws Exception {
        // Get the atendente
        restAtendenteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAtendente() throws Exception {
        // Initialize the database
        atendenteRepository.saveAndFlush(atendente);

        int databaseSizeBeforeUpdate = atendenteRepository.findAll().size();

        // Update the atendente
        Atendente updatedAtendente = atendenteRepository.findById(atendente.getId()).get();
        // Disconnect from session so that the updates on updatedAtendente are not directly saved in db
        em.detach(updatedAtendente);
        updatedAtendente.name(UPDATED_NAME);

        restAtendenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAtendente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAtendente))
            )
            .andExpect(status().isOk());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeUpdate);
        Atendente testAtendente = atendenteList.get(atendenteList.size() - 1);
        assertThat(testAtendente.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingAtendente() throws Exception {
        int databaseSizeBeforeUpdate = atendenteRepository.findAll().size();
        atendente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAtendenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, atendente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(atendente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAtendente() throws Exception {
        int databaseSizeBeforeUpdate = atendenteRepository.findAll().size();
        atendente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtendenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(atendente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAtendente() throws Exception {
        int databaseSizeBeforeUpdate = atendenteRepository.findAll().size();
        atendente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtendenteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atendente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAtendenteWithPatch() throws Exception {
        // Initialize the database
        atendenteRepository.saveAndFlush(atendente);

        int databaseSizeBeforeUpdate = atendenteRepository.findAll().size();

        // Update the atendente using partial update
        Atendente partialUpdatedAtendente = new Atendente();
        partialUpdatedAtendente.setId(atendente.getId());

        partialUpdatedAtendente.name(UPDATED_NAME);

        restAtendenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAtendente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAtendente))
            )
            .andExpect(status().isOk());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeUpdate);
        Atendente testAtendente = atendenteList.get(atendenteList.size() - 1);
        assertThat(testAtendente.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateAtendenteWithPatch() throws Exception {
        // Initialize the database
        atendenteRepository.saveAndFlush(atendente);

        int databaseSizeBeforeUpdate = atendenteRepository.findAll().size();

        // Update the atendente using partial update
        Atendente partialUpdatedAtendente = new Atendente();
        partialUpdatedAtendente.setId(atendente.getId());

        partialUpdatedAtendente.name(UPDATED_NAME);

        restAtendenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAtendente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAtendente))
            )
            .andExpect(status().isOk());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeUpdate);
        Atendente testAtendente = atendenteList.get(atendenteList.size() - 1);
        assertThat(testAtendente.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingAtendente() throws Exception {
        int databaseSizeBeforeUpdate = atendenteRepository.findAll().size();
        atendente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAtendenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, atendente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(atendente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAtendente() throws Exception {
        int databaseSizeBeforeUpdate = atendenteRepository.findAll().size();
        atendente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtendenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(atendente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAtendente() throws Exception {
        int databaseSizeBeforeUpdate = atendenteRepository.findAll().size();
        atendente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtendenteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(atendente))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Atendente in the database
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAtendente() throws Exception {
        // Initialize the database
        atendenteRepository.saveAndFlush(atendente);

        int databaseSizeBeforeDelete = atendenteRepository.findAll().size();

        // Delete the atendente
        restAtendenteMockMvc
            .perform(delete(ENTITY_API_URL_ID, atendente.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Atendente> atendenteList = atendenteRepository.findAll();
        assertThat(atendenteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
