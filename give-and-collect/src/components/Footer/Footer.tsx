import { 
  Box, 
  Divider, 
  Link,
} from '@mui/material';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Image from 'next/image';

interface LinkProps {
  href: string;
  text: string;
}

interface SocialLinkProps {
  href: string;
  icon: React.ElementType;
}

const links: LinkProps[] = [
  { href: "/", text: "accueil" },
  { href: "/collection-point", text: "points de collecte" },
  { href: "/events", text: "événements" },
  { href: "/posts", text: "annonces" },
  { href: "/about", text: "qui-sommes-nous ?" },
];

const policyLinks: LinkProps[] = [
  { href: "/general-terms", text: "conditions générales d'utilisation" },
  { href: "/legal-notice", text: "mentions légales" },
];

const socialLinks: SocialLinkProps[] = [
  { href: "https://www.instagram.com", icon: InstagramIcon },
  { href: "https://www.twitter.com/x", icon: XIcon },
  { href: "https://www.youtube.com", icon: YouTubeIcon },
];

const FooterLink: React.FC<LinkProps> = ({ href, text }) => (
  <Link 
    href={href} 
    underline="hover" 
    color={'background.paper'}
    sx={{ 
      '@media (max-width: 800px)': {
        marginTop: "1rem",
      }
    }}
  >
    {text}
  </Link>
);

const CustomDivider: React.FC = () => (
  <Divider 
    variant="middle" 
    sx={{ 
      margin: "1rem auto 0 auto", 
      width: "60vw", 
      textAlign: "center", 
      backgroundColor: "background.paper"
    }} 
  />
);

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      bgcolor='primary.main'
      color='background.paper'
      flexDirection='column'
      justifyContent='space-evenly'
      textAlign='center'
      alignItems='center'
      display='flex'
      width='100%'
      height='450px'
    > 
      <Image 
        style={{ maxHeight: '80px', objectFit: 'cover' }} 
        width={200} 
        height={80} 
        alt="Give-and-collect logo" 
        src='/assets/images/logo2.png' 
      />
      
      <Box 
        width='60vw' 
        display='flex' 
        justifyContent='space-around'
        sx={{ 
          margin: "0 auto",
          textTransform: "uppercase",
          fontSize: "0.8rem",
          '@media (max-width: 800px)': {
            flexDirection: "column",
          }
        }}
      >
        {links.map((link, index) => (
          <FooterLink key={index} href={link.href} text={link.text} />
        ))}
      </Box>

      <CustomDivider />

      <Box 
        width='60vw' 
        display='flex' 
        justifyContent='space-evenly'
        sx={{ 
          margin: "0 auto",
          textTransform: "uppercase",
          fontSize: "0.8rem",
          '@media (max-width: 800px)': {
            flexDirection: "column",
          }
        }}
      >
        {policyLinks.map((link, index) => (
          <FooterLink key={index} href={link.href} text={link.text} />
        ))}
      </Box>

      <CustomDivider />

      <Box
        width='60vw'
        display='flex'
        flexDirection='row'
        justifyContent='space-around'
        alignItems='center'
        sx={{ margin: "1rem auto" }}
      >
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          return (
            <Link key={index} href={social.href} color='background.paper'>
              <Icon style={{ fontSize: 24 }} />
            </Link>
          );
        })}
      </Box>
    </Box>
  );
};

export default Footer;
