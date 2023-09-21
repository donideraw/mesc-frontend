export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'User Management',
  },
  {
    component: 'CNavItem',
    name: 'Users',
    to: '/users',
    icon: 'cil-cursor',
  },
  {
    component: 'CNavTitle',
    name: 'Master Data',
  },
  {
    component: 'CNavItem',
    name: 'Catalog Profile',
    to: '/type',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavItem',
    name: 'Material Master',
    to: '/materials',
    icon: 'cil-puzzle',
  },
  {
    component: 'CNavTitle',
    name: 'Workspace',
  },
  {
    component: 'CNavItem',
    name: 'Equipment Master',
    to: '/data',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Bill of Material',
    to: '/bill',
    icon: 'cil-calculator',
  },
]
