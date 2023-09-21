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
        name: 'Master Data',
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
