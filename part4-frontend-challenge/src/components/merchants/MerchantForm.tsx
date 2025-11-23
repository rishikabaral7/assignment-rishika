import React, { useState } from 'react';
import { Merchant } from '@/types/merchant';
import ConfirmModal from '@/components/common/ConfirmModal';

type Props = {
    onCreate?: (data: Partial<Merchant>) => Promise<Merchant>;
    onUpdate?: (id: number, data: Partial<Merchant>) => Promise<Merchant | undefined>;
    initial?: Merchant;
    onSuccess?: (m: Merchant) => void;
};

export const MerchantForm: React.FC<Props> = ({ onCreate, onUpdate, initial, onSuccess }) => {
    const [name, setName] = useState(initial?.name ?? '');
    const [email, setEmail] = useState(initial?.email ?? '');
    const [phone, setPhone] = useState(initial?.phone ?? '');
    const [businessName, setBusinessName] = useState(initial?.businessName ?? '');
    const [registrationNumber, setRegistrationNumber] = useState(initial?.registrationNumber ?? '');
    const [businessType, setBusinessType] = useState(initial?.businessType ?? '');
    const [registeredName, setRegisteredName] = useState(initial?.registeredName ?? '');
    const [panVatNumber, setPanVatNumber] = useState(initial?.panVatNumber ?? '');
    const [registrationDate, setRegistrationDate] = useState(initial?.registrationDate ?? (initial?.createdAt ? initial.createdAt.slice(0, 10) : ''));
    const [approxAnnualTurnover, setApproxAnnualTurnover] = useState(initial?.approxAnnualTurnover ?? '');
    const [approxDigitalSale, setApproxDigitalSale] = useState(initial?.approxDigitalSale ?? '');
    const [status, setStatus] = useState<string>(initial?.status ?? 'active');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);

    const handleStatusChange = (newStatus: string) => {
        if (initial && initial.status === 'active' && newStatus !== 'active') {
            setConfirmMessage('Are you sure you want to change status from Active to a non-active state?');
            setConfirmCallback(() => () => {
                setStatus(newStatus);
                setConfirmOpen(false);
            });
            setConfirmOpen(true);
            return;
        }
        setStatus(newStatus);
    };

    const [addrCountry, setAddrCountry] = useState(initial?.address?.country ?? '');
    const [addrProvince, setAddrProvince] = useState(initial?.address?.province ?? '');
    const [addrDistrict, setAddrDistrict] = useState(initial?.address?.district ?? '');
    const [addrCity, setAddrCity] = useState(initial?.address?.city ?? '');
    const [addrWard, setAddrWard] = useState(initial?.address?.ward ?? '');
    const [addrStreet, setAddrStreet] = useState(initial?.address?.street ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = 'Name is required';
        if (!email.trim()) e.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Invalid email';
        return e;
    };

    let submitLabel = 'Create Merchant';
    if (submitting) submitLabel = 'Saving...';
    else if (initial) submitLabel = 'Save Changes';
    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setBusinessName('');
        setRegistrationNumber('');
        setBusinessType('');
        setRegisteredName('');
        setPanVatNumber('');
        setRegistrationDate('');
        setApproxAnnualTurnover('');
        setApproxDigitalSale('');
        setStatus('active');
        setAddrCountry('');
        setAddrProvince('');
        setAddrDistrict('');
        setAddrCity('');
        setAddrWard('');
        setAddrStreet('');
        setErrors({});
    };

    const submitPayload = async (payload: any, isUpdate: boolean) => {
        setSubmitting(true);
        try {
            if (isUpdate) {
                if (initial && onUpdate) {
                    const updated = await onUpdate(initial.id, payload as any);
                    if (updated) {
                        setSuccess('Merchant updated successfully');
                        onSuccess?.(updated);
                    }
                } else {
                    setErrors({ form: 'No update handler available' });
                }
            } else {
                if (onCreate) {
                    const created = await onCreate(payload as any);
                    setSuccess('Merchant created successfully');
                    resetForm();
                    onSuccess?.(created);
                } else {
                    setErrors({ form: 'No create handler available' });
                }
            }
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setErrors({ form: err?.message || 'Failed to save merchant' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        const eObj = validate();
        setErrors(eObj);
        if (Object.keys(eObj).length) return;

        const base = { name: name.trim(), email: email.trim(), phone: phone.trim(), businessName: businessName.trim(), registrationNumber: registrationNumber.trim() };
        const full = {
            ...base,
            businessType: businessType.trim(),
            registeredName: registeredName.trim(),
            panVatNumber: panVatNumber.trim(),
            registrationDate: registrationDate || undefined,
            approxAnnualTurnover: approxAnnualTurnover.trim(),
            approxDigitalSale: approxDigitalSale.trim(),
            status: status,
            address: {
                country: addrCountry.trim(),
                province: addrProvince.trim(),
                district: addrDistrict.trim(),
                city: addrCity.trim(),
                ward: addrWard.trim(),
                street: addrStreet.trim(),
            }
        };

        if (initial) {
            // confirm before saving edits
            setConfirmMessage('Save changes to this merchant?');
            setConfirmCallback(() => () => {
                submitPayload(full, true);
                setConfirmOpen(false);
            });
            setConfirmOpen(true);
        } else {
            // create immediately
            submitPayload(full, false);
        }
    };

    return (
        <form className="merchant-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h3>Add New Merchant</h3>
            </div>

            <div className="section-title">Business Address</div>
            <div className="form-grid">
                <div className="form-field">
                    <label htmlFor="mf-country">Country</label>
                    <input id="mf-country" className="input" value={addrCountry} onChange={(e) => setAddrCountry(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-province">Province</label>
                    <input id="mf-province" className="input" value={addrProvince} onChange={(e) => setAddrProvince(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-district">District</label>
                    <input id="mf-district" className="input" value={addrDistrict} onChange={(e) => setAddrDistrict(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-city">City/Town</label>
                    <input id="mf-city" className="input" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-ward">Ward no</label>
                    <input id="mf-ward" className="input" value={addrWard} onChange={(e) => setAddrWard(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-street">Street Name</label>
                    <input id="mf-street" className="input" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} />
                </div>
            </div>

            {errors.form && <div className="error-text">{errors.form}</div>}
            {success && <div className="success-text">{success}</div>}

            <div className="section-title">Business Detail</div>
            <div className="form-grid">
                <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
                    <label htmlFor="mf-name">Name*</label>
                    <input id="mf-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <div className="error-text">{errors.name}</div>}
                </div>

                <div className={`form-field ${errors.email ? 'has-error' : ''}`}>
                    <label htmlFor="mf-email">Email*</label>
                    <input id="mf-email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <div className="error-text">{errors.email}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="mf-phone">Phone</label>
                    <input id="mf-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-business">Business Name</label>
                    <input id="mf-business" className="input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-business-type">Business Type</label>
                    <input id="mf-business-type" className="input" value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-registered">Registered Name</label>
                    <input id="mf-registered" className="input" value={registeredName} onChange={(e) => setRegisteredName(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-pan">PAN/VAT Number</label>
                    <input id="mf-pan" className="input" value={panVatNumber} onChange={(e) => setPanVatNumber(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-reg-date">Registration Date</label>
                    <input id="mf-reg-date" type="date" className="input" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-turnover">Approx. Annual Turnover</label>
                    <input id="mf-turnover" className="input" value={approxAnnualTurnover} onChange={(e) => setApproxAnnualTurnover(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-digital-sale">Approx. Digital Sale (Card/QR)</label>
                    <input id="mf-digital-sale" className="input" value={approxDigitalSale} onChange={(e) => setApproxDigitalSale(e.target.value)} />
                </div>

                <div className="form-field">
                    <label htmlFor="mf-status">Status</label>
                    <select id="mf-status" className="input" value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="deactivated">Deactivated</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="mf-reg">Registration Number</label>
                    <input id="mf-reg" className="input" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitting}>{submitLabel}</button>
            </div>
            <ConfirmModal
                open={confirmOpen}
                message={confirmMessage}
                onConfirm={() => { confirmCallback?.(); }}
                onCancel={() => setConfirmOpen(false)}
            />
        </form>
    );
};

export default MerchantForm;
// consolidated single implementation above