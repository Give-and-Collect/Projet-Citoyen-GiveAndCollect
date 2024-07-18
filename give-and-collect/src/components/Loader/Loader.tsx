import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader: React.FC = () => {
    return (
        <div>
            <Box 
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
            >
                <h1>Chargement...</h1>
                <br />
                <CircularProgress color="primary" size={"8rem"} />
            </Box>
        </div>
    );
};

export default Loader;