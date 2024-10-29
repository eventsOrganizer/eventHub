import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { CardField } from '@stripe/stripe-react-native';
import useStripePayment from '../hooks/userStripePayment';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

type PaymentScreenRouteParams = {
    amount: number;
    localId: number;
    userId: number;
};

type PaymentScreenProps = {
    route: RouteProp<{ params: PaymentScreenRouteParams }, 'PaymentScreen'>;
};

export default function PaymentScreen({ route }: PaymentScreenProps) {
    const { amount, localId, userId } = route.params;

    const [cardDetails, setCardDetails] = useState<any>();
    const [billingDetails, setBillingDetails] = useState({
        email: 'test@example.com',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [cardholderName, setCardholderName] = useState('');

    const { initiatePayment, loading, paymentSuccess } = useStripePayment();

    const handlePayPress = async () => {
        if (!cardDetails?.complete) {
            setErrorMessage('Please complete card details.');
            return;
        }

        const paymentAmount = amount * 0.25;

        const order = {
            amount: paymentAmount,
            localId: 37,
            userId: 1,
        };

        try {
            await initiatePayment(cardDetails, billingDetails, order);
        } catch (error) {
            setErrorMessage('Payment failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name On Card:</Text>
            <TextInput
                style={styles.input}
                placeholder="Name On Card"
                value={cardholderName}
                onChangeText={setCardholderName}
            />
            <Text style={styles.label}>Card Number:</Text>
            <View style={styles.cardContainer}>
                <CardField
                    postalCodeEnabled={false}
                    placeholders={{
                        number: '0000 0000 0000 00',
                    }}
                    cardStyle={styles.cardStyle}
                    style={styles.cardField}
                    onCardChange={(details) => {
                        setCardDetails(details);
                    }}
                />
            </View>
            <TouchableOpacity 
                onPress={handlePayPress} 
                style={[styles.button, loading && styles.buttonDisabled]}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Pay Now'}</Text>
            </TouchableOpacity>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            {paymentSuccess && <Text style={styles.successText}>Payment Successful!</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 5,
        fontSize: 16,
        color: '#333',
    },
    cardContainer: {
        width: '95%',
        maxWidth: 400,
        height: 50,
        marginBottom: 20,
        borderRadius: 12,
        elevation: 5,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        overflow: 'hidden',
        padding: 10,
    },
    cardField: {
        width: '100%',
        height: '100%',
    },
    cardStyle: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    successText: {
        color: 'green',
        marginTop: 10,
    },
    button: {
        width: '95%',
        padding: 12,
        backgroundColor: '#28a745',
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        width: '95%',
        paddingHorizontal: 10,
    },
});