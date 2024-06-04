import { 
  Box, 
  Divider, 
  Link,
} from '@mui/material';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import DiscordIcon from '../Svg/DiscordIcon/DiscordIcon';
import TiktokIcon from '../Svg/TiktokIcon/TiktokIcon';
import Image from 'next/image';


const Footer = () => {
  return (
    <Box
      component="footer"
      bgcolor= 'primary.main'
      color= 'background.paper'
      position={'absolute'}
      flexDirection={'column'}
      justifyContent={'space-evenly'}
      textAlign={'center'}
      alignItems={'center'}
      display={'flex'}
      bottom={'-200px'}
      width={'100%'}
      height={'450px'}
    > 
      
      <Image style={{maxHeight: '80px', objectFit: 'cover'}} width={200} height={80} alt="Give-and-collect logo" src='/images/logo-horizontal.png' />
      
      <Box width={'60vw'} 
           display={'flex'} 
           justifyContent={'space-around'}
           sx={{ margin: "0 auto",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              '@media (max-width: 800px)': {
                flexDirection: "column",
            }
           }}
      >
        <Link href="/" underline="hover" 
              color={'background.paper'}
              sx={{
                '@media (max-width: 800px)': {
                  marginTop: "1rem",
                }
              }}>{'accueil'}</Link>
        <Link href="/collect" underline="hover" 
              color={'background.paper'}
              sx={{
                '@media (max-width: 800px)': {
                  marginTop: "1rem",
                }
              }}>points de collecte</Link>
        <Link href="/events" underline="hover" 
              color={'background.paper'}
              sx={{
                '@media (max-width: 800px)': {
                  marginTop: "1rem",
                }
              }}>événements</Link>
        <Link href="/annonces" underline="hover" 
              color={'background.paper'}
              sx={{
                '@media (max-width: 800px)': {
                  marginTop: "1rem",
                }
              }}>annonces</Link>
        <Link href="/contact" underline="hover" 
              color={'background.paper'}
              sx={{
                '@media (max-width: 800px)': {
                  marginTop: "1rem",
                }
              }}>qui-sommes-nous ?</Link>
      </Box>
      <Divider variant="middle" sx={{ margin: "1rem auto 0 auto", width: "60vw", textAlign: "center", backgroundColor : "background.paper"}}/>
      <Box width={'60vw'} 
           display={'flex'} 
           justifyContent={'space-evenly'}
           sx={{ margin: "0 auto",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              '@media (max-width: 800px)': {
                  flexDirection: "column",
              }
           }}
      >
        <Link href="/terms-and-conditions" underline="hover" 
              color={'background.paper'}
              sx={{
                '@media (max-width: 800px)': {
                  marginTop: "1rem",
                }
              }}>conditions générales d&apos;utilisation</Link>
        <Link href="/legal-notice" underline="hover" 
              color={'background.paper'}
              sx={{
                '@media (max-width: 800px)': {
                  marginTop: "1rem",
                }
              }}>mentions légales</Link>
      </Box>
      <Divider variant="middle" sx={{ margin: "1rem auto 0 auto", width: "60vw", textAlign: "center", backgroundColor : "background.paper"}}/>
      <Box
        width={'60vw'}
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'space-around'}
        alignItems={'center'}
        sx={{ margin: "1rem auto"}}
      >
        <Link href="https://www.instagram.com" color={'background.paper'}><InstagramIcon style={{ fontSize: 24 }} /></Link>
        <Link href="https://www.twitter.com/x" color={'background.paper'}><XIcon style={{ fontSize: 24 }} /></Link>
        <Link href="https://www.tiktok.com" color={'background.paper'}><TiktokIcon style={{ fontSize: 24 }} /></Link>
        <Link href="https://www.youtube.com" color={'background.paper'}><YouTubeIcon style={{ fontSize: 24 }} /></Link>
        <Link href="https://discord.com" color={'background.paper'}><DiscordIcon style={{ fontSize: 24 }} /></Link>
      </Box>
    </Box>
  );
};

export default Footer;