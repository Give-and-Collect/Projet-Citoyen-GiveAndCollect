"use client";

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Image from 'next/image';

import { useTheme } from '@mui/material/styles';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Image src={'/assets/images/logo2.png'} alt="logo" width={200} height={200} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem key={'Home'} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Accueil</Typography>
              </MenuItem>
              <MenuItem key={'CollectionPoint'} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Points de collecte</Typography>
              </MenuItem>
              <MenuItem key={'Events'} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Evènements</Typography>
              </MenuItem>
              <MenuItem key={'Posts'} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Annonces</Typography>
              </MenuItem>
              <MenuItem key={'About'} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Qui sommes-nous ?</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <Image src={'/assets/images/logo2.png'} alt="logo" width={200} height={200} />
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              key={'Home'}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: theme.palette.primary.contrastText, display: 'block' }}
            >
              Accueil
            </Button>
            <Button
              key={'CollectionPoint'}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Points de collecte
            </Button>
            <Button
              key={'Events'}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Evènements
            </Button>
            <Button
              key={'Posts'}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Annonces
            </Button>
            <Button
              key={'About'}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Qui sommes-nous ?
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              
              <MenuItem key={'Profile'} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Mon profil</Typography>
              </MenuItem>
              <MenuItem key={'Settings'} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Réglages</Typography>
              </MenuItem>
              <MenuItem key={'Logout'} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Se déconnecter</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
