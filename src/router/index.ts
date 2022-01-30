import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import MainLayout from "@/components/MainLayout.vue";

export const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "MainLayout",
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Welcome',
                component: () => import(/* webpackChunkName: "welcome" */ '../pages/Welcome.vue'),
            },
        ],
        meta: {
            requiredAuth: true // children不寫默認使用parent的meta
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    linkExactActiveClass: "active",
    routes: routes
});

export default router;