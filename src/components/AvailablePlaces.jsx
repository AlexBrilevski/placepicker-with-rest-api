import { useState, useEffect } from 'react';
import { fetchAvailablePlaces } from '../http.js';
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
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition(position => {
          const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
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
