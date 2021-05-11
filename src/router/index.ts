/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mirror29
 * @LastEditors: mirror29
 * @LastEditTime: 2021-04-28 10:59:41
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    meta: {
      title: "首页",
      keepAlive: true,
    },
    component: () => import("../views/Home/index.vue"),
  },
  {
    path: "/list",
    name: "List",
    meta: {
      title: "列表页",
      keepAlive: true,
    },
    component: () => import("../views/Home/list.vue"),
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
