import React, { useMemo } from 'react';
import { Col, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getMenuItems } from 'routing/helper';
import routesAndMenuItems from 'routes.js';
import SidebarMenuItems from './SidebarMenuItems';

const SidebarMenu = () => {
  const { isLogin, currentUser } = useSelector((state) => state.auth);
  const { useSidebar } = useSelector((state) => state.menu);

  const menuItemsMemo = useMemo(
    () =>
      getMenuItems({
        data: routesAndMenuItems.sidebarItems,
        isLogin,
        userRole: currentUser.role,
      }),
    [isLogin, currentUser]
  );

  if (!useSidebar === true) {
    return <></>;
  }
  return (
  
    <Col xs="auto" className="side-menu-container">
      <Card>
        <ul className="sw-25 side-menu mb-0 primary" id="menuSide">
          <SidebarMenuItems menuItems={menuItemsMemo} />
        </ul>
      </Card>
    </Col>
    
  );
};
export default SidebarMenu;
