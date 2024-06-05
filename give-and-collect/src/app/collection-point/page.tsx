"use client";

import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Card,
    Avatar,
    IconButton,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface CollectionPoint {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
}

const customMarkerIcon = L.icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/marker.png',
    iconSize: [20, 20],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const defaultCenter: [number, number] = [49.4431, 1.0993]; // Rouen coordinates

const CollectionPointComponent: React.FC = () => {
    const [pointsDeCollecte, setPointsDeCollecte] = useState<CollectionPoint[]>([]);
    const [currentPosition, setCurrentPosition] = useState<[number, number]>(defaultCenter);
    const [selectedCity, setSelectedCity] = useState<string>('Toutes');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCollectionPoints = async () => {
            try {
                const response = await fetch('/api/collection-point');
                const data = await response.json();
                setPointsDeCollecte(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching collection points:', error);
                setLoading(false);
            }
        };

        fetchCollectionPoints();
    }, []);

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

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

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
                                <ListItem key={point.id} button onClick={() => handleListClick([point.latitude, point.longitude])}>
                                    <Avatar alt="Point de collecte" src="/assets/icones/ping-darkgreen.png" sx={{ bgcolor: 'transparent' }} />
                                    <ListItemText
                                        primary={point.name}
                                        secondary={`${point.description} - ${point.address}, ${point.postalCode} ${point.city}`}
                                    />
                                    <IconButton aria-label="go-to-map" onClick={() => handleMarkerClick([point.latitude, point.longitude])}>
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
                                position={[point.latitude, point.longitude]}
                                eventHandlers={{
                                    click: () => handleMarkerClick([point.latitude, point.longitude]),
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

export default CollectionPointComponent;
