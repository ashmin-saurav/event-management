package com.connectgo.backend.repository;

import com.connectgo.backend.entity.Registration;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    long countByEventId(Long eventId);
    List<Registration> findAllByUserIdOrderByRegisteredAtDesc(Long userId);
    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);
}