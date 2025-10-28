import { useState } from "react";


export const useReverseGeocode = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const getAddressFromCoords = async (lat: number, lng: number) => {
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch (`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            return data .display_name || "Address not found";
        } catch (err) {
            setError("Failed to fetch address");
            return "";
        } finally {
            setLoading(false);
        }
    };
    return { getAddressFromCoords, loading, error };

};