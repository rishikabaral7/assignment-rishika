package com.payment.entity;
import io.micronaut.data.annotation.*;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.Column;

import java.time.Instant;
import java.util.UUID;

@Serdeable
@MappedEntity(value = "merchants", schema = "operators")
public class Merchant {

    @Id
    @GeneratedValue
    @Column(name = "merchant_id")
    private String merchantId; // external/business id

    private String name;
    private String email;
    private String phone;
    private String address;
    private String status; // ACTIVE / INACTIVE / SUSPENDED

    @DateCreated
    private Instant createdAt;

    @DateUpdated
    private Instant updatedAt;

    public Merchant() {}

    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String merchantId) { this.merchantId = merchantId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
