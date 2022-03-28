import { ReactNode } from 'react';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import BallotTwoToneIcon from '@mui/icons-material/BallotTwoTone';
import BeachAccessTwoToneIcon from '@mui/icons-material/BeachAccessTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import FilterVintageTwoToneIcon from '@mui/icons-material/FilterVintageTwoTone';
import HowToVoteTwoToneIcon from '@mui/icons-material/HowToVoteTwoTone';
import LocalPharmacyTwoToneIcon from '@mui/icons-material/LocalPharmacyTwoTone';
import RedeemTwoToneIcon from '@mui/icons-material/RedeemTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import TrafficTwoToneIcon from '@mui/icons-material/TrafficTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: '',
    items: [
      {
        name: 'Landing Page',
        link: '/overview',
        icon: DesignServicesTwoToneIcon
      }
    ]
  },
  {
    heading: 'Campaigns',
    items: [
      {
        name: 'All Campaigns',
        link: '/campaigns',
        icon: BrightnessLowTwoToneIcon
      },
      {
        name: 'Create Campaign',
        icon: MmsTwoToneIcon,
        link: '/campaigns/create'
      },
      {
        name: 'Create Fair Campaign',
        icon: TableChartTwoToneIcon,
        link: '/campaigns/start-fair'
      },
      {
        name: 'Create/Mint Token',
        icon: TableChartTwoToneIcon,
        link: '/components/createtoken'
      },
      {
        name: 'View My Campaigns',
        icon: HowToVoteTwoToneIcon,
        link: ''
      }
    ]
  },
  {
    heading: 'Zsale Lock',
    items: [
      {
        name: 'Create Lock',
        icon: LocalPharmacyTwoToneIcon,
        link: '/components/createlock'
      },
      {
        name: 'Token',
        icon: TrafficTwoToneIcon,
        link: '/components/createtoken/listtoken'     
      },
      {
        name: 'Liquidity',
        icon: VerifiedUserTwoToneIcon,
        link: ''
      },
      {
        name: 'KYC & Audit',
        icon: VerifiedUserTwoToneIcon,
        link: ''
      },
      {
        name: 'Docs',
        icon: EmojiEventsTwoToneIcon,
        link: ''
      }
    ]
  },
  {
    heading: 'Get in Touch',
    items: [
      {
        name: 'Contact Us',
        link: '/components/contact'
      }
    ]
  }
];

export default menuItems;
