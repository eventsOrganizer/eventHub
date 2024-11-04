import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        marginTop: -10, // Ajoutez cette ligne pour déplacer l'image vers le haut
      },
      infoContainer: {
        flex: 1,
      },
      name: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      serviceName: {
        fontSize: 14,
        color: '#444',
      },
      date: {
        fontSize: 14,
        color: '#666',
      },
      time: {
        fontSize: 14,
        color: '#666',
      },
      detailsButton: {
        color: '#007AFF',
        marginTop: 8,
      },
      paymentButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
      },
      paymentButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      deleteButton: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
      },
      deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
      },
      totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      advancePayment: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      fullPayment: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      modalButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      confirmButton: {
        marginRight: 10,
      },
      cancelButton: {
        marginLeft: 10,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
      },
      email: {
        fontSize: 14,
        color: '#666',
      },
      paymentCompletedText: {
        color: '#22C55E',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
      },
      paymentInfo: {
        // Ajoutez ici les propriétés de style nécessaires, par exemple :
        fontSize: 16,
        color: 'green',
      },
      serviceLabel: { fontWeight: 'bold' },
      serviceValue: { fontWeight: 'normal' },
      dateLabel: { fontWeight: 'bold' },
      dateValue: { fontWeight: 'normal' },
      timeLabel: { fontWeight: 'bold' },
      timeValue: { fontWeight: 'normal' },
    });
    