import { useState, useCallback } from 'react';

interface ConfirmDialogOptions {
  variant?: 'primary' | 'secondary' | 'warning' | 'error';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

interface ConfirmDialogState {
  show: boolean;
  title: string;
  message: string;
  variant: 'primary' | 'secondary' | 'warning' | 'error';
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  loading: boolean;
}

export const useConfirmDialog = () => {
  const [dialog, setDialog] = useState<ConfirmDialogState>({
    show: false,
    title: '',
    message: '',
    variant: 'primary',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    onConfirm: null,
    loading: false,
  });

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      options: ConfirmDialogOptions = {}
    ) => {
      setDialog({
        show: true,
        title,
        message,
        variant: options.variant || 'primary',
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        onConfirm,
        loading: options.loading || false,
      });
    },
    []
  );

  const hideConfirm = useCallback(() => {
    setDialog((prev) => ({
      ...prev,
      show: false,
      onConfirm: null,
      loading: false,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setDialog((prev) => ({
      ...prev,
      loading,
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    hideConfirm();
  }, [dialog.onConfirm, hideConfirm]);

  return {
    dialog,
    showConfirm,
    hideConfirm,
    setLoading,
    handleConfirm,
  };
};

