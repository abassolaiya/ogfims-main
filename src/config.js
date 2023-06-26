import { LAYOUT, MENU_BEHAVIOUR, NAV_COLOR, MENU_PLACEMENT, RADIUS, THEME_COLOR, USER_ROLE } from 'constants.js';

export const IS_DEMO = false;
export const IS_AUTH_GUARD_ACTIVE = true;
export const SERVICE_URL = '/app';
export const USE_MULTI_LANGUAGE = false;

// For detailed information: https://github.com/nfl/react-helmet#reference-guide
export const REACT_HELMET_PROPS = {
  defaultTitle: 'OGSFIMS',
  titleTemplate: '%s | OGSFIMS Admin dashboard',
};

export const DEFAULT_PATHS = {
  APP: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  USER_WELCOME: '/dashboards/default',
  NOTFOUND: '/page-not-found',
  UNAUTHORIZED: '/unauthorized',
  INVALID_ACCESS: '/invalid-access',
};

export const DEFAULT_SETTINGS = {
  MENU_PLACEMENT: MENU_PLACEMENT.Horizontal,
  MENU_BEHAVIOUR: MENU_BEHAVIOUR.Pinned,
  LAYOUT: LAYOUT.Boxed,
  RADIUS: RADIUS.Rounded,
  COLOR: THEME_COLOR.LightGreen,
  NAV_COLOR: NAV_COLOR.Light,
  USE_SIDEBAR: true,
};



export const DEFAULT_USER ={
/*  id: 1,
  name: 'Victor Olayemi',
  thumb: '/img/profile/profile-11.webp',
  role: USER_ROLE.Admin,
  email: 'v.olayemi@cgiar.org',
  token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJfaWQiOiI2MzUxMDQ4ZjUxYWMxNWY2M2U5ZDg2NGEiLCJuYW1lIjoidmljdG9yIiwiZW1haWwiOiJ0ZXN0aW1vbnlpc21pbmVAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmEkMTAkYmN3bTZYYlBUb2JWVmVIalpGdFNjT2FlbW55QkF2U1VZSnFxZ2JKUW9tRG9jdWQ0L2NQcGkiLCJjcmVhdGVkQXQiOiIyMDIyLTEwLTIwVDA4OjE5OjI3Ljk0MloiLCJ1cGRhdGVkQXQiOiIyMDIyLTEwLTIwVDA4OjE5OjI3Ljk0MloiLCJfX3YiOjB9LCJpYXQiOjE2NzM0MjMyMDUsImV4cCI6MTcwNDk1OTIwNX0.-pStxvT-OvpUQAuInXOgPZY6jXl7ugNc6eZFR5U11gc`,
*/
};


export const REDUX_PERSIST_KEY = 'service-provider';
