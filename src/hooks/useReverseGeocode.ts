import { useState, useCallback } from 'react';

interface ReverseGeocodeResult {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
    country_code?: string;
  };
}

export const useReverseGeocode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAddressFromCoords = useCallback(async (lat: number, lon: number): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const API_KEY = 'pk.65958886264c7a690901d6e835474761';
      const url = `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your LocationIQ API key.');
        }
        if (response.status === 403) {
          throw new Error('API key unauthorized. Please check your LocationIQ account.');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ReverseGeocodeResult = await response.json();
      

      return data.display_name || 'Address not found';
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get address from coordinates';
      setError(errorMessage);
      console.error('Reverse geocoding error:', err);
      return 'Address not found';
    } finally {
      setIsLoading(false);
    }
  }, []);


  const getDetailedAddressFromCoords = useCallback(async (lat: number, lon: number): Promise<ReverseGeocodeResult['address'] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const API_KEY = 'pk.65958886264c7a690901d6e835474761';
      const url = `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ReverseGeocodeResult = await response.json();
      return data.address;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get detailed address';
      setError(errorMessage);
      console.error('Detailed reverse geocoding error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    getAddressFromCoords,
    getDetailedAddressFromCoords,
    isLoading,
    error,
    clearError,
  };
};

export default useReverseGeocode;