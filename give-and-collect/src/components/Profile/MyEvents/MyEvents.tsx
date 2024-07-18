"use client";

import EventsCard from "@/components/Events/EventsCard";
import Loader from "@/components/Loader/Loader";
import { Box, Pagination, Typography } from "@mui/material";
import { Event } from "@prisma/client";
import { useSession } from "next-auth/react";
import * as React from "react";

export default function MyEvents() {
    const [events, setEvents] = React.useState<Event[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const [currentPage, setCurrentPage] = React.useState(1);
    const [eventsPerPage, setEventsPerPage] = React.useState(5);

    const { data: session } = useSession();

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value);
    };

    React.useEffect(() => {

      const fetchEvents = async () => {
        try {
          setIsLoading(true);
          const url = 'api/events';
          const response = await fetch(url);
          const data = await response.json();
          setEvents(data);
        } catch (error) {
          console.error('An error occurred while fetching events:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEvents();
    }, []);

    let currentEvents: Event[] = [];
    let sortedEvents: Event[] = [];

    if (events.length > 0) {
      currentEvents = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      currentEvents = currentEvents.filter((event) => event.organizerId === session?.user.id);
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
          <>
            {sortedEvents.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', mb: 3 }}>

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
                    session={session!}
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