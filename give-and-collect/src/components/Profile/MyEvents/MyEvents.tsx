"use client";

import EventsCard from "@/components/Events/EventsCard";
import { Box, Typography } from "@mui/material";
import { Event } from "@prisma/client";
import { useSession } from "next-auth/react";
import * as React from "react";

export default function MyEvents() {
    const [events, setEvents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const { data: session } = useSession();

    React.useEffect(() => {

      const fetchEvents = async () => {
        try {
          const url = 'api/events';
          const response = await fetch(url);
          const data = await response.json();
          setEvents(data);
        } catch (error) {
          console.error('An error occurred while fetching events:', error);
        } finally {
        }
      };

      fetchEvents();

      setIsLoading(false);
    }, []);

    let sortedEvents: Event[] = [];

    if (events.length > 0) {
        sortedEvents = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        sortedEvents = sortedEvents.filter((event) => event.organizerId === session?.user.id);
    } else {
      sortedEvents = [];
    }

    return (
      <>
        {sortedEvents.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>

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
            </Box>
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
              </Box>
            )}
          </>
        )}
      </>
    );
  }