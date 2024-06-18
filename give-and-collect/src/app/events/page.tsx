"use client";

import EventsCard from "@/components/Events/EventsCard";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import * as React from "react";

export default function Events() {
    const [city, setCity] = React.useState('');
    const [cityList, setCityList] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const cityHandleChange = async (event: SelectChangeEvent) => {
      setCity(event.target.value);
    };

    React.useEffect(() => {

      const fetchCities = async () => {
        try {
          const response = await fetch('api/events');
          const data = await response.json();
          const cities = data.map(event => event.city);
          const uniqueCities = [...new Set(cities)];
          setCityList(uniqueCities);
        } catch (error) {
          console.error('An error occurred while fetching cities:', error);
        } finally {
        }
      };

      const fetchEvents = async () => {
        try {
          const url = city ? `api/events/${city}` : 'api/events';
          const response = await fetch(url);
          const data = await response.json();
          setEvents(data);
        } catch (error) {
          console.error('An error occurred while fetching events:', error);
        } finally {
        }
      };
  
      fetchCities();
      fetchEvents();

      setIsLoading(false);
    }, [city]);

    const sortedEvents = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return (
      <>
        {events.length > 0 ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: 120, maxWidth: 300, m: 5 }}>
              <FormControl fullWidth>
                <InputLabel id="city-select-label">Sélectionnez une ville :</InputLabel>
                <Select
                  labelId="city-select-label"
                  id="city-select"
                  value={city}
                  label="Sélectionnez une ville :"
                  onChange={cityHandleChange}
                  defaultValue=""
                >
                  <MenuItem value={""}>Tous les évènements</MenuItem>
                  
                  {cityList.map((city, index) => (
                    <MenuItem key={index} value={city}>{city}</MenuItem>
                  ))}

                </Select>
              </FormControl>
            </Box>

            <Typography variant="body1" color="text.primary" sx={{ textAlign: 'left', ml: 5, mb: 1 }}>
              {events.length} résultat(s)
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>

              {sortedEvents.map((event, index) => (
                <EventsCard
                  key={index}
                  title={event.title}
                  description={event.description}
                  address={event.address}
                  city={event.city}
                  postalCode={event.postalCode}
                  latitude={event.latitude}
                  longitude={event.longitude}
                  startDate={new Date(event.startDate)}
                  endDate={new Date(event.endDate)}
                  phone={event.phone}
                />
              ))}
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', mt: 5 }}>
              {isLoading ? 'Chargement en cours...' : 'Aucun évènement trouvé'}
            </Typography>
          </>
        )}
      </>
    );
  }