import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
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

  function formatPhoneNumber(phone: string): React.ReactNode {
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }

    return (
      <Box sx={{ maxWidth: 1000, width: 1000, ml: 5, mr: 5 }}>
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
              <Image src={'/assets/icones/ping-darkgreen.png'} alt="Home" width={50} height={50} />
              <a href={`https://www.google.com/maps/search/?api=1&query=${props.latitude},${props.longitude}`} target="_blank" rel="noopener noreferrer">
                <Typography>{props.address}, {props.postalCode} {props.city}</Typography>
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image src={'/assets/icones/calendar-darkgreen.png'} alt="Home" width={50} height={50} />
              <Typography>{props.startDate.toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })} - {props.endDate.toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</Typography>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image src={'/assets/icones/phone-darkgreen.png'} alt="Home" width={50} height={50} />
              <a href={"tel:" + props.phone}><Typography>{formatPhoneNumber(props.phone)}</Typography></a>
            </div>
          </CardContent>
        </Card>
      </Box>
    );
};

export default EventsCard;