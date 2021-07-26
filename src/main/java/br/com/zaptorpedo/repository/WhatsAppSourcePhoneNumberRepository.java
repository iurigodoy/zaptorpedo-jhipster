package br.com.zaptorpedo.repository;

import br.com.zaptorpedo.domain.WhatsAppSourcePhoneNumber;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the WhatsAppSourcePhoneNumber entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WhatsAppSourcePhoneNumberRepository extends JpaRepository<WhatsAppSourcePhoneNumber, Long> {}
