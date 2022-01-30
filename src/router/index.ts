import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import Login from "@/pages/Login.vue";
import MainLayout from "@/components/MainLayout.vue";
import NotFound from "@/pages/NotFound.vue";

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
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
    },
    {
        path: '/:pathMatch(.*)*', // 非路由設定的頁面
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    linkExactActiveClass: "active",
    routes: routes
});

export default router;