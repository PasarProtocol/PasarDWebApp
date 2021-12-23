import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';

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
        { path: '/', element: <Navigate to="/explorer" /> },
        {
          path: 'explorer',
          children: [
            { element: <Explorer /> },
            { path: 'collectible', element: <Collectible /> },
            { path: 'collectible/:collection', element: <CollectibleDetail /> },
            { path: 'transaction', element: <Transaction /> },
            { path: 'transaction/:transaction', element: <AddressDetail /> },
          ]
        }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

const Explorer = Loadable(lazy(() => import('../pages/Explorer')));
const Collectible = Loadable(lazy(() => import('../pages/explorer/Collectible')));
const CollectibleDetail = Loadable(lazy(() => import('../pages/explorer/CollectibleDetail')));
const Transaction = Loadable(lazy(() => import('../pages/explorer/Transaction')));
const AddressDetail = Loadable(lazy(() => import('../pages/explorer/AddressDetail')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));