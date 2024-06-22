"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const StatisticsPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const responses = await Promise.all([
                    fetch('/api/statistics/shares'),
                    fetch('/api/statistics/visits'),
                    fetch('/api/statistics/search-position'),
                    fetch('/api/statistics/announcements?month=6&year=2024'),
                    fetch('/api/statistics/events?month=6&year=2024'),
                    fetch('/api/statistics/users')
                ]);

                const data = await Promise.all(responses.map(res => res.json()));
                setStats({
                    shares: data[0].count,
                    visits: data[1].count,
                    searchPosition: data[2].position,
                    announcements: data[3].count,
                    events: data[4].count,
                    users: data[5].count
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h4" gutterBottom>
                Statistiques du site
            </Typography>
            <Typography variant="body1">Nombre de partages: {stats.shares}</Typography>
            <Typography variant="body1">Nombre de visites: {stats.visits}</Typography>
            <Typography variant="body1">Position dans les résultats de recherche: {stats.searchPosition}</Typography>
            <Typography variant="body1">Nombre d'annonces (Juin 2024): {stats.announcements}</Typography>
            <Typography variant="body1">Nombre d'événements (Juin 2024): {stats.events}</Typography>
            <Typography variant="body1">Nombre d'utilisateurs: {stats.users}</Typography>
        </Box>
    );
};

export default StatisticsPage;
