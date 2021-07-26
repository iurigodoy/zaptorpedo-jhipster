package br.com.zaptorpedo.repository;

import br.com.zaptorpedo.domain.CampaignExecution;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CampaignExecution entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CampaignExecutionRepository extends JpaRepository<CampaignExecution, Long> {}
