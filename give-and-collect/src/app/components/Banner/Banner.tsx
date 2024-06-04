import { 
    Container, 
    Typography, 
    Box 
} from '@mui/material';
import Image from 'next/image';

const Banner = () => {
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
                    src="/images/banner.png" 
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
                        }
                    }}
                    textTransform={'uppercase'}
                    textAlign={'center'}
                    fontFamily={'"Roboto", "Helvetica", "Arial", sans-serif'}
                    maxWidth={'80%'}
                    zIndex={1}
                    
                >
                    Donnons une nouvelle vie à nos vêtements. Partageons l’amour, réchauffons des vies !
                </Typography>
                <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translate(-50%, 50%)',
                    }}>
                <Image 
                    src="/images/logo.png" 
                    quality={100} 
                    alt="Banner image"
                    width={200}
                    height={200}
                />
            </div>
            </Box>
    );
};

export default Banner;