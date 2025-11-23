import './Merchants.css';
import { MerchantList } from '@/components/merchants/MerchantList';

/**
 * Merchants Page Component
 * 
 * This page is a placeholder for future merchant management functionality.
 * 
 * ASSIGNMENT: Implement the following features:
 * 
 * 1. **Merchant List View**
 *    - Display all merchants in a table or card layout
 *    - Show merchant ID, name, status, and contact information
 *    - Add search/filter functionality
 * 
 * 2. **Merchant Details**
 *    - Click on a merchant to view detailed information
 *    - Show merchant settings, payment methods, and statistics
 * 
 * 3. **Add/Edit Merchant**
 *    - Form to create new merchants
 *    - Edit existing merchant information
 *    - Validate merchant data before submission
 * 
 * 4. **API Integration**
 *    - Create merchant service API calls
 *    - GET /api/v1/merchants - List all merchants
 *    - GET /api/v1/merchants/{id} - Get merchant details
 *    - POST /api/v1/merchants - Create new merchant
 *    - PUT /api/v1/merchants/{id} - Update merchant
 */
export const Merchants = () => {
  return (
     <MerchantList />

  );
};
