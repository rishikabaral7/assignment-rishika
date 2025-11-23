//package com.payment.service;
//
//import com.payment.dto.MerchantRequest;
//import com.payment.entity.Merchant;
//import com.payment.repository.MerchantRepository;
//import io.micronaut.data.model.Page;
//import io.micronaut.data.model.Pageable;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.*;
//
//class MerchantServiceTest {
//
//    private MerchantRepository merchantRepository;
//    private MerchantService merchantService;
//
//    @BeforeEach
//    void setup() {
//        merchantRepository = Mockito.mock(MerchantRepository.class);
//        merchantService = new MerchantService(merchantRepository);
//    }
//
//    @Test
//    void createMerchant_happyPath() {
//        MerchantRequest req = new MerchantRequest();
//        req.setName("Acme");
//        req.setEmail("acme@example.com");
//        req.setPhone("+123456789");
//
//        Merchant saved = new Merchant();
//        saved.setId(1L);
//        saved.setMerchantId("MRCTEST01");
//        saved.setName(req.getName());
//        saved.setEmail(req.getEmail());
//        saved.setPhone(req.getPhone());
//
//        Mockito.when(merchantRepository.save(any(Merchant.class))).thenReturn(saved);
//
//        var resp = merchantService.create(req);
//        assertNotNull(resp);
//        assertEquals("MRCTEST01", resp.getMerchantId());
//        assertEquals("Acme", resp.getName());
//    }
//
//    @Test
//    void getByMerchantId_whenNotFound_throws() {
//        Mockito.when(merchantRepository.findByMerchantId("MRC-NOT-EXISTS")).thenReturn(Optional.empty());
//        Exception ex = assertThrows(RuntimeException.class, () -> merchantService.getByMerchantId("MRC-NOT-EXISTS"));
//        assertTrue(ex.getMessage().contains("not found") || ex instanceof RuntimeException);
//    }
//
//    @Test
//    void list_returnsPage() {
//        Mockito.when(merchantRepository.findAll(any(Pageable.class))).thenReturn(Page.of(0,10,10));
//        var page = merchantService.list(null, null, 0, 10, null);
//        assertNotNull(page);
//        assertEquals(0, page.getTotalElements());
//    }
//}
