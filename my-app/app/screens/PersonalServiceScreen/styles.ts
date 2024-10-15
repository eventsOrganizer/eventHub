import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 100,
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#4c669f',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    paddingHorizontal: 8,
    height: 40, // Reduced height
  },
  searchInput: {
    flex: 1,
    fontSize: 14, // Reduced font size
  },
  priceFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36, // Reduced height
    fontSize: 14, // Reduced font size
    marginRight: 4,
  },
  priceSeparator: {
    marginHorizontal: 4,
  },
  categoryListContainer: {
    height: 60, // Reduced height
    marginBottom: 8,
  },
  serviceList: {
    flex: 1,
  },
  serviceListContent: {
    paddingHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noServicesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  // Add the missing serviceItem style
  serviceItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Add other missing styles used in ServiceItem
  serviceImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 8,
  },
  serviceDetails: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
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
});