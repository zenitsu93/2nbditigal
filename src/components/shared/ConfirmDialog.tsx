import { Modal, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';

interface ConfirmDialogProps {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'secondary' | 'warning' | 'error';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDialog = ({
  show,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          buttonColor: 'failure' as const,
          icon: 'solar:danger-triangle-bold',
          iconColor: 'text-red-500',
          bgColor: 'bg-red-100',
        };
      case 'warning':
        return {
          buttonColor: 'warning' as const,
          icon: 'solar:danger-triangle-bold',
          iconColor: 'text-orange-500',
          bgColor: 'bg-orange-100',
        };
      case 'secondary':
        return {
          buttonColor: 'light' as const,
          icon: 'solar:question-circle-bold',
          iconColor: 'text-gray-500',
          bgColor: 'bg-gray-100',
        };
      default:
        return {
          buttonColor: 'primary' as const,
          icon: 'solar:question-circle-bold',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-100',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal show={show} onClose={onCancel} size="md">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${styles.bgColor}`}>
            <Icon icon={styles.icon} className={`text-xl ${styles.iconColor}`} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
      <div className="px-6 py-4 border-t flex justify-end gap-3">
        <Button color="light" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button color={styles.buttonColor} onClick={onConfirm} disabled={loading}>
          {loading ? (
            <>
              <Icon icon="solar:loading-circle-bold" className="mr-2 animate-spin" />
              Traitement...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

