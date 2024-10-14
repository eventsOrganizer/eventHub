import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      searchBar: {
        backgroundColor: '#fff',
        borderRadius: 20,
        margin: 10,
        paddingHorizontal: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      searchInput: {
        paddingVertical: 10,
        color: 'black',
      },
      priceFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 10,
      },
      priceInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      priceSeparator: {
        marginHorizontal: 10,
      },
      serviceList: {
        flex: 1,
      },
      serviceListContent: {
        padding: 10,
      },
      serviceItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      serviceImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
      },
      serviceInfo: {
        padding: 15,
      },
      serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      servicePrice: {
        fontSize: 16,
        color: '#4CAF50',
        marginBottom: 5,
      },
      serviceDetails: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 10,
      },
      serviceStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      serviceLikes: {
        fontSize: 14,
        color: '#E91E63',
      },
      serviceReviews: {
        fontSize: 14,
        color: '#FFC107',
      },
      centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
      },
      retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
      },
      retryButtonText: {
        color: 'white',
        fontSize: 16,
      },
      noServicesText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#757575',
      },
    
    });