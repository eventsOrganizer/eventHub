import * as Location from 'expo-location';

export const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
  try {
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return 'Coordonnées invalides';
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'YourApp/1.0',
          'Accept-Language': 'fr'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.display_name || 'Adresse non trouvée';
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'adresse:', error);
    return 'Erreur lors de la récupération de l\'adresse';
  }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission refusée');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    
    return location.coords;
  } catch (error) {
    console.error('Erreur de géolocalisation:', error);
    return null;
  }
};