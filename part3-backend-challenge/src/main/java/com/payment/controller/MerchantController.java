package com.payment.controller;

import com.payment.dto.MerchantRequest;
import com.payment.dto.MerchantResponse;
import com.payment.entity.Merchant;
import com.payment.service.MerchantService;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;

import jakarta.inject.Inject;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@Controller("/api/v1/merchants")
public class MerchantController {

    private static final Logger LOG = LoggerFactory.getLogger(MerchantController.class);

    @Inject
    private MerchantService merchantService;

    // ===========================================
    // 1. LIST MERCHANTS (Search + Filter + Sort + Pagination)
    // ===========================================
    @Get()
    public HttpResponse<List<Merchant>> getAllMerchants() {
        List<Merchant> merchants = merchantService.findAll();
        return HttpResponse.ok(merchants);
    }

    // ===========================================
    // 2. CREATE MERCHANT
    // ===========================================
    @Post
    public HttpResponse<MerchantResponse> createMerchant(@Body MerchantRequest request) {
        MerchantResponse response = merchantService.createMerchant(request);
        return HttpResponse.created(response);
    }

    // ===========================================
    // 3. GET MERCHANT BY ID
    // ===========================================
    @Get("/{id}")
    public HttpResponse<Object> getMerchantById(@PathVariable String id) {
        try {
            return HttpResponse.ok(merchantService.getByMerchantId(id));
        } catch (Exception e) {
            LOG.error("Failed to get merchant by id {}", id, e);
            return HttpResponse.serverError(Map.of("message", e.getMessage(), "path", "/api/v1/merchants/" + id));
        }
    }

    // ===========================================
    // 4. UPDATE MERCHANT
    // ===========================================
    @Put("/{id}")
    public HttpResponse<com.payment.dto.MerchantResponse> updateMerchant(
            @PathVariable String id,
            @Body @Valid MerchantRequest request) {
        // Update by merchantId string
        return HttpResponse.ok(merchantService.update(id, request));
    }

    // ===========================================
    // 5. DELETE / DEACTIVATE MERCHANT
    // ===========================================
    @Delete("/{id}")
    public HttpResponse<Map<String, String>> deleteMerchant(@PathVariable String id) {
        // Soft-delete by changing status to INACTIVE
        merchantService.changeStatus(id, "INACTIVE");
        return HttpResponse.ok(Map.of("message", "Merchant deactivated successfully"));
    }
}
