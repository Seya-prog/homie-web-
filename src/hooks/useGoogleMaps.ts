"use client";

import { useState, useEffect } from "react";

export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "";

function allLibrariesReady(): boolean {
  return !!(
    window.google?.maps?.Map &&
    window.google?.maps?.marker?.AdvancedMarkerElement &&
    window.google?.maps?.places?.PlaceAutocompleteElement
  );
}

export default function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Already fully loaded
    if (typeof window !== "undefined" && allLibrariesReady()) {
      setLoaded(true);
      return;
    }

    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      if (allLibrariesReady()) {
        setLoaded(true);
        return;
      }
      // Poll until all libraries are loaded (script may be mid-load)
      const interval = setInterval(() => {
        if (allLibrariesReady()) {
          clearInterval(interval);
          setLoaded(true);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    // Inject fresh script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker,places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Poll until all libraries are actually available
      const interval = setInterval(() => {
        if (allLibrariesReady()) {
          clearInterval(interval);
          setLoaded(true);
        }
      }, 100);
    };
    document.head.appendChild(script);
  }, []);

  return loaded;
}
