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
        name: 'Workspace',
    },
    {
        component: 'CNavItem',
        name: 'Task List',
        to: '/data',
        icon: 'cil-pencil',
    },
]
