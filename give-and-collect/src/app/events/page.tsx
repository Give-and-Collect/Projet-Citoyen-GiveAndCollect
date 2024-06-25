"use client";

import EventsCard from "@/components/Events/EventsCard";
import EventsModalForm from "@/components/Events/EventsModalForm";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { Event } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import * as React from "react";

export default function Events() {
    const [city, setCity] = React.useState('');
    const [cityList, setCityList] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    const { data: session } = useSession();

    const openModal = () => {
      if (!session) {
        signIn();
        return;
      }
      setModalIsOpen(true);
    }
    const closeModal = () => {
      setModalIsOpen(false);
    }
    const eventCreated = () => {
      closeModal();
      window.location.reload();
    }

    const cityHandleChange = async (event: SelectChangeEvent) => {
      setCity(event.target.value);
    };

    React.useEffect(() => {

      const fetchCities = async () => {
        try {
          const response = await fetch('api/events');
          const data = await response.json();
          if (data.length > 0) {
            const cities = data.map(event => event.city);
            const uniqueCities = [...new Set(cities)];
            setCityList(uniqueCities);
          } else {
            setCityList([]);
          }
        } catch (error) {
          console.error('An error occurred while fetching cities:', error);
        } finally {
        }
      };

      const fetchEvents = async () => {
        try {
          const url = city ? `api/events/city/${city}` : 'api/events';
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

    let sortedEvents: Event[] = [];

    if (events.length > 0) {
      sortedEvents = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else {
      sortedEvents = [];
    }

    return (
      <>
        {events.length > 0 ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: 120, maxWidth: 400, m: 5 }}>
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

              <Button
                variant="contained"
                color="secondary"
                onClick={() => openModal()}
                sx={{ ml: 2 }}
              >
                Créer un évènement
              </Button>
            </Box>

            <EventsModalForm
                isOpen={modalIsOpen}
                onClose={closeModal}
                onEventCreated={eventCreated}
                session={session}
            />

            <Typography variant="body1" color="text.primary" sx={{ textAlign: 'left', ml: 5, mb: 1 }}>
              {events.length} résultat(s)
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>

              {sortedEvents.map((event, index) => (
                <>
                <EventsCard
                  key={index}
                  id={event.id}
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
                  organizerId={event.organizerId}
                  session={session}
                />
                </>
              ))}
            </Box>
          </>
        ) : (
          <>
            {isLoading ? (
              <Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', mt: 5 }}>
                Chargement en cours...
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', maxWidth: 400, width: '100%', height: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', mt: 5, mb: 5 }}>
                    Aucun évènement trouvé
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => openModal()}
                >
                    Créer un évènement
                </Button>

                <EventsModalForm
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                    onEventCreated={eventCreated}
                    session={session}
                />
              </Box>
            )}
          </>
        )}
      </>
    );
  }