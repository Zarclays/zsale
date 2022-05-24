import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject  } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Pages

const Overview = Loader(lazy(() => import('src/content/overview')));

// Dashboards

// Campaigns
const CreateCampaign = Loader(lazy(() => import('src/content/campaigns/create-campaign/index')));
const CampaignList = Loader(lazy(() => import('src/content/campaigns/campaign-list')));
const CampaignPage = Loader(lazy(() => import('src/content/campaigns/campaign-page')));

// Applications

const Messenger = Loader(lazy(() => import('src/content/applications/Messenger')));
const Transactions = Loader(lazy(() => import('src/content/applications/Transactions')));
const UserProfile = Loader(lazy(() => import('src/content/applications/Users/profile')));
const UserSettings = Loader(lazy(() => import('src/content/applications/Users/settings')));
 
// Components
const ListToken = Loader(lazy(() => import('src/content/pages/Components/CreateToken/ListToken')));
const CreateLock = Loader(lazy(() => import('src/content/pages/Components/CreateLock')));
const CreateToken = Loader(lazy(() => import('src/content/pages/Components/CreateToken')));
const Contact = Loader(lazy(() => import('src/content/pages/Components/Contact')));
// Status

const Status404 = Loader(lazy(() => import('src/content/pages/Status/Status404')));
const Status500 = Loader(lazy(() => import('src/content/pages/Status/Status500')));
const StatusComingSoon = Loader(lazy(() => import('src/content/pages/Status/ComingSoon')));
const StatusMaintenance = Loader(lazy(() => import('src/content/pages/Status/Maintenance')));


const routes: RouteObject [] = [
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Overview />
      },
      {
        path: 'overview',
        element: (
          <Navigate
            to="/"
            replace
          />
        )
      },
      {
        path: 'status',
        children: [
          {
            path: '/status',
            element: (
              <Navigate
                to="404"
                replace
              />
            )
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          },
        ]
      },
      {
        path: '*',
        element: <Status404 />
      },
    ]
  },
  {
    path: 'campaigns',
    element: (
      <SidebarLayout />
    ),
    children: [
      {
        path: '/campaigns',
        element: (
          <Navigate
            to="/campaigns/list/mtrt"
            replace
          />
        )
      },
      // {
      //   path: '/campaigns',
      //   element: (
      //     <Navigate
      //       to="/campaigns/list"
      //       replace
      //     />
      //   )
      // },
      {
        path: 'list/:chain',
        element: <CampaignList />
      },
      {
        path: 'create',
        element: <CreateCampaign />
      },
      {
        path: ':chain/:campaignId',
        element: <CampaignPage />
      }
    ]
  },
  {
    path: 'management',
    element: (
      <SidebarLayout />
    ),
    children: [
      {
        path: '/management',
        element: (
          <Navigate
            to="/management/transactions"
            replace
          />
        )
      },
      {
        path: 'transactions',
        element: <Transactions />
      },
      {
        path: 'profile',
        children: [
          {
            path: '/management/profile',
            element: (
              <Navigate
                to="details"
                replace
              />
            )
          },
          {
            path: 'details',
            element: <UserProfile />
          },
          {
            path: 'settings',
            element: <UserSettings />
          },
        ]
      }
    ]
  },
  {
    path: 'components',
    element: (
      <SidebarLayout />
    ),
    children: [
      {
        path: '/components',
        element: (
          <Navigate
            to="/components"
            replace
          />
        )
      },
      {
        path: 'createtoken',
        element: <CreateToken />
      },
      {
        path: 'createlock',
        element: <CreateLock />
      },
      {
        path: 'tokenlist',
        element: <ListToken />
      },
      {
        path: 'contact',
        element: <Contact />
      }
    ]
  }
];

export default routes;
