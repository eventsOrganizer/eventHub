import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid for generating unique IDs

const FLOUCI_APP_TOKEN = process.env.FLOUCI_APP_TOKEN || "4c1e07ef-8533-4e83-bbeb-7f61c0b21931";
const FLOUCI_APP_SECRET = process.env.FLOUCI_APP_SECRET || "ee9d6f08-30c8-4dbb-8578-d51293ff2535";

export const initiatePayment = async (personalId: string, amount: number): Promise<string | null> => {
  try {
    const accept_url = `exp://192.168.11.80:8081/payment-success?personalId=${personalId}`;
    const cancel_url = `exp://192.168.11.80:8081/payment-cancel?personalId=${personalId}`;
    const decline_url = `exp://192.168.11.80:8081/payment-decline?personalId=${personalId}`;
    const developerTrackingId = uuidv4(); // Generate a unique tracking ID

    const response = await fetch('https://developers.flouci.com/api/generate_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLOUCI_APP_TOKEN}`,
      },
      body: JSON.stringify({
        app_token: FLOUCI_APP_TOKEN,
        app_secret: FLOUCI_APP_SECRET,
        amount: amount,
        accept_url: accept_url,
        cancel_url: cancel_url,
        decline_url: decline_url,
        failLink: cancel_url, // Assuming failLink is similar to cancel_url
        successLink: accept_url, // Assuming successLink is similar to accept_url
        acceptCard: true, // Assuming you want to accept card payments
        developerTrackingId: developerTrackingId // Use the generated UUID
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flouci API error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const paymentData = await response.json();
    if (paymentData?.result?.link) {
      return paymentData.result.link;
    } else {
      throw new Error('Payment URL not found in the response');
    }
  } catch (error) {
    console.error('Error initiating Flouci payment:', error);
    if (error instanceof Error) {
      Alert.alert('Payment Error', `Failed to initiate payment: ${error.message}`);
    } else {
      Alert.alert('Payment Error', 'An unknown error occurred while initiating payment.');
    }
    return null;
  }
};