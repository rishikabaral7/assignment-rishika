package com.payment.repository;

import com.payment.entity.Merchant;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.PageableRepository;

import java.util.Optional;
import java.util.UUID;

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface MerchantRepository extends PageableRepository<Merchant, String> {
    Optional<Merchant> findByMerchantId(String merchantId);

    // Search by name or merchantId (Micronaut Data will derive queries)
    Page<Merchant> findByNameContainsIgnoreCaseOrMerchantIdContainsIgnoreCase(String name, String merchantId, Pageable pageable);

    Page<Merchant> findByStatus(String status, Pageable pageable);

    // Fallback: findAll(Pageable) is provided by PageableRepository
}
