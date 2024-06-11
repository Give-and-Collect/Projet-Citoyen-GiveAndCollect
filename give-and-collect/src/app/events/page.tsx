"use client";

import EventsCard from "@/components/Events/EventsCard";
import { Box, Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import Image from "next/image";
import * as React from "react";

export default function Events() {
    const [city, setCity] = React.useState('');

    const cityHandleChange = (event: SelectChangeEvent) => {
      setCity(event.target.value);
    };

    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: 120, maxWidth: 300, m: 5 }}>
          <FormControl fullWidth>
            <InputLabel id="city-select-label">Sélectionnez une ville :</InputLabel>
            <Select
              labelId="city-select-label"
              id="city-select"
              value={city}
              label="Sélectionnez une ville :"
              onChange={cityHandleChange}
              defaultValue=""
            >
              <MenuItem value={""}>Tous les évènements</MenuItem>
              <MenuItem value={"Rouen"}>Rouen</MenuItem>
              <MenuItem value={"PetitQ"}>Petit Q</MenuItem>
              <MenuItem value={'"GrandQ'}>Grand Q</MenuItem>
              <MenuItem value={"Barentin"}>Barentin</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {(city === 'Rouen' || city === '') && (
            <EventsCard
              title="Collecte de vêtements pour les enfants orphelins de Rouen"
              description="Collecte de vêtements pour les enfants orphelins de Rouen. Besoin de Vestes, pantalons, chaussures (Garçon / Fille / Unisexe)"
              address="13 Rue de l'Hôpital"
              city="Rouen"
              postalCode="76000"
              latitude={49.44452702868641}
              longitude={1.0969934925248455}
              startDate={new Date('2024-06-01 09:00:00')}
              endDate={new Date('2024-06-01 17:00:00')}
              phone="0235983154"
            />
          )}
          
          {(city === 'Barentin' || city === '') && (
            <EventsCard
              title="Collecte de vêtements à Barentin"
              description="Collecte de vêtements à Barentin. Besoin de Vestes, pantalons, chaussures (Homme / Femme / Unisexe / taille enfant à partir de 5 ans) "
              address="67 Rue de Verdun"
              city="Barentin"
              postalCode="76360"
              latitude={49.5338177210948}
              longitude={0.9616062065754171}
              startDate={new Date('2024-06-01 09:00:00')}
              endDate={new Date('2024-06-02 17:00:00')}
              phone="0235983154"
            />
          )}
        </Box>
      </>
    );
  }