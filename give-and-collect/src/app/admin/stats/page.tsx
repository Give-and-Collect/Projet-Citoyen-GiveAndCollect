"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import frLocale from 'date-fns/locale/fr';
import Loader from '@/components/Loader/Loader';
import { ArrowForward } from '@mui/icons-material';

interface Stats {
    announcements: number;
    events: number;
    users: number;
}

const StatisticsPage: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [announcementDate, setAnnouncementDate] = useState<Date | null>(new Date());
    const [eventDate, setEventDate] = useState<Date | null>(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const responses = await Promise.all([
                    announcementDate ? fetch(`/api/statistics/announcements?month=${announcementDate?.getMonth() + 1}&year=${announcementDate?.getFullYear()}`).then(res => res.json()) : { count: 0 },
                    eventDate ? fetch(`/api/statistics/events?month=${eventDate?.getMonth() + 1}&year=${eventDate?.getFullYear()}`).then(res => res.json()) : { count: 0 },
                    fetch('/api/statistics/users').then(res => res.json())
                ]);

                const [announcementsData, eventsData, usersData] = responses;
                setStats({
                    announcements: announcementsData.count,
                    events: eventsData.count,
                    users: usersData.count
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [announcementDate, eventDate]);

    const statsData = [
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
        <>
            {isLoading ? (
                <Loader />
            )
            : (
                <Box sx={{ padding: 2 }}>
                    <Typography
                        color="primary" 
                        textAlign="center" 
                        textTransform="uppercase" 
                        fontWeight={'bold'} 
                        fontSize={32}
                        mt={5}
                    >
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

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <a href="https://analytics.google.com/analytics/web/?pli=1&authuser=1#/p452115237/reports/intelligenthome?params=_u..nav%3Dmaui" target="_blank" rel="noreferrer">
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginRight: 2 }}
                                endIcon={<ArrowForward />}
                            >
                                Accéder à Google Analytics
                            </Button>
                        </a>
                    </Box>
                </Box>
            )}
            
        </>
    );
};

export default StatisticsPage;
