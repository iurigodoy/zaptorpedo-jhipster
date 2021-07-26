package br.com.zaptorpedo.repository;

import br.com.zaptorpedo.domain.Atendente;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Atendente entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AtendenteRepository extends JpaRepository<Atendente, Long> {}
