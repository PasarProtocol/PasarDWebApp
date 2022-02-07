import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
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
        { path: 'explorer', element: <Explorer /> },
        {
          path: 'explorer',
          children: [
            { path: 'collectible', element: <Collectible /> },
            { path: 'collectible/:collection', element: <Collectible /> },
            { path: 'collectible/detail/:collection', element: <CollectibleDetail /> },
            { path: 'transaction', element: <Transaction /> },
            { path: 'transaction/:transaction', element: <Transaction /> },
            { path: 'transaction/detail/:address', element: <AddressDetail /> },
            { path: 'search', element: <Navigate to="/explorer/collectible" replace /> },
            { path: 'search/:key', element: <SearchResult /> },
          ]
        },
        { path: 'marketplace', element: <MarketExplorer /> },
        {
          path: 'marketplace',
          children: [
            { path: 'detail/:collection', element: <MarketCollectibleDetail /> },
            { path: 'search', element: <Navigate to="/marketplace" replace /> },
            { path: 'search/:key', element: <MarketExplorer /> },
          ]
        },
        { path: 'create', element: <MintDlgProvider><CreateItem /></MintDlgProvider> },
        { path: 'profile', element: <Navigate to="/404" replace /> },
        {
          path: 'profile',
          children: [
            { path: 'myitem', element: <MyItems /> },
            { path: 'myitem/:type', element: <MyItems /> },
            { path: 'others/:address', element: <MyItems /> },
          ]
        },
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// Explorer
const Explorer = Loadable(lazy(() => import('../pages/Explorer')));
const Collectible = Loadable(lazy(() => import('../pages/explorer/Collectible')));
const SearchResult = Loadable(lazy(() => import('../pages/explorer/SearchResult')));
const CollectibleDetail = Loadable(lazy(() => import('../pages/explorer/CollectibleDetail')));
const MarketCollectibleDetail = Loadable(lazy(() => import('../pages/marketplace/CollectibleDetail')));
const Transaction = Loadable(lazy(() => import('../pages/explorer/Transaction')));
const AddressDetail = Loadable(lazy(() => import('../pages/explorer/AddressDetail')));
// Marketplace
const MarketHome = Loadable(lazy(() => import('../pages/MarketHome')));
const MarketExplorer = Loadable(lazy(() => import('../pages/marketplace/Explorer')));
const CreateItem = Loadable(lazy(() => import('../pages/marketplace/CreateItem')));
const MyItems = Loadable(lazy(() => import('../pages/marketplace/MyItems')));

const NotFound = Loadable(lazy(() => import('../pages/Page404')));