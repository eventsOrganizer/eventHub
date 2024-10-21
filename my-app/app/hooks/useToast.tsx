import React, { useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

interface ToastOptions {
  title: string;
  description: string;
  variant: 'default' | 'destructive';
}

export const useToast = () => {
  const [toastConfig, setToastConfig] = useState<ToastOptions | null>(null);

  const toast = useCallback((options: ToastOptions) => {
    setToastConfig(options);
    setTimeout(() => setToastConfig(null), 3000);
  }, []);

  const ToastComponent = toastConfig ? (
    <Toast
      message={`${toastConfig.title}: ${toastConfig.description}`}
      type={toastConfig.variant === 'destructive' ? 'error' : 'success'}
    />
  ) : null;

  return { toast, ToastComponent };
};