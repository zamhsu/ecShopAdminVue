import { RouteRecordRaw } from "vue-router";

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: 'product',
        name: 'Product',
        component: () => import(/* webpackChunkName: "admin" */ '../pages/Product.vue'),
        meta: {
            requiredAuth: true
        }
    },
]