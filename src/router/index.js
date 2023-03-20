import { createRouter, createWebHashHistory } from "vue-router";
import routes from "@/router/routes";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫
router.beforeEach(() => {
  $loadingBar.start();
});

router.afterEach(() => {
  $loadingBar.finish();
});

export default router;