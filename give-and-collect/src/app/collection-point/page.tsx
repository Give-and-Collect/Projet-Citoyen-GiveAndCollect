"use client";

import React, { useState } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, Card, Avatar, IconButton, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Sample data for collection points in Rouen
const pointsDeCollecte: { id: number; name: string; description: string; address: string; city: string; postalCode: string; position: [number, number] }[] = [
    { id: 1, name: 'Point de Collecte 1', description: 'Description du point de collecte 1', address: 'Adresse 1', city: 'Rouen', postalCode: '76000', position: [49.4428, 1.0999] },
    { id: 2, name: 'Point de Collecte 2', description: 'Description du point de collecte 2', address: 'Adresse 2', city: 'Rouen', postalCode: '76000', position: [49.4421, 1.0992] },
    { id: 3, name: 'Point de Collecte 3', description: 'Description du point de collecte 3', address: 'Adresse 3', city: 'Paris', postalCode: '75000', position: [48.8566, 2.3522] },
    { id: 4, name: 'Point de Collecte 4', description: 'Description du point de collecte 4', address: 'Adresse 4', city: 'Paris', postalCode: '75000', position: [48.8566, 2.3522] },
    { id: 5, name: 'Point de Collecte 5', description: 'Description du point de collecte 5', address: 'Adresse 5', city: 'Lyon', postalCode: '69000', position: [45.75, 4.85] },
];

const defaultCenter: [number, number] = [49.4431, 1.0993]; // Rouen coordinates

// Custom marker icon
const customMarkerIcon = L.icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/marker.png',
    iconSize: [20, 20],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});


const CollectionPoint: React.FC = () => {
    const [currentPosition, setCurrentPosition] = useState<[number, number]>(defaultCenter);
    const [selectedCity, setSelectedCity] = useState<string>('Toutes');

    const handleMarkerClick = (position: [number, number]) => {
        setCurrentPosition(position);
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank');
    };

    const handleListClick = (position: [number, number]) => {
        setCurrentPosition(position);
    };

    const handleCityChange = (event: SelectChangeEvent<string>) => {
        setSelectedCity(event.target.value);
    };

    const filteredPoints = selectedCity === 'Toutes' ? pointsDeCollecte : pointsDeCollecte.filter(point => point.city === selectedCity);

    const cities = ['Toutes', ...Array.from(new Set(pointsDeCollecte.map(point => point.city)))];

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
            {/* City filter */}
            <Box sx={{ marginBottom: '20px' }}>
                <Select
                    value={selectedCity}
                    onChange={handleCityChange}
                    displayEmpty
                    fullWidth
                >
                    {cities.map((city, index) => (
                        <MenuItem key={index} value={city}>{city}</MenuItem>
                    ))}
                </Select>
            </Box>
            {/* Map and List */}
            <Box sx={{ display: 'flex', flex: 1 }}>
                {/* Left side: List of collection points */}
                <Box sx={{ flex: '0 0 30%', overflowY: 'auto', paddingRight: '20px' }}>
                    <Typography variant="h6" sx={{ marginBottom: '10px' }}>Liste des points de collecte</Typography>
                    <Card variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                        <List>
                            {filteredPoints.map((point) => (
                                <ListItem key={point.id} button onClick={() => handleListClick(point.position)}>
                                    <Avatar alt="Point de collecte" src="/assets/icones/ping-darkgreen.png" sx={{ bgcolor: 'transparent' }} />
                                    <ListItemText
                                        primary={point.name}
                                        secondary={`${point.description} - ${point.address}, ${point.postalCode} ${point.city}`}
                                    />
                                    <IconButton aria-label="go-to-map" onClick={() => handleMarkerClick(point.position)}>
                                        <LocationOnIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Box>
                {/* Right side: Map */}
                <Box sx={{ flex: '1 1 70%', position: 'relative', height: '100%' }}>
                    <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {filteredPoints.map((point) => (
                            <Marker
                                key={point.id}
                                position={point.position}
                                eventHandlers={{
                                    click: () => handleMarkerClick(point.position),
                                    mouseover: (e) => {
                                        e.target.openPopup();
                                    },
                                    mouseout: (e) => {
                                        e.target.closePopup();
                                    }
                                }}
                                icon={customMarkerIcon}
                            >
                                <Popup>
                                    <Typography variant="subtitle1">{point.name}</Typography>
                                    <Typography variant="body2">{point.address}, {point.postalCode} {point.city}</Typography>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </Box>
            </Box>
        </Container>
    );
};

export default CollectionPoint;
