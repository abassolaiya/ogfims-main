import React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PATHS } from 'config.js';

const NavLogo = () => {
  return (
    <div className="logo position-relative">
      <Link to={DEFAULT_PATHS.APP}>
        {/*
          Logo can be added directly
          <div className="img" />
          Or added via css to provide different ones for different color themes
         */}

         <img src="/img/logo/logo.png" alt="logo" />
        
      </Link>
    </div>
  );
};
export default React.memo(NavLogo);
