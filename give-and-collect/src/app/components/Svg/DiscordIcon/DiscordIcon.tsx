import {
    SvgIcon, 
    SvgIconProps,
} from '@mui/material';
import DiscordLogo from '../../../../../public/images/Discord.svg';

const DiscordIcon = (props: SvgIconProps) => {
    return (
      <SvgIcon {...props}>
        <DiscordLogo />
      </SvgIcon>
    );
};

export default DiscordIcon;