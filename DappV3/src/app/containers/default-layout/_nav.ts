import { INavData } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { url } from 'inspector';

export const navItems: INavData[] = [
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   iconComponent: { name: 'cil-speedometer' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },

  {
    name: 'Home',
    url: '/home',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },

  {
    title: true,
    name: 'Campaigns'
  },
  {
    name: 'All Campaigns',
    url: '/campaigns',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Start a Campaign',
    url: '/campaigns/start',
    iconComponent: { name: 'cil-drop' }
  },
  {
    title: true,
    name: 'Tokens'
  },
  {
    name: 'Token List',
    url: '/tokens',
    iconComponent: { name: 'cil-drop'}
  },
  {
    name: 'Token Minter',
    url: '/tokens/token-minter',
    iconComponent: { name: 'cil-drop'}
  },
  {
    name: 'Token Locker',
    url: '/tokens/token-lock',
    iconComponent: { name: 'cil-drop'},
    badge: {
      color: 'secondary',
      text: 'COMING SOON'
    }
  },
  {
    title: true,
    name: 'Others'
  },
  {
    name: 'Docs',
    // url: ''
    iconComponent: { name: 'cil-drop'},
    badge: {
      color: 'secondary',
      text: 'COMING SOON'
    }
    
  }
];
