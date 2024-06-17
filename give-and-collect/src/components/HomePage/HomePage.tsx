
import Banner from "../Banner/Banner";
import { 
    Box, 
    Container
} from '@mui/material';

const HomePage = () => {
    return (
        <Box>
            <Banner 
                bannerSrc="/images/banner.png" 
                logoSrc="/images/logo.png" 
                bannerText="Donnons une nouvelle vie à nos vêtements. Partageons l’amour, réchauffons des vies !" 
            />
            <Container>

            </Container>
        </Box>
    );
};

export default HomePage;