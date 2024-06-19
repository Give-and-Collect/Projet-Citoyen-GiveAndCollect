"use client";

import * as React from "react";
import Banner from "../Banner/Banner";
import { 
    Box, 
    Container,
    Typography
} from '@mui/material';
import EventsCard from "../Events/EventsCard";
import Image from "next/image";

const HomePage = () => {
    const [events, setEvents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchEvents = async () => {
        try {
            const response = await fetch('api/events');
            const data = await response.json();
            if (data.length > 0) {
                const sortedEvents = data.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                setEvents(sortedEvents.slice(0, 3));
            } else {
                setEvents([]);
            }
            
        } catch (error) {
            console.error('An error occurred while fetching events:', error);
        }
        };

        fetchEvents();

        setIsLoading(false);
    }, []);

    return (
        <Box>
            <Banner 
                bannerSrc="/assets/images/banner.png" 
                logoSrc="/assets/images/logo1.png" 
                bannerText="Donnons une nouvelle vie à nos vêtements. Partageons l’amour, réchauffons des vies !" 
            />
            <Container>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 8 }}>
                    <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold', mr: 1 }}>
                        Evènements à venir
                    </Typography>
                    <Image src={'/assets/icones/calendar-darkgreen.png'} alt="Calendar" width={50} height={50} />
                </Box>
                
                {events.length > 0 ? (
                    <>
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
                ) : (
                    <>
                        <Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', mt: 5 }}>
                            {isLoading ? 'Chargement en cours...' : 'Aucun évènement trouvé'}
                        </Typography>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default HomePage;