import React, { useMemo } from 'react';

// import redux for auth guard
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
// import layout
import Layout from 'layout/Layout';

// import routing modules
import RouteIdentifier from 'routing/components/RouteIdentifier';
import { getRoutes } from 'routing/helper';
import routesAndMenuItems from 'routes.js';
import Loading from 'components/loading/Loading';

const App = () => {
  const { currentUser, isLogin } = useSelector((state) => state.auth);

  console.log(isLogin);
//localStorage.removeItem('ogfimsAdmin')
  const routes = useMemo(() => getRoutes({ data: routesAndMenuItems, isLogin, userRole: currentUser.role }), [isLogin, currentUser]);
  if (routes) {
    return (
      <Layout>
        <RouteIdentifier routes={routes} fallback={<Loading />} />
        <ToastContainer/>
      </Layout>
    );
  }
  return <></>;
};

export default App;
