export type ServiceType = 'personal' | 'local' | 'material';

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  requestId?: string;
  serviceId?: string;
  serviceType?: ServiceType;
  error?: string;
}

export interface PaymentFormProps {
  isProcessing: boolean;
  onCardChange: (cardDetails: any) => void;
  onSubmit: () => Promise<PaymentResult>;
  amount: number;
  errorMessage?: string;
}

export interface PaymentScreenParams {
  amount: number;
  serviceId: number;
  serviceType: ServiceType;
  userId: string;
  requestId: number;
}