import { useEffect } from 'react';
import { Toast as FlowbiteToast, ToastToggle } from 'flowbite-react';
import { Icon } from '@iconify/react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type, show, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'solar:check-circle-bold';
      case 'error':
        return 'solar:close-circle-bold';
      case 'warning':
        return 'solar:danger-triangle-bold';
      default:
        return 'solar:info-circle-bold';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200';
      default:
        return 'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <FlowbiteToast>
        <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getBgColor()}`}>
          <Icon icon={getIcon()} className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        <ToastToggle onDismiss={onClose} />
      </FlowbiteToast>
    </div>
  );
};

export default Toast;

