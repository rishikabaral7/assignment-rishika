package com.payment.service;

import com.payment.dto.MerchantRequest;
import com.payment.dto.MerchantResponse;
import com.payment.dto.PagedResponse;
import com.payment.entity.Merchant;
import com.payment.exception.NotFoundException;
import com.payment.repository.MerchantRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import jakarta.inject.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Singleton
public class MerchantService {

    private static final Logger LOG = LoggerFactory.getLogger(MerchantService.class);

    private final MerchantRepository merchantRepository;

    public MerchantService(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    public MerchantResponse create(MerchantRequest req) {
        Merchant m = new Merchant();
        m.setName(req.getName());
        m.setEmail(req.getEmail());
        m.setPhone(req.getPhone());
        m.setAddress(req.getAddress());
        m.setStatus("ACTIVE");

        Merchant saved = merchantRepository.save(m);
        return toDto(saved);
    }

    public MerchantResponse update(String merchantId, MerchantRequest req) {
        Merchant merchant = merchantRepository.findByMerchantId(merchantId)
                .orElseThrow(() -> new NotFoundException("Merchant", merchantId));

        merchant.setName(req.getName());
        merchant.setEmail(req.getEmail());
        merchant.setPhone(req.getPhone());
        merchant.setAddress(req.getAddress());

        Merchant updated = merchantRepository.update(merchant);
        return toDto(updated);
    }

    public MerchantResponse getByMerchantId(String merchantId) {
        Merchant merchant = merchantRepository.findByMerchantId(merchantId)
                .orElseThrow(() -> new NotFoundException("Merchant", merchantId));
        return toDto(merchant);
    }

    public PagedResponse<MerchantResponse> list(String search, String status, int page, int size, String sort) {
        Pageable pageable = Pageable.from(page, size);
        Page<Merchant> resultPage;

        if (search != null && !search.isBlank()) {
            resultPage = merchantRepository.findByNameContainsIgnoreCaseOrMerchantIdContainsIgnoreCase(search, search,
                    pageable);
        } else if (status != null && !status.isBlank()) {
            resultPage = merchantRepository.findByStatus(status, pageable);
        } else {
            resultPage = merchantRepository.findAll(pageable);
        }

        List<MerchantResponse> content = resultPage.getContent().stream().map(this::toDto).collect(Collectors.toList());
        return new PagedResponse<>(content, resultPage.getTotalSize(), page, size, resultPage.getTotalPages());
    }

    public MerchantResponse changeStatus(String merchantId, String newStatus) {
        Merchant merchant = merchantRepository.findByMerchantId(merchantId)
                .orElseThrow(() -> new NotFoundException("Merchant", merchantId));
        merchant.setStatus(newStatus);
        Merchant updated = merchantRepository.update(merchant);
        return toDto(updated);
    }

    private MerchantResponse toDto(Merchant m) {
        MerchantResponse r = new MerchantResponse();
        r.setMerchantId(m.getMerchantId());
        r.setName(m.getName());
        r.setEmail(m.getEmail());
        r.setPhone(m.getPhone());
        r.setAddress(m.getAddress());
        r.setStatus(m.getStatus());
        r.setCreatedAt(m.getCreatedAt());
        r.setUpdatedAt(m.getUpdatedAt());
        return r;
    }

    private String generateMerchantId() {
        // Generate lightweight merchant code: MRC + short UUID
        return "MRC" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }

    public Map<String, Object> getMerchants(int page, int size, String sortBy, String order, String search,
            String status) {
        return null;
    }

    public MerchantResponse createMerchant(MerchantRequest request) {
        return null;
    }

    public MerchantResponse getMerchantById(Long id) {
        return null;
    }

    public List<Merchant> findAll() {
        return (List<Merchant>) merchantRepository.findAll();
    }

    public MerchantResponse updateMerchant(Long id, MerchantRequest request) {
        return null;
    }

    public void deleteMerchant(Long id) {

    }

}
