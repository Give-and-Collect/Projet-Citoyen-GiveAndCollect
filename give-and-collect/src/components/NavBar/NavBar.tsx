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
import Image from 'next/image';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';

import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSession, signIn, signOut } from 'next-auth/react';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();

  const pathname = usePathname();

  const { data: session } = useSession();

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
    <AppBar position="sticky" sx={{ color: theme.palette.background.paper }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, mr: 1, my: 1 }}>
            <Image src={'/assets/images/logo2.png'} alt="logo" width={200} height={62} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', lg: 'none' } }}>
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
                display: { xs: 'block', lg: 'none' },
              }}
            >
              <MenuItem key={'Home'} onClick={handleCloseNavMenu}>
                <Link href={"/"}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={'/assets/icones/home-darkgreen.png'} alt="Home" width={25} height={25} />
                    <Typography textAlign="center">Accueil</Typography>
                  </div>
                </Link>
              </MenuItem>
              <MenuItem key={'CollectionPoint'} onClick={handleCloseNavMenu}>
                <Link href={"/collection-point"}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={'/assets/icones/ping-darkgreen.png'} alt="Ping" width={25} height={25} />
                    <Typography textAlign="center">Points de collecte</Typography>
                  </div>  
                </Link>
              </MenuItem>
              <MenuItem key={'Events'} onClick={handleCloseNavMenu}>
                <Link href={"/events"}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={'/assets/icones/calendar-darkgreen.png'} alt="Calendar" width={25} height={25} />
                    <Typography textAlign="center">Evènements</Typography>
                  </div>
                </Link>
              </MenuItem>
              <MenuItem key={'Posts'} onClick={handleCloseNavMenu}>
                <Link href={"/posts"}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={'/assets/icones/cloth-darkgreen.png'} alt="Cloth" width={25} height={25} />
                    <Typography textAlign="center">Annonces</Typography>
                  </div>
                </Link>
              </MenuItem>
              <MenuItem key={'About'} onClick={handleCloseNavMenu}>
                <Link href={"/about"}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={'/assets/icones/users-darkgreen.png'} alt="Users" width={25} height={25} />
                    <Typography textAlign="center">Qui sommes-nous ?</Typography>
                  </div>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', lg: 'none' }, my: 1 }}>
            <Image src={'/assets/images/logo2.png'} alt="logo" width={200} height={62} />
          </Box>
          
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', lg: 'flex' },
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}>
            <Button
              key={'Home'}
              onClick={handleCloseNavMenu}
              sx={{ 
                color: pathname === '/' ? theme.palette.secondary.main : theme.palette.background.paper, 
                display: 'block' 
              }}
              href={'/'}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image src={pathname === '/' ? '/assets/icones/home-lightgreen2.png' : '/assets/icones/home-beige.png'} alt="Home" width={25} height={25} />
                <span>Accueil</span>
              </div>
            </Button>
            <Button
              key={'CollectionPoint'}
              onClick={handleCloseNavMenu}
              sx={{ 
                color: pathname === '/collection-point' ? theme.palette.secondary.main : theme.palette.background.paper, 
                display: 'block' 
              }}
              href={'/collection-point'}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image src={pathname === '/collection-point' ? '/assets/icones/ping-lightgreen2.png' : '/assets/icones/ping-beige.png'} alt="Ping" width={25} height={25} />
                <span>Points de collecte</span>
              </div>
            </Button>
            <Button
              key={'Events'}
              onClick={handleCloseNavMenu}
              sx={{ 
                color: pathname === '/events' ? theme.palette.secondary.main : theme.palette.background.paper, 
                display: 'block' 
              }}
              href={'/events'}
            >
              <div style={{ display: 'flex', alignItems: 'center', color: 'primary' }}>
                <Image src={pathname === '/events' ? '/assets/icones/calendar-lightgreen2.png' : '/assets/icones/calendar-beige.png'} alt="Calendar" width={25} height={25} />
                <span>Evènements</span>
              </div>
            </Button>
            <Button
              key={'Posts'}
              onClick={handleCloseNavMenu}
              sx={{
                color: pathname === '/posts' ? theme.palette.secondary.main : theme.palette.background.paper, 
                display: 'block' 
              }}
              href={'/posts'}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image src={pathname === '/posts' ? '/assets/icones/cloth-lightgreen2.png' : '/assets/icones/cloth-beige.png'} alt="Cloth" width={25} height={25} />
                <span>Annonces</span>
              </div>
            </Button>
            <Button
              key={'About'}
              onClick={handleCloseNavMenu}
              sx={{
                color: pathname === '/about' ? theme.palette.secondary.main : theme.palette.background.paper, 
                display: 'block' 
              }}
              href={'/about'}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image src={pathname === '/about' ? '/assets/icones/users-lightgreen2.png' : '/assets/icones/users-beige.png'} alt="Users" width={25} height={25} />
                <span>Qui sommes-nous ?</span>
              </div>
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {(session && session.user && session.user.roleId === 1) && (
              <Typography textAlign="center">Administrateur</Typography>
            )}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Profile" src="/assets/icones/profile-beige.png" />
              </IconButton>
            </Tooltip>
          
            {session && session.user ? (
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
                  <Link href={"/profile"}>
                    <Typography textAlign="center" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Image src={'/assets/icones/profile-darkgreen.png'} alt="Profile" width={25} height={25} style={{ marginRight: '10px' }} />
                      {session.user.firstname} {session.user.lastname}
                    </Typography>
                  </Link>
                </MenuItem>

                {session.user.roleId === 1 && (
                  <div>
                    <MenuItem key={'UsersList'} onClick={handleCloseUserMenu}>
                      <Link href={"/admin/users-list"}>
                        <Typography textAlign="center" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Image src={'/assets/icones/users-darkgreen.png'} alt="Users" width={25} height={25} style={{ marginRight: '10px' }} />
                          <span>Liste des utilisateurs</span>
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem key={'Stats'} onClick={handleCloseUserMenu}>
                      <Link href={"/admin/stats"}>
                        <Typography textAlign="center" sx={{ display: 'flex', alignItems: 'center' }}>
                          <AnalyticsIcon sx={{ marginRight: '10px' }} />
                          <span>Statistiques</span>
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem key={'CollectionPoint'} onClick={handleCloseUserMenu}>
                      <Link href={"/admin/collection-point"}>
                        <Typography textAlign="center" sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon  sx={{ marginRight: '10px' }} />
                          <span>Points de collecte</span>
                        </Typography>
                      </Link>
                    </MenuItem>
                  </div>
                )}

                <MenuItem key={'Logout'} onClick={handleCloseUserMenu}>
                  <a onClick={() => signOut()}>
                    <Typography textAlign="center" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LogoutIcon sx={{ marginRight: '10px' }} />
                      <span>Se déconnecter</span>
                    </Typography>
                  </a>
                </MenuItem>
              </Menu>
            ) : (
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
                <MenuItem key={'Login'} onClick={handleCloseUserMenu}>
                  <a onClick={() => signIn()}><Typography textAlign="center">Se connecter</Typography></a>
                </MenuItem>
                <MenuItem key={'Signup'} onClick={handleCloseUserMenu}>
                  <a href='/signup'><Typography textAlign="center">S&apos;inscrire</Typography></a>
                </MenuItem>
              </Menu>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
