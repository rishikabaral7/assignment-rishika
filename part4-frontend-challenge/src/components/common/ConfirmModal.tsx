import React from 'react';
import './ConfirmModal.css';

type Props = {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmModal: React.FC<Props> = ({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="confirm-overlay">
            <dialog className="confirm-modal" open>
                {title && <h3 className="confirm-title">{title}</h3>}
                <div className="confirm-message">{message}</div>
                <div className="confirm-actions">
                    <button className="btn-cancel" onClick={onCancel}>{cancelLabel}</button>
                    <button className="btn-primary" onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </dialog>
        </div>
    );
};

export default ConfirmModal;
