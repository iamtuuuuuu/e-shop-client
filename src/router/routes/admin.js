export default [
    // Users
    {
        path: '/admin/users',
        name: 'admin.users.index',
        meta: { requiresAuth: 'Admin' },
        component: () => import(/* webpackChunkName: "admin-users" */ '@/views/Admin/Users.vue')
    },
    {
        path: '/admin/users/:id',
        name: 'admin.users.show',
        meta: { requiresAuth: 'Admin' },
        component: () => import(/* webpackChunkName: "admin-user-details" */ '@/views/Admin/UserDetails.vue')
    },

    // Products
    {
        path: '/admin/products',
        name: 'admin.products.index',
        meta: { requiresAuth: 'Admin' },
        component: () => import(/* webpackChunkName: "admin-products" */ '@/views/Admin/Products.vue')
    },
    {
        path: '/admin/products/:id',
        name: 'admin.products.show',
        meta: { requiresAuth: 'Admin' },
        component: () => import(/* webpackChunkName: "admin-products-details" */ '@/views/Admin/ProductDetails.vue')
    },

    // Orders
    {
        path: '/admin/orders',
        name: 'admin.orders.index',
        meta: { requiresAuth: 'Admin' },
        component: () => import(/* webpackChunkName: "admin-orders" */ '@/views/Admin/Orders.vue')
    },
    {
        path: '/admin/orders/:id',
        name: 'admin.orders.show',
        meta: { requiresAuth: 'Admin' },
        component: () => import(/* webpackChunkName: "admin-orders-details" */ '@/views/Admin/OrderDetails.vue')
    },
]