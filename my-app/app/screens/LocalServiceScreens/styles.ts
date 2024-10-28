import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
    fontSize: 16,
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
    color: 'white',
    fontSize: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priceFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priceSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  localList: {
    flex: 1,
  },
  localListContent: {
    paddingBottom: 16,
  },
  nolocalsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  localItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  localImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  localInfo: {
    padding: 16,
  },
  localName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  localPrice: {
    fontSize: 16,
    color: 'green',
    marginBottom: 8,
  },
  localDetails: {
    fontSize: 14,
    marginBottom: 8,
  },
  localStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  localLikes: {
    fontSize: 14,
  },
  localReviews: {
    fontSize: 14,
  },
});