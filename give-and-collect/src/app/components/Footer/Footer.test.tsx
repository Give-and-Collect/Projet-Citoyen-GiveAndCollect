import { render, screen } from '@testing-library/react';
import Footer from './Footer'; 
import '@testing-library/jest-dom';

describe('Footer Component', () => {
  it('should render without crashing', () => {
    render(<Footer />);
  });

  it('should display all navigation links', () => {
    render(<Footer />);
    
    const navLinks = ['accueil', 'points de collecte', 'événements', 'annonces', 'qui-sommes-nous ?'];
    navLinks.forEach(linkText => {
      expect(screen.getByText(linkText)).toBeInTheDocument();
    });
  });

  it('should display all policy links', () => {
    render(<Footer />);
    
    const policyLinks = ["conditions générales d'utilisation", 'mentions légales'];
    policyLinks.forEach(linkText => {
      expect(screen.getByText(linkText)).toBeInTheDocument();
    });
  });

  it('should display all social media icons', () => {
    render(<Footer />);
    
    const socialLinks = [
      { alt: 'Instagram Icon', href: 'https://www.instagram.com' },
      { alt: 'Twitter Icon', href: 'https://www.twitter.com/x' },
      { alt: 'Tiktok Icon', href: 'https://www.tiktok.com' },
      { alt: 'YouTube Icon', href: 'https://www.youtube.com' },
      { alt: 'Discord Icon', href: 'https://discord.com' }
    ];
    
    socialLinks.forEach(({ alt, href }) => {
      const linkElement = screen.getByRole('link', { name: alt });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', href);
    });
  });

  it('should display the logo image', () => {
    render(<Footer />);
    
    const logoImage = screen.getByAltText('Give-and-collect logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/images/logo-horizontal.png');
  });

  it('should display two dividers', () => {
    render(<Footer />);
    
    const dividers = screen.getAllByRole('separator');
    expect(dividers.length).toBe(2);
  });
});
