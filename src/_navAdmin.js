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
    name: 'Workspace',
  },
  {
    component: 'CNavItem',
    name: 'Task List',
    to: '/data',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Logs',
    to: '/logs',
    icon: 'cil-puzzle',
  },
]
