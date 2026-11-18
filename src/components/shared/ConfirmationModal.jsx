import React from 'react';
import { Warning, Check, X } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useProperty } from '../../context/PropertyContext';

export default function ConfirmationModal() {
  const { confirmationConfig, closeConfirm } = useProperty();

  if (!confirmationConfig) return null;

  const {
    title = 'Confirm action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    onConfirm
  } = confirmationConfig;

  const handleConfirm = () => {
    onConfirm?.();
    closeConfirm();
  };

  return (
    <Dialog open={!!confirmationConfig} onOpenChange={closeConfirm}>
      <DialogContent className="max-w-md p-6 rounded-3xl bg-white border-0 shadow-2xl text-left">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
          }`}>
            <Warning size={24} weight="duotone" />
          </div>

          <div className="flex-1 min-w-0">
            <DialogTitle className="heading-4 text-brand-navy font-bold mb-1">
              {title}
            </DialogTitle>
            <DialogDescription className="body-5 text-slate-500 leading-relaxed">
              {message}
            </DialogDescription>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeConfirm}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`py-2 px-4 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer ${
              isDestructive 
                ? 'bg-rose-600 hover:bg-rose-700' 
                : 'bg-brand-navy hover:bg-brand-blue'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
