import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Platform, ActivityIndicator } from 'react-native';
import { DangerReport } from '@/types/database';
import Colors from '@/constants/Colors';
import * as Location from 'expo-location';
import { Loader } from '@googlemaps/js-api-loader';
import MapView, { Marker } from 'react-native-maps';

interface MapScreenProps {
  dangerReports: DangerReport[];
}

export function MapScreen({ dangerReports }: MapScreenProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission de localisation refusée');
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation);
      } catch (err) {
        setErrorMsg("Impossible d'obtenir la localisation");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' && mapRef.current && !mapLoaded) {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setErrorMsg('Google Maps API key is missing');
        setIsLoading(false);
        return;
      }

      const loader = new Loader({
        apiKey,
        version: 'weekly',
      });

      loader
        .load()
        .then(() => {
          const defaultLocation = { lat: 48.8566, lng: 2.3522 };
          const mapLocation = location
            ? { lat: location.coords.latitude, lng: location.coords.longitude }
            : defaultLocation;

          const map = new google.maps.Map(mapRef.current!, {
            center: mapLocation,
            zoom: 13,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#f5f7f8' }],
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }],
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{ color: '#f0f0f0' }],
              },
            ],
            disableDefaultUI: true,
            zoomControl: true,
          });

          if (location) {
            new google.maps.Marker({
              position: mapLocation,
              map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8,
              },
              title: 'Votre position',
            });
          }

          dangerReports.forEach((report) => {
            const color =
              report.riskLevel === 'high'
                ? Colors.danger
                : report.riskLevel === 'medium'
                ? Colors.warning
                : Colors.low;

            new google.maps.Marker({
              position: {
                lat: report.position.latitude,
                lng: report.position.longitude,
              },
              map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8,
              },
            });
          });

          setMapLoaded(true);
        })
        .catch((error) => {
          setErrorMsg(`Failed to load Google Maps: ${error.message}`);
          setIsLoading(false);
        });
    }
  }, [location, dangerReports, mapLoaded]);

  if (Platform.OS === 'web') {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      );
    }

    if (errorMsg) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Text style={styles.errorDescription}>
            {errorMsg.includes('API key')
              ? 'Please configure your Google Maps API key in the environment variables'
              : 'Activez la localisation pour voir les alertes près de vous'}
          </Text>
        </View>
      );
    }

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
  }

  // 👉 Mobile (expo-go) fallback: react-native-maps
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location?.coords.latitude || 48.8566,
        longitude: location?.coords.longitude || 2.3522,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {location && (
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          pinColor="#4285F4"
          title="Vous êtes ici"
        />
      )}

      {dangerReports.map((report) => (
        <Marker
          key={report.id}
          coordinate={{
            latitude: report.position.latitude,
            longitude: report.position.longitude,
          }}
          pinColor={
            report.riskLevel === 'high'
              ? 'red'
              : report.riskLevel === 'medium'
              ? 'orange'
              : 'yellow'
          }
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAF6',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  mapText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  mapSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  marker: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.white,
  },
});
