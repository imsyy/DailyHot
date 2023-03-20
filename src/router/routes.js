const routes = [
  // 首页
  {
    path: "/",
    name: "home",
    meta: {
      title: "首页",
    },
    component: () => import("@/views/Home.vue"),
  },
  // 新闻列表
  {
    path: "/list",
    name: "list",
    meta: {
      title: "新闻列表",
    },
    component: () => import("@/views/List.vue"),
  },
  // 设置页
  {
    path: "/setting",
    name: "setting",
    meta: {
      title: "全局设置",
    },
    component: () => import("@/views/Setting.vue"),
  },
  // 测试页面
  {
    path: "/test",
    name: "test",
    meta: {
      title: "test",
    },
    component: () => import("@/views/Test.vue"),
  },
  // 404
  {
    path: "/404",
    name: "404",
    meta: {
      title: "404",
    },
    component: () => import("@/views/404.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];

export default routes;
