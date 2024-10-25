declare module 'expo-barcode-scanner' {
    export const BarCodeScanner: any;
    export function requestPermissionsAsync(): Promise<{ status: string }>;
  }