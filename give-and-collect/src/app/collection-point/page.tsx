"use client";

import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import CollectionPointListMap from '../../components/CollectPoint/CollectionPointListMap';

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

const defaultCenter: [number, number] = [49.4431, 1.0993]; // Rouen coordinates

const CollectPointPage: React.FC = () => {
    const [pointsDeCollecte, setPointsDeCollecte] = useState<CollectionPoint[]>([]);
    const [currentPosition, setCurrentPosition] = useState<[number, number]>(defaultCenter);
    const [selectedCity, setSelectedCity] = useState<string>('Toutes');

    useEffect(() => {
        const fetchCollectionPoints = async () => {
            try {
                const response = await fetch('/api/collection-point');
                const data = await response.json();
                setPointsDeCollecte(data.data);
            } catch (error) {
                console.error('Error fetching collection points:', error);
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

    const cities = ['Toutes', ...Array.from(new Set(pointsDeCollecte.map(point => point.city)))];


    return (
        <CollectionPointListMap
            pointsDeCollecte={pointsDeCollecte}
            currentPosition={currentPosition}
            selectedCity={selectedCity}
            handleCityChange={handleCityChange}
            handleMarkerClick={handleMarkerClick}
            handleListClick={handleListClick}
            cities={cities}
        />
    );
};

export default CollectPointPage;
