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
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import zIndex from "@mui/material/styles/zIndex";

const HomePage = () => {
    const [events, setEvents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('api/events');
                const data = await response.json();
                const sortedEvents = data.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                setEvents(sortedEvents.slice(0, 3));
            } catch (error) {
                console.error('An error occurred while fetching events:', error);
            }
        };

        fetchEvents();

        setIsLoading(false);
    }, []);

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 3,
        },
        desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: 2,
        },
        tablet: {
            breakpoint: { max: 768, min: 640 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: 1,
        },
    };

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
                        <Carousel 
                            responsive={responsive} 
                            infinite={true} 
                            autoPlay={true} 
                            autoPlaySpeed={5000}
                            arrows={false}
                            containerClass="carousel-container"
                            itemClass="carousel-item"
                        >
                            {events.map((event, index) => (
                                <Box key={index} sx={{ width: '100%' }}>
                                    <EventsCard
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
                                </Box>
                            ))}
                        </Carousel>
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
