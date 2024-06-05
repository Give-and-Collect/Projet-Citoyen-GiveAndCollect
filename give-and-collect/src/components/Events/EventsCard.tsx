import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type Props = {
    title: string;
    description: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    startDate: Date;
    endDate: Date;
    phone: string;
};

const EventsCard: React.FC<Props> = (props) => {

    return (
        <Card 
          sx={{ 
            mt: 5,
            mb: 5,
            maxWidth: 1000,
            borderTopLeftRadius: 15, 
            borderTopRightRadius: 0, 
            borderBottomLeftRadius: 0, 
            borderBottomRightRadius: 15, 
            boxShadow: 10 
          }}>
          <CardHeader
            title={props.title}
            style={{ textAlign: 'center', textTransform: 'uppercase', color: "#F4EEE0", backgroundColor: "#111D13",  }}
          />
          <CardContent>
          <Typography variant="body1" color="text.primary">
            {props.description}
          </Typography>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src={'/assets/icones/ping-darkgreen.png'} alt="Home" width={60} height={60} />
            <Typography>{props.address}, {props.postalCode} {props.city}</Typography>
          </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src={'/assets/icones/calendar-darkgreen.png'} alt="Home" width={60} height={60} />
            <Typography>{props.startDate.toDateString()} - {props.endDate.toDateString()}</Typography>
        </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src={'/assets/icones/phone-darkgreen.png'} alt="Home" width={60} height={60} />
            <a href={"tel:" + props.phone}><Typography>{props.phone}</Typography></a>
          </div>
          </CardContent>
        </Card>
    );
};

export default EventsCard;