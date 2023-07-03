<!-- 全局配置组件 -->
<template>
  <n-config-provider
    abstract
    inline-theme-disabled
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider :max="1">
            <slot></slot>
            <NaiveProviderContent />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import {
  zhCN,
  dateZhCN,
  darkTheme,
  useOsTheme,
  useLoadingBar,
  useDialog,
  useMessage,
  useNotification,
} from "naive-ui";
import { mainStore } from "@/store";

const store = mainStore();
const osThemeRef = useOsTheme();

// 明暗切换
let theme = ref(null);
const changeTheme = () => {
  if (store.siteTheme === "light") {
    theme.value = null;
  } else if (store.siteTheme === "dark") {
    theme.value = darkTheme;
  }
};

// 根据系统决定明暗切换
const osThemeChange = (val) => {
  if (store.siteThemeAuto) {
    val == "dark" ? (store.siteTheme = "dark") : (store.siteTheme = "light");
  }
};

// 监听明暗变化
watch(
  () => store.siteTheme,
  () => {
    changeTheme();
  }
);

// 监听系统明暗变化
watch(
  () => osThemeRef.value,
  (val) => {
    osThemeChange(val);
  }
);

// 配置主题色
const themeOverrides = {
  common: {
    primaryColor: "#ea444d",
    primaryColorHover: "#F57B74",
    primaryColorSuppl: "#F57B74",
    primaryColorPressed: "#F64B41",
  },
};

// 挂载 naive 组件的方法
const setupNaiveTools = () => {
  window.$loadingBar = useLoadingBar(); // 进度条
  window.$notification = useNotification(); // 通知
  window.$message = useMessage(); // 信息
  window.$dialog = useDialog(); // 对话框
};

const NaiveProviderContent = defineComponent({
  setup() {
    setupNaiveTools();
  },
  render() {
    return h("div", {
      class: {
        tools: true,
      },
    });
  },
});

onMounted(() => {
  changeTheme();
  osThemeChange(osThemeRef.value);
});
</script>
