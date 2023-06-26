/* eslint-disable */
import { lazy } from 'react';
import { USER_ROLE } from 'constants.js';
import { DEFAULT_PATHS } from 'config.js';

const blog = lazy(() => import('views/blog/Blog'));
const community = {
  index: lazy(() => import('views/community/Community')),
  list: lazy(() => import('views/community/CommunityList')),
};
const upgrade = lazy(() => import('views/upgrade/Upgrade'));

const dashboard = {
  gettingStarted: lazy(() => import('views/dashboard/DashboardGettingStarted')),
  analysis: lazy(() => import('views/dashboard/DashboardAnalysis')),
};
const services = {
  news: lazy(() => import('views/News/News')),
  newsAdd: lazy(() => import('views/News/NewsAdd')),
  newsEditor: lazy(() => import('views/News/NewsEditor')),
  publication: lazy(() => import('views/Publication/Publication')),
  publicationAdd: lazy(() => import('views/Publication/PublicationAdd')),
  publicationDetail: lazy(() => import('views/Publication/PublicationDetail')),
  partners: lazy(() => import('views/Partners/Partners')),
  partnersAdd: lazy(() => import('views/Partners/PartnersAdd')),
  partnersDetail: lazy(() => import('views/Partners/PartnersDetail')),
  category: lazy(() => import('views/Category/Category')),
  categoryAdd: lazy(() => import('views/Category/CategoryAdd')),
  categoryDetail: lazy(() => import('views/Category/CategoryDetail')),

  faq: lazy(() => import('views/FAQ/FAQ')),
  faqAdd: lazy(() => import('views/FAQ/FAQAdd')),
  faqDetail: lazy(() => import('views/FAQ/FAQDetail')),

  tools: lazy(() => import('views/Tools/Tools')),
  toolsAdd: lazy(() => import('views/Tools/ToolsAdd')),
  toolsDetail: lazy(() => import('views/Tools/ToolsDetail')),

  banners: lazy(() => import('views/Banners/Banners')),
  bannersAdd: lazy(() => import('views/Banners/BannersAdd')),
  bannersDetail: lazy(() => import('views/Banners/BannersDetail')),

  video: lazy(() => import('views/Video/Video')),
  videoAdd: lazy(() => import('views/Video/VideoAdd')),
  videoDetail: lazy(() => import('views/Video/VideoDetail')),

  about: lazy(() => import('views/About/About')),
  contacts: lazy(() => import('views/Contacts/Contacts')),

  farmers: lazy(() => import('views/Farmers/Farmers')),
  farmersAdd: lazy(() => import('views/Farmers/FarmersAdd')),
  FarmersDetails: lazy(() => import('views/Farmers/FarmersDetails')),

  users: lazy(() => import('views/Users/Users')),
  usersAdd: lazy(() => import('views/Users/UsersAdd')),

  processors: lazy(() => import('views/Processors/Processors')),
  processorsAdd: lazy(() => import('views/Processors/ProcessorsAdd')),

  traders: lazy(() => import('views/Traders/Traders')),
  tradersAdd: lazy(() => import('views/Traders/TradersAdd')),

  agroDealer: lazy(() => import('views/AgroDealer/AgroDealer')),
  agroDealerAdd: lazy(() => import('views/AgroDealer/AgroDealerAdd')),
  SendSms: lazy(() => import('views/Sms/SendSms')),
  SendEmail: lazy(() => import('views/Email/SendEmail')),
  SendPushNotification: lazy(() => import('views/PushNotification/SendPushNotification')),
  GoogleMapsApi: lazy(() => import('views/Settings/GoogleMapsApi')),
  SmsSettings: lazy(() => import('views/Settings/SmsSettings')),
  EmailSettings: lazy(() => import('views/Settings/EmailSettings')),
  
};
const account = {
  settings: lazy(() => import('views/account/AccountSettings')),
  billing: lazy(() => import('views/account/AccountBilling')),
  security: lazy(() => import('views/account/AccountSecurity')),
};
const support = {
  docs: lazy(() => import('views/support/SupportDocs')),
  docsDetail: lazy(() => import('views/support/SupportDocsDetail')),
  knowledgeBase: lazy(() => import('views/support/SupportKnowledgeBase')),
  tickets: lazy(() => import('views/support/SupportTickets')),
  ticketsDetail: lazy(() => import('views/support/SupportTicketsDetail')),
};

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}/dashboard`,
      protected: true,
      roles: [USER_ROLE.Admin, USER_ROLE.Editor, USER_ROLE.Contributor],
    },
  /* {
      path: `${appRoot}/security`,
      component: account.security,
      label: 'menu.blog',
      icon: 'file-text',
    },
    {
      path: `${appRoot}/setting`,
      label: 'account.settings',
      icon: 'trend-up',
      component: account.settings,
    },
    {
      path: `${appRoot}/community`,
      label: 'menu.community',
      icon: 'messages',
      component: community.index,
      subs: [
        {
          path: '/list',
          label: 'menu.community-list',
          hideInMenu: true,
          component: community.list,
        },
      ],
    }, */
  ],
  sidebarItems: [
    { 
      path: `${appRoot}/dashboard`,
      label: 'Dashboard',
      component: dashboard.analysis,
      icon: 'board-2',
      exact: true,
      roles: [USER_ROLE.Admin, USER_ROLE.Editor, USER_ROLE.Contributor],
      //redirect: true,
      //to: `${appRoot}/dashboard`,
     // subs: [
     //   { path: '/getting-started', label: 'menu.getting-started', icon: 'navigate-diagonal', component: dashboard.gettingStarted },
        //{ path: '/dashboard', label: 'Dashboard', icon: 'chart-4', component: dashboard.analysis },
     // ],
   }, 

    { 
      path: `${appRoot}/mgt`,
      label: "User Management",
      icon: 'grid-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/mgt/farmers`,
      roles: [USER_ROLE.Admin, USER_ROLE.Editor, USER_ROLE.Contributor],
      subs: [
        { path: '/admin-users',
          label: 'Admin Users',
          icon: 'user',
          roles: [USER_ROLE.Admin],
          component: services.users,
          subs:[
            { path: '/add', label: 'Admin Users', hideInMenu: true, component: services.usersAdd },
          ]
        },
        { path: '/farmers',
          label: 'Users',
          icon: 'user',
          component: services.farmers,
          subs:[
            { path: '/add', label: 'menu.farmers-add', hideInMenu: true, component: services.farmersAdd },
            { path: '/details', label: 'menu.farmers-details', hideInMenu: true, component: services.FarmersDetails }
          ]
        },
      ],
    },

    { 
      path: `${appRoot}/comm`,
      label: "Communications",
      icon: 'grid-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/comm/sms`,
      roles: [USER_ROLE.Admin, USER_ROLE.Editor],
      subs: [
        { path: '/sms',
          label: 'Send SMS',
          icon: 'message',
          component: services.SendSms,
          subs:[
           // { path: '/add', label: 'menu.farmers-add', hideInMenu: true, component: services.farmersAdd },
          ]
        },

        { path: '/email',
          label: 'Send Email',
          icon: 'email',
          component: services.SendEmail,
          subs:[
           // { path: '/add', label: 'menu.farmers-add', hideInMenu: true, component: services.farmersAdd },
          ]
        },

        { path: '/push-notification',
          label: 'Send Push Notification',
          icon: 'bell',
          component: services.SendPushNotification,
          subs:[
           // { path: '/add', label: 'menu.farmers-add', hideInMenu: true, component: services.farmersAdd },
          ]
        },
      ],
    },




    
    {
      path: `${appRoot}/content`,
      label: 'Contents',
      icon: 'grid-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/news`,
      roles: [USER_ROLE.Admin, USER_ROLE.Editor, USER_ROLE.Contributor],
      subs: [
        {
          path: '/news',
          label: 'News',
          icon: 'file-text',
          component: services.news,
          subs: [
            { path: '/add', label: 'menu.news-add', hideInMenu: true, component: services.newsAdd },
            { path: '/detail', label: 'menu.news-editor', hideInMenu: true, component: services.newsEditor },
          ],
        },

        {
          path: '/about',
          label: 'About',
          icon: 'building-large',
          component: services.about
        },

        {
          path: '/contact',
          label: 'Contacts',
          icon: 'phone',
          component: services.contacts
        },
        
        {
          path: '/partners',
          label: 'Partners',
          icon: 'user',
          component: services.partners,
          subs: [
            { path: '/add', label: 'menu.partners-add', hideInMenu: true, component: services.partnersAdd },
            { path: '/detail', label: 'menu.partners-detail', hideInMenu: true, component: services.partnersDetail },
          ],
        },
        {
          path: '/category',
          label: 'Categories',
          icon: 'database',
          component: services.category,
          subs: [
            { path: '/add', label: 'menu.category-add', hideInMenu: true, component: services.categoryAdd },
            { path: '/detail', label: 'menu.category-detail', hideInMenu: true, component: services.categoryDetail },
          ],
        },

        {
          path: '/publication',
          label: 'Publications',
          icon: 'book-open',
          component: services.publication,
          subs: [
            { path: '/add', label: 'menu.publication-add', hideInMenu: true, component: services.publicationAdd },
            { path: '/detail', label: 'menu.publication-detail', hideInMenu: true, component: services.publicationDetail },
          ],
        },

        {
          path: '/tools',
          label: 'Tools',
          icon: 'tool',
          component: services.tools,
          subs: [
            { path: '/add', label: 'menu.tools-add', hideInMenu: true, component: services.toolsAdd },
            { path: '/detail', label: 'menu.tools-detail', hideInMenu: true, component: services.toolsDetail },
          ],
        },

        {
          path: '/video',
          label: 'Video',
          icon: 'video',
          component: services.video,
          subs: [
            { path: '/add', label: 'menu.video-add', hideInMenu: true, component: services.videoAdd },
            { path: '/detail', label: 'menu.video-detail', hideInMenu: true, component: services.videoDetail },
          ],
        },


        {
          path: '/banners',
          label: 'Banners',
          icon: 'image',
          component: services.banners,
          subs: [
            { path: '/add', label: 'menu.banners-add', hideInMenu: true, component: services.bannersAdd },
            { path: '/detail', label: 'menu.banners-detail', hideInMenu: true, component: services.bannersDetail },
          ],
        },



        {
          path: '/faq',
          label: 'FAQ',
          icon: 'help',
          component: services.faq,
          subs: [
            { path: '/add', label: 'menu.faq-add', hideInMenu: true, component: services.faqAdd },
            { path: '/detail', label: 'menu.faq-detail', hideInMenu: true, component: services.faqDetail },
          ],
        },
      ],
    },

     { 
      path: `${appRoot}/settings`,
      label: "Settings",
      icon: 'grid-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/`,
      roles: [USER_ROLE.Admin],
      subs: [
        { path: '/email-settings',
          label: 'Email Credentials',
          icon: 'email',
          component: services.EmailSettings,
          subs:[
           // { path: '/add', label: 'menu.farmers-add', hideInMenu: true, component: services.farmersAdd },
          ]
        },

        { path: '/sms-api',
          label: 'SMS Credentials',
          icon: 'message',
          component: services.SmsSettings,
          subs:[
           // { path: '/add', label: 'menu.farmers-add', hideInMenu: true, component: services.farmersAdd },
          ]
        },

        { path: '/maps-apikey',
          label: 'Google maps API Key',
          icon: 'key',
          component: services.GoogleMapsApi,
          subs:[
           // { path: '/add', label: 'menu.farmers-add', hideInMenu: true, component: services.farmersAdd },
          ]
        },

        { path: '/',
          label: 'Firebase Credentials',
          icon: 'key',
          component: '',
          subs:[
           // { path: '/add', label: 'menu.farmers-add', hideInMenu: true, component: services.farmersAdd },
          ]
        },

        { path: '/',
          label: 'Social Media',
          icon: 'like',
          component: '',
          subs:[
           // { path: '/add', label: 'menu.farmers-add', hideInMenu: true, component: services.farmersAdd },
          ]
        },

        

      /*  { path: '/traders',
          label: 'Traders',
          icon: 'user',
          component: services.traders,
          subs:[
            { path: '/add', label: 'menu.traders-add', hideInMenu: true, component: services.tradersAdd },
          ]
        },

        { path: '/agro-dealer',
          label: 'Agro Dealer',
          icon: 'user',
          component: services.agroDealer,
          subs:[
            { path: '/add', label: 'menu.agroDealer-add', hideInMenu: true, component: services.agroDealerAdd },
          ]
        },
        { path: '/processors',
          label: 'Processors',
          icon: 'user',
          component: services.processors,
          subs:[
            { path: '/add', label: 'menu.processors-add', hideInMenu: true, component: services.processorsAdd },
          ]
        }, */
      ],
    },

  
  ],
};
export default routesAndMenuItems;
