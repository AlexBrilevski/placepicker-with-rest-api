import { useState, useEffect } from 'react';
import { sortPlacesByDistance } from '../loc.js';
import ErrorPage from './Error.jsx';
import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch('http://localhost:3000/places');
        const respData = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }

        navigator.geolocation.getCurrentPosition(position => {
          const sortedPlaces = sortPlacesByDistance(respData.places, position.coords.latitude, position.coords.longitude);
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({ message: error.message || 'Could not fetch places, please try again later' });
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <ErrorPage title={'An error occured!'} message={error.message} />
  }

  return (
    <Places
      title="Available Places"
      isLoading={isFetching}
      isLoadingText='Fetching places data...'
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
