import {
    SvgIcon, 
    SvgIconProps,
} from '@mui/material';
import TiktokLogo from '../../../../../public/images/Tiktok.svg';

const TiktokIcon = (props: SvgIconProps) => {
    return (
      <SvgIcon {...props}>
        <TiktokLogo />
      </SvgIcon>
    );
};

export default TiktokIcon;