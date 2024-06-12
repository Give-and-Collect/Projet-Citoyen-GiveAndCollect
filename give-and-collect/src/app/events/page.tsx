"use client";

import EventsCard from "@/components/Events/EventsCard";
import { Box, Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import Image from "next/image";
import * as React from "react";

export default function Events() {
    const [city, setCity] = React.useState('');
    const [events, setEvents] = React.useState([]);

    const cityHandleChange = async (event: SelectChangeEvent) => {
      setCity(event.target.value);
    };

    React.useEffect(() => {
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
  
      fetchEvents();
    }, [city]);

    return (
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
              <MenuItem value={"Rouen"}>Rouen</MenuItem>
              <MenuItem value={"PetitQ"}>Petit Q</MenuItem>
              <MenuItem value={'GrandQ'}>Grand Q</MenuItem>
              <MenuItem value={"Barentin"}>Barentin</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {events.map((event, index) => (
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
    );
  }