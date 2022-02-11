import { ReactNode, useRef, useState } from 'react';

import { NavLink } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';

import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import { useAccount } from 'wagmi';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const TruncatedBox = styled(Box)(
  ({ theme }) => `
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width : 100px;
`
);



const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const AccountDescription = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

interface Props {
  
  showWalletOptions: boolean;
  setShowWalletOptions: (showWalletOptions: boolean) => void;
}

function ConnectWalletBox(props: Props) {
  const {  showWalletOptions, setShowWalletOptions } = props;
  
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const [{ data: accountData, loading }, disconnect] = useAccount({
    fetchEns: true,
  });

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleConnectWallet = (): void => {
    setShowWalletOptions(true);
  };

  const renderLabel = () => {
    if (accountData?.ens) {
      return (
        <>
          <div className="relative w-8 h-8 mr-2">
            {accountData.ens.avatar ? (
              <Avatar
                src={accountData?.ens.avatar}
                alt="ENS Avatar"
                
              />
            ) : (
              <Avatar
                src="/images/black-gradient.png"
                alt="ENS Avatar"
                // layout="fill"
                // objectFit="cover"
                // className="rounded-full"
              />
            )}
          </div>
          <span style={{}} className="truncate max-w-[100px]">
            {accountData.ens?.name}
          </span>
        </>
      );
    }

    return (
      
      <TruncatedBox>{accountData?.address}</TruncatedBox>
    );
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} >
        {!accountData &&
        <>
          <AccountDescription onClick={handleConnectWallet}>
            Connect Wallet
          </AccountDescription>
          
        </> 
        }

      {accountData &&
        <>
          
          <AccountDescription onClick={handleOpen}>
            {renderLabel()}
          </AccountDescription>
          {/* <AccountDescription >
            DisConnect Wallet
          </AccountDescription> */}
          <Hidden smDown>
            <ExpandMoreTwoToneIcon sx={{ ml: 1 }} onClick={handleOpen} />
          </Hidden>
        </> 
        }
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <AccountDescription >
          {renderLabel()}
          </AccountDescription>
        </MenuUserBox>
        
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={disconnect}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default ConnectWalletBox;
