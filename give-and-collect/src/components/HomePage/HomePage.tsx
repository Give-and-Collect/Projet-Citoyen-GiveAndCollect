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
import Loader from "../Loader/Loader";
import { Event } from "@prisma/client";
import { useSession } from "next-auth/react";

const HomePage = () => {
    const [events, setEvents] = React.useState<Event[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const { data: session } = useSession();

    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('api/events');
                const data = await response.json();
                const sortedEvents = data.sort((a: Event, b: Event) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                setEvents(sortedEvents.slice(0, 3));
            } catch (error) {
                console.error('An error occurred while fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    let superLargeDesktopItems = 3;
    if (events.length < superLargeDesktopItems) {
        superLargeDesktopItems = events.length;
    }

    let desktopItems = 2;
    if (events.length < desktopItems) {
        desktopItems = events.length;
    }

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: superLargeDesktopItems,
        },
        desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: desktopItems,
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
                        Evènements à test
                    </Typography>
                    <Image src={'/assets/icones/calendar-darkgreen.png'} alt="Calendar" width={50} height={50} />
                </Box>

                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                    {events.length > 0 ? (
                        <>
                            <Carousel 
                                responsive={responsive} 
                                infinite={true} 
                                pauseOnHover={true}
                                autoPlay={true} 
                                autoPlaySpeed={5000}
                                arrows={false}
                                containerClass="carousel-container"
                                itemClass="carousel-item"
                            >
                                {events.map((event, index) => (
                                    <Box key={index} sx={{ width: '100%' }}>
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
                                            homePageHeight={true}
                                        />
                                    </Box>
                                ))}
                            </Carousel>
                        </>
                    ) : (
                        <Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', mt: 5 }}>
                            Aucun évènement trouvé
                        </Typography>
                    )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default HomePage;
