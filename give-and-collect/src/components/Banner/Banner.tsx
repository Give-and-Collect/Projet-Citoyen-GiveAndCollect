import { Box, Typography } from '@mui/material';
import Image from 'next/image';

interface BannerProps {
    bannerSrc: string;
    logoSrc: string;
    bannerText: string;
}

const Banner: React.FC<BannerProps> = ({ bannerSrc, logoSrc, bannerText }) => {
    return (
        <Box 
            sx={{ 
                position: 'relative', 
                height: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            <Image 
                src={bannerSrc} 
                layout="fill" 
                objectFit="cover" 
                quality={100} 
                alt="Banner image"
            />
            <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                    color: 'background.paper', 
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    '@media (max-width: 800px)': {
                        fontSize: '1.2rem',
                    },
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    maxWidth: '80%',
                    zIndex: 1
                }}
            >
                {bannerText}
            </Typography>
            <Box 
                sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translate(-50%, 50%)',
                }}
            >
                <Image 
                    src={logoSrc} 
                    quality={100} 
                    alt="Logo"
                    width={200}
                    height={200}
                />
            </Box>
        </Box>
    );
};

export default Banner;
