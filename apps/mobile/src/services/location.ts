import * as Location from 'expo-location';

interface LocationResult {
  latitude: number;
  longitude: number;
  country: string | null;
  city?: string;
  state?: string;
}

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function getCurrentLocation(): Promise<LocationResult | null> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const { latitude, longitude } = location.coords;

    let country: string | null = null;
    let city: string | undefined;
    let state: string | undefined;

    try {
      const [geocode] = await Location.reverseGeocodeAsync({ latitude, longitude });
      country = geocode?.isoCountryCode?.toUpperCase() || null;
      city = geocode?.city || undefined;
      state = geocode?.region || undefined;
    } catch {
      // Geocoding may fail, location still works
    }

    return { latitude, longitude, country, city, state };
  } catch {
    return null;
  }
}
