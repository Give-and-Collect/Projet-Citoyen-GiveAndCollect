"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import frLocale from 'date-fns/locale/fr';

interface Stats {
    shares: number;
    visits: number;
    searchPosition: number;
    announcements: number;
    events: number;
    users: number;
}

const StatisticsPage: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [announcementDate, setAnnouncementDate] = useState<Date | null>(new Date());
    const [eventDate, setEventDate] = useState<Date | null>(new Date());

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const responses = await Promise.all([
                    fetch('/api/statistics/shares').then(res => res.json()),
                    fetch('/api/statistics/visits').then(res => res.json()),
                    fetch('/api/statistics/search-position').then(res => res.json()),
                    announcementDate ? fetch(`/api/statistics/announcements?month=${announcementDate?.getMonth() + 1}&year=${announcementDate?.getFullYear()}`).then(res => res.json()) : { count: 0 },
                    eventDate ? fetch(`/api/statistics/events?month=${eventDate?.getMonth() + 1}&year=${eventDate?.getFullYear()}`).then(res => res.json()) : { count: 0 },
                    fetch('/api/statistics/users').then(res => res.json())
                ]);

                const [sharesData, visitsData, searchPositionData, announcementsData, eventsData, usersData] = await Promise.all(responses);
                setStats({
                    shares: sharesData.count,
                    visits: visitsData.count,
                    searchPosition: searchPositionData.position,
                    announcements: announcementsData.count,
                    events: eventsData.count,
                    users: usersData.count
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques', error);
            }
        };

        fetchStats();
    }, [announcementDate, eventDate]);

    const statsData = [
        { label: 'Nombre de partages', value: stats?.shares || 0, icon: <ShareIcon fontSize="large" />, color: 'primary' },
        { label: 'Nombre de visites', value: stats?.visits || 0, icon: <VisibilityIcon fontSize="large" />, color: 'secondary' },
        { label: 'Position dans les résultats de recherche', value: stats?.searchPosition || 0, icon: <SearchIcon fontSize="large" />, color: 'error' },
        { label: "Nombre d'annonces", value: stats?.announcements || 0, icon: <AnnouncementIcon fontSize="large" />, color: 'info', isSelectable: true },
        { label: "Nombre d'événements", value: stats?.events || 0, icon: <EventIcon fontSize="large" />, color: 'warning', isSelectable: true },
        { label: "Nombre d'utilisateurs", value: stats?.users || 0, icon: <PeopleIcon fontSize="large" />, color: 'success' }
    ];

    const handleAnnouncementDateChange = (date: Date | null) => {
        setAnnouncementDate(date);
    };

    const handleEventDateChange = (date: Date | null) => {
        setEventDate(date);
    };

    return (
        <Box sx={{ padding: 2, marginTop: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: 6 }}>
                Statistiques du site
            </Typography>
            <Box sx={{ marginTop: 2, marginBottom: 6 }}>
                <Grid container spacing={2}>
                {statsData.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: `${stat.color}.main`, borderWidth: 2, borderStyle: 'solid' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <Typography variant="h6">{stat.label}</Typography>
                                    <Box sx={{ color: `${stat.color}.main` }}>
                                        {stat.icon}
                                    </Box>
                                </Box>
                                <Typography variant="h4">{stat.value}</Typography>
                            </CardContent>
                            {stat.isSelectable && (
                                <CardContent sx={{ borderTop: `1px solid ${stat.color}.main`, paddingTop: 1 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                                        <DatePicker
                                            views={['year', 'month']}
                                            label="Mois et année"
                                            minDate={new Date('2022-01-01')}
                                            maxDate={new Date('2030-12-31')}
                                            value={stat.label === "Nombre d'annonces" ? announcementDate : eventDate}
                                            onChange={stat.label === "Nombre d'annonces" ? handleAnnouncementDateChange : handleEventDateChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {params?.InputProps?.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                        sx: {
                                                            '&.MuiInputBase-inputAdornedEnd': {
                                                                color: `${stat.color}.main`,
                                                            }
                                                        }
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: `${stat.color}.main`
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </CardContent>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
            </Box>
        </Box>
    );
};

export default StatisticsPage;
