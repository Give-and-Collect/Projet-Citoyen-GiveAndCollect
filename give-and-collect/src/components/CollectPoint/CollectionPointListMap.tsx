import React from 'react';
import {
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
    SelectChangeEvent,
    FormControl,
    InputLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useMediaQuery,
    Theme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

interface Props {
    pointsDeCollecte: CollectionPoint[];
    currentPosition: [number, number];
    selectedCity: string;
    handleCityChange: (event: SelectChangeEvent<string>) => void;
    handleMarkerClick: (position: [number, number]) => void;
    handleListClick: (position: [number, number]) => void;
    cities: string[];
}

const customMarkerIcon = L.icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/marker.png',
    iconSize: [25, 25],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const CollectionPointListMap: React.FC<Props> = React.memo(({
                                                                pointsDeCollecte = [],
                                                                currentPosition,
                                                                selectedCity,
                                                                handleCityChange,
                                                                handleMarkerClick,
                                                                handleListClick,
                                                                cities = []
                                                            }) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const filteredPoints = React.useMemo(() => {
        return selectedCity === 'Toutes' ? pointsDeCollecte : pointsDeCollecte.filter(point => point.city === selectedCity);
    }, [selectedCity, pointsDeCollecte]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            padding: '20px',
            backgroundColor: '#f5f5f5'
        }}>
            {/* City filter */}
            <Box sx={{ marginBottom: '20px' }}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Choisissez une ville</InputLabel>
                    <Select
                        value={selectedCity}
                        onChange={handleCityChange}
                        displayEmpty
                        label="Choisissez une ville"
                    >
                        {cities.map((city, index) => (
                            <MenuItem key={index} value={city}>{city}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {/* Accordion for small screens */}
            {isSmallScreen ? (
                <Box>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Liste des points de collecte</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List sx={{ maxHeight: '30vh', overflowY: 'auto' }}>
                                {filteredPoints.map((point: CollectionPoint) => (
                                    <Card key={point.id} sx={{ marginBottom: '10px', borderRadius: '8px', boxShadow: 3 }}>
                                        <ListItem button onClick={() => handleListClick([point.latitude, point.longitude])}>
                                            <Avatar alt="Point de collecte" src="/assets/icones/ping-darkgreen.png" sx={{ bgcolor: 'transparent' }} />
                                            <ListItemText
                                                primary={point.description}
                                                secondary={`${point.address}, ${point.postalCode} ${point.city}`}
                                            />
                                            <IconButton aria-label="go-to-map" onClick={() => handleMarkerClick([point.latitude, point.longitude])}>
                                                <LocationOnIcon />
                                                <Typography variant="body2" sx={{ marginLeft: '5px' }}>Itinéraire</Typography>
                                            </IconButton>
                                        </ListItem>
                                    </Card>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                    <Box sx={{ height: '50vh', marginTop: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: 3 }}>
                        <MapContainer center={currentPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {filteredPoints.map((point: CollectionPoint) => (
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
                                        <Typography variant="body1">{point.description}</Typography>
                                        <Typography variant="body2">{point.address}, {point.postalCode} {point.city}</Typography>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flex: 1 }}>
                    {/* Left side: List of collection points */}
                    <Box sx={{ flex: '0 0 30%', overflowY: 'auto', paddingRight: '20px' }}>
                        <Typography variant="h6" sx={{ marginBottom: '10px', color: '#333' }}>Liste des points de collecte</Typography>
                        <List sx={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
                            {filteredPoints.map((point: CollectionPoint) => (
                                <Card key={point.id} sx={{ marginBottom: '10px', borderRadius: '8px', boxShadow: 3 }}>
                                    <ListItem button onClick={() => handleListClick([point.latitude, point.longitude])}>
                                        <Avatar alt="Point de collecte" src="/assets/icones/ping-darkgreen.png" sx={{ bgcolor: 'transparent' }} />
                                        <ListItemText
                                            primary={point.description}
                                            secondary={`${point.address}, ${point.postalCode} ${point.city}`}
                                        />
                                        <IconButton aria-label="go-to-map" onClick={() => handleMarkerClick([point.latitude, point.longitude])}>
                                            <LocationOnIcon />
                                            <Typography variant="body2" sx={{ marginLeft: '5px' }}>Itinéraire</Typography>
                                        </IconButton>
                                    </ListItem>
                                </Card>
                            ))}
                        </List>
                    </Box>
                    {/* Right side: Map */}
                    <Box sx={{
                        flex: '1 1 70%',
                        position: 'relative',
                        height: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: 3
                    }}>
                        <MapContainer center={currentPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {filteredPoints.map((point: CollectionPoint) => (
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
                                        <Typography variant="body1">{point.description}</Typography>
                                        <Typography variant="body2">{point.address}, {point.postalCode} {point.city}</Typography>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </Box>
                </Box>
            )}
        </Box>
    );
});

export default CollectionPointListMap;
