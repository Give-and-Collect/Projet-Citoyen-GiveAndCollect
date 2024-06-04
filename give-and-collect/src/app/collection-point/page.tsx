"use client";
import React, { useState } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, Card, Avatar, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Sample data for collection points in Rouen
const pointsDeCollecte: { id: number; name: string; position: [number, number] }[] = [
    { id: 1, name: 'Point de Collecte 1', position: [49.4428, 1.0999] },
    { id: 2, name: 'Point de Collecte 2', position: [49.4421, 1.0992] },
    { id: 3, name: 'Point de Collecte 3', position: [49.4423, 1.0995] },
];

const defaultCenter: [number, number] = [49.4431, 1.0993]; // Rouen coordinates

// Custom marker icon
const customMarker = new L.Icon({
    iconUrl: '/assets/icones/ping-darkgreen.png',
    iconSize: [20, 30],
    iconAnchor: [10, 30],
    popupAnchor: [0, -25],
    shadowSize: [30, 30],
});


const CollectionPoint: React.FC = () => {
    const [currentPosition, setCurrentPosition] = useState<[number, number]>(defaultCenter);

    const handleMarkerClick = (position: [number, number]) => {
        setCurrentPosition(position);
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank');
    };

    const handleListClick = (position: [number, number]) => {
        setCurrentPosition(position);
    };

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', height: '100vh' }}>
            {/* Left side: List of collection points */}
            <Box sx={{ flex: '0 0 auto', width: '30%', overflowY: 'auto', padding: '10px' }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>Liste des points de collecte</Typography>
                <Card variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <List>
                        {pointsDeCollecte.map((point) => (
                            <ListItem key={point.id} button onClick={() => handleListClick(point.position)}>
                                <Avatar alt="Point de collecte" src="/assets/icones/ping-darkgreen.png" sx={{ bgcolor: 'transparent' }} />
                                <ListItemText primary={point.name} />
                                <IconButton aria-label="go-to-map" onClick={() => handleMarkerClick(point.position)}>
                                    <LocationOnIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </Box>
            {/* Right side: Map */}
            <Box sx={{ flex: '1 1 auto', position: 'relative', height: '100%' }}>
                <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {pointsDeCollecte.map((point) => (
                        <Marker
                            key={point.id}
                            position={point.position}
                            eventHandlers={{
                                click: () => handleMarkerClick(point.position),
                            }}
                        >
                            <Popup>
                                <Typography variant="subtitle1">{point.name}</Typography>
                                <Typography variant="body2">Latitude: {point.position[0]}</Typography>
                                <Typography variant="body2">Longitude: {point.position[1]}</Typography>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Box>
        </Container>
    );
};

export default CollectionPoint;
