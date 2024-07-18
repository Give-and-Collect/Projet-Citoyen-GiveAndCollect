"use client";

import EventsCard from "@/components/Events/EventsCard";
import EventsModalForm from "@/components/Events/EventsModalForm";
import Loader from "@/components/Loader/Loader";
import { Add } from "@mui/icons-material";
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Typography } from "@mui/material";
import { Event } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import * as React from "react";

export default function Events() {
    const [city, setCity] = React.useState('');
    const [cityList, setCityList] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    const [currentPage, setCurrentPage] = React.useState(1);
    const [eventsPerPage, setEventsPerPage] = React.useState(5);

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

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value);
    };

    React.useEffect(() => {

      const fetchCities = async () => {
        try {
          setIsLoading(true);
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
          setIsLoading(false);
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
    }, [city]);

    let currentEvents: Event[] = [];
    let sortedEvents: Event[] = [];

    if (events.length > 0) {
      currentEvents = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      const indexOfLastPost = currentPage * eventsPerPage;
      const indexOfFirstPost = indexOfLastPost - eventsPerPage;
      sortedEvents = currentEvents.slice(indexOfFirstPost, indexOfLastPost);
    } else {
      sortedEvents = [];
    }

    return (
      <>
      {isLoading ? (
          <Loader />
      ) : (
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography
              color="primary" 
              textAlign="center" 
              textTransform="uppercase" 
              fontWeight={'bold'} 
              fontSize={32}
              mt={5}
              mb={3}
            >
              Listes des Evènements
            </Typography>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => openModal()}
                startIcon={<Add />}
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

            {sortedEvents.length > 0 ? (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5, mb: 5 }}>
                  <FormControl fullWidth variant="outlined">
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
                  {sortedEvents.length} résultat(s)
                </Typography>

                <Box sx={{ maxWidth: 1000, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                  {sortedEvents.map((event, index) => (
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
                  ))}
                  {/* Pagination */}
                  <Pagination
                      count={Math.ceil(currentEvents.length / eventsPerPage)}
                      page={currentPage}
                      onChange={handlePageChange}
                      sx={{ mt: 5 }}
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', maxWidth: 400, width: '100%', height: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', mt: 5, mb: 5 }}>
                    Aucun évènement trouvé
                </Typography>
              </Box>
            )}
          </Container>
        )}
      </>
    );
  }