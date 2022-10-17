import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import { AuctionDlgProvider } from '../contexts/AuctionDlgContext';
import { MintDlgProvider } from '../contexts/MintDlgContext';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '/', element: <MarketHome /> },
        {
          path: 'explorer',
          children: [
            { path: '', element: <Explorer /> },
            { path: 'collectible', element: <Collectible /> },
            { path: 'collectible/:collection', element: <Collectible /> },
            { path: 'collectible/detail/:args', element: <CollectibleDetail /> },
            { path: 'transaction', element: <Transaction /> },
            { path: 'transaction/:transaction', element: <Transaction /> },
            { path: 'transaction/detail/:address', element: <AddressDetail /> },
            { path: 'search', element: <Navigate to="/explorer/collectible" replace /> },
            { path: 'search/:key', element: <SearchResult /> }
          ]
        },
        {
          path: 'marketplace',
          children: [
            { path: '', element: <MarketExplorer /> },
            {
              path: 'detail/:args',
              element: (
                <AuctionDlgProvider>
                  <MarketCollectibleDetail />
                </AuctionDlgProvider>
              )
            },
            { path: 'search', element: <Navigate to="/marketplace" replace /> },
            { path: 'search/:key', element: <MarketExplorer /> }
          ]
        },
        {
          path: 'collections',
          children: [
            { path: '', element: <CollectionExplorer /> },
            { path: 'detail/:collection', element: <CollectionDetail /> },
            { path: 'create', element: <CreateCollection /> },
            { path: 'import', element: <ImportCollection /> },
            { path: 'edit', element: <EditCollection /> }
          ]
        },
        {
          path: 'create',
          element: (
            <MintDlgProvider>
              <CreateItem />
            </MintDlgProvider>
          )
        },
        { path: 'activity', element: <Activity /> },
        { path: 'features', element: <Features /> },
        { path: 'rewards', element: <Rewards /> },
        {
          path: 'profile',
          children: [
            { path: '', element: <MyProfile /> },
            { path: 'edit', element: <EditProfile /> },
            { path: 'myitem/:type', element: <MyProfile /> },
            { path: 'others/:address', element: <MyItems /> }
          ]
        }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

const MarketHome = Loadable(lazy(() => import('../pages/MarketHome')));
// Explorer
const Explorer = Loadable(lazy(() => import('../pages/explorer/Explorer')));
const Collectible = Loadable(lazy(() => import('../pages/explorer/Collectible')));
const CollectibleDetail = Loadable(lazy(() => import('../pages/explorer/CollectibleDetail')));
const Transaction = Loadable(lazy(() => import('../pages/explorer/Transaction')));
const AddressDetail = Loadable(lazy(() => import('../pages/explorer/AddressDetail')));
const SearchResult = Loadable(lazy(() => import('../pages/explorer/SearchResult')));
// Marketplace
const MarketExplorer = Loadable(lazy(() => import('../pages/marketplace/Explorer')));
const MarketCollectibleDetail = Loadable(lazy(() => import('../pages/marketplace/CollectibleDetail')));
// Create
const CreateItem = Loadable(lazy(() => import('../pages/marketplace/CreateItem')));
// Collection
const CollectionExplorer = Loadable(lazy(() => import('../pages/collection/Explorer')));
const CollectionDetail = Loadable(lazy(() => import('../pages/collection/CollectionDetail')));
const CreateCollection = Loadable(lazy(() => import('../pages/collection/CreateCollection')));
const ImportCollection = Loadable(lazy(() => import('../pages/collection/ImportCollection')));
const EditCollection = Loadable(lazy(() => import('../pages/collection/EditCollection')));
// Activity
const Activity = Loadable(lazy(() => import('../pages/activity/Explorer')));
// Features
const Features = Loadable(lazy(() => import('../pages/features/Features')));
// Rewards
const Rewards = Loadable(lazy(() => import('../pages/rewards/Rewards')));
// Profile
const MyProfile = Loadable(lazy(() => import('../pages/profile/MyProfile')));
const MyItems = Loadable(lazy(() => import('../pages/profile/MyItems')));
const EditProfile = Loadable(lazy(() => import('../pages/profile/EditProfile')));

const NotFound = Loadable(lazy(() => import('../pages/Page404')));
