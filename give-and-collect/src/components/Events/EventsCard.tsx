import { Box, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Session } from 'next-auth';
import Image from 'next/image';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    id: number;
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
    organizerId: number;
    session: Session;
};

const EventsCard: React.FC<Props> = (props) => {
  function formatPhoneNumber(phone: string): React.ReactNode {
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    await fetch(`../api/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        organizerId: props.organizerId
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

    return (
      <Box sx={{ width: '100%', maxWidth: 1000, px: 2 }}>
        <Card 
          sx={{ 
            mt: 5,
            mb: 5,
            width: '100%',
            borderTopLeftRadius: 15, 
            borderTopRightRadius: 0, 
            borderBottomLeftRadius: 0, 
            borderBottomRightRadius: 15, 
            boxShadow: 10 
          }}
        >
          <CardHeader
            title={props.title}
            style={{ textAlign: 'center', textTransform: 'uppercase', color: "#F4EEE0", backgroundColor: "#111D13" }}
          />
          <CardContent>
            <Typography variant="body1" color="text.primary">
              {props.description}
            </Typography>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
              <Image src={'/assets/icones/ping-darkgreen.png'} alt="Home" width={50} height={50} />
              <a href={`https://www.google.com/maps/search/?api=1&query=${props.latitude},${props.longitude}`} target="_blank" rel="noopener noreferrer">
                <Typography>{props.address}, {props.postalCode} {props.city}</Typography>
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
              <Image src={'/assets/icones/calendar-darkgreen.png'} alt="Home" width={50} height={50} />
              <Typography>{props.startDate.toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' })} - {props.endDate.toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' })}</Typography>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
              <Image src={'/assets/icones/phone-darkgreen.png'} alt="Home" width={50} height={50} />
              <a href={"tel:" + props.phone}><Typography>{formatPhoneNumber(props.phone)}</Typography></a>
            </div>

            {props.session && (props.session.user.roleId === 1 || props.session.user.id === props.organizerId) && (
              <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(props.id)}
                  sx={{ mt: 2, mb: 2, ml: 2, alignSelf: 'flex-start' }}
              >
                  Supprimer
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    );
};

export default EventsCard;
