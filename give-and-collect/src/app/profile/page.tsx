"use client";

import * as React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UserProfile from '@/components/Profile/UserProfile';
import Image from 'next/image';
import MyEvents from '@/components/Profile/MyEvents/MyEvents';
import MyPosts from "@/components/Profile/MyPosts/MyPosts";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSwipe = (deltaX: number) => {
    const newIndex = value + (deltaX > 0 ? -1 : 1);
    if (newIndex >= 0 && newIndex <= 2) {
      setValue(newIndex);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(-1),
    onSwipedRight: () => handleSwipe(1),
    trackMouse: true,
  });

  if (!isMounted) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }} {...swipeHandlers}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
            <Tab 
                icon={<Image src={'/assets/icones/profile-beige.png'} alt="Profile" width={30} height={30} />} 
                iconPosition="start" 
                label="Mon profil" 
                {...a11yProps(0)} 
            />
            <Tab 
                icon={<Image src={'/assets/icones/calendar-beige.png'} alt="Events" width={30} height={30} />} 
                iconPosition="start" 
                label="Mes évènements" 
                {...a11yProps(1)} 
            />
            <Tab 
                icon={<Image src={'/assets/icones/cloth-beige.png'} alt="Posts" width={30} height={30} />} 
                iconPosition="start" 
                label="Mes annonces" 
                {...a11yProps(2)} 
            />
        </Tabs>
      </AppBar>
      <div>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <UserProfile />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <MyEvents />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <MyPosts/>
        </TabPanel>
      </div>
    </Box>
  );
}
