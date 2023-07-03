<template>
  <n-card :bordered="false" class="header" content-style="padding: 0">
    <section>
      <div class="logo" @click="router.push('/')">
        <img src="/ico/favicon.png" alt="logo" />
        <div class="name">
          <n-text>今日热榜</n-text>
          <n-text :depth="3">汇聚全网热点，热门尽览无余</n-text>
        </div>
      </div>
      <div class="current-time" v-if="store.timeData">
        <n-text class="time">{{ store.timeData.time.text }}</n-text>
        <n-text class="date" :depth="3">
          {{
            store.timeData.lunar.GanZhiYear +
            "年 " +
            store.timeData.lunar.text +
            " " +
            store.timeData.time.weekday
          }}
        </n-text>
      </div>
      <div class="current-time" v-else>
        <n-text class="time">时间获取中</n-text>
      </div>
      <div class="controls">
        <n-space justify="end">
          <n-popover v-if="showRefresh">
            <template #trigger>
              <n-button secondary strong round @click="router.go(0)">
                <template #icon>
                  <n-icon :component="Refresh" />
                </template>
              </n-button>
            </template>
            刷新页面
          </n-popover>
          <n-popover>
            <template #trigger>
              <n-button
                secondary
                strong
                round
                @click="
                  store.setSiteTheme(
                    store.siteTheme === 'light' ? 'dark' : 'light'
                  )
                "
              >
                <template #icon>
                  <n-icon
                    :component="store.siteTheme === 'light' ? Moon : SunOne"
                  />
                </template>
              </n-button>
            </template>
            {{ store.siteTheme === "light" ? "深色模式" : "浅色模式" }}
          </n-popover>
          <n-popover>
            <template #trigger>
              <n-button secondary strong round @click="router.push('/setting')">
                <template #icon>
                  <n-icon :component="SettingTwo" />
                </template>
              </n-button>
            </template>
            全局设置
          </n-popover>
        </n-space>
      </div>
      <div class="mobile">
        <n-dropdown
          :options="menuOptions"
          size="large"
          trigger="click"
          placement="bottom-end"
          @select="menuOptionsSelect"
        >
          <n-button secondary strong round>
            <template #icon>
              <n-icon :component="HamburgerButton" />
            </template>
          </n-button>
        </n-dropdown>
      </div>
    </section>
  </n-card>
</template>

<script setup>
import {
  SunOne,
  Moon,
  Refresh,
  SettingTwo,
  HamburgerButton,
} from "@icon-park/vue-next";
import { getCurrentTime } from "@/utils/getTime.js";
import { mainStore } from "@/store";
import { NText, NIcon } from "naive-ui";
import { useRouter } from "vue-router";

const router = useRouter();
const store = mainStore();
const timeInterval = ref(null);
const showRefresh = ref(false);

// 移动端时间模块
const timeRender = () => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6px 18px",
      },
    },
    [
      h(NText, null, {
        default: () =>
          store.timeData ? store.timeData.time.text : "时间获取失败",
      }),
      h(
        NText,
        { depth: 3, style: "font-size: 12px" },
        {
          default: () =>
            store.timeData
              ? store.timeData.lunar.GanZhiYear +
                "年 " +
                store.timeData.lunar.text +
                " " +
                store.timeData.time.weekday
              : "日期获取失败",
        }
      ),
    ]
  );
};

// 移动端菜单
const menuOptions = [
  {
    key: "header",
    type: "render",
    render: timeRender,
  },
  {
    key: "header-divider",
    type: "divider",
  },
  {
    label: "刷新页面",
    key: "refresh",
    icon: () => {
      return h(NIcon, null, {
        default: () => h(Refresh),
      });
    },
  },
  {
    label: () => {
      return h(NText, null, {
        default: () => (store.siteTheme === "light" ? "深色模式" : "浅色模式"),
      });
    },
    key: "changeTheme",
    icon: () => {
      return h(NIcon, null, {
        default: () => (store.siteTheme === "light" ? h(Moon) : h(SunOne)),
      });
    },
  },
  {
    label: "全局设置",
    key: "setting",
    icon: () => {
      return h(NIcon, null, {
        default: () => h(SettingTwo),
      });
    },
  },
];

// 移动端下拉菜单点击事件
const menuOptionsSelect = (val) => {
  if (val === "refresh") {
    router.go(0);
  } else if (val === "changeTheme") {
    store.setSiteTheme(store.siteTheme === "light" ? "dark" : "light");
  } else if (val === "setting") {
    router.push("/setting");
  }
};

// 监听路由参数变化
watch(
  () => router.currentRoute.value,
  (val) => {
    const isHome = val.path === "/";
    showRefresh.value = isHome ? true : false;
  }
);

onMounted(() => {
  window.$timeInterval = timeInterval.value = setInterval(() => {
    store.timeData = getCurrentTime();
  }, 1000);
  showRefresh.value = router.currentRoute.value?.path === "/" ? true : false;
});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.header {
  height: 118px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 24px 5vw;
  z-index: 2;
  top: 0;
  background-color: transparent;
  transition: all 0.3s;
  section {
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    justify-content: space-between;
    .logo {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      img {
        width: 50px;
        height: 50px;
        margin-right: 16px;
        transition: all 0.3s;
      }
      .name {
        display: flex;
        flex-direction: column;
        span {
          &:nth-of-type(1) {
            font-size: 20px;
            font-weight: bold;
            transition: all 0.3s;
          }
          &:nth-of-type(2) {
            font-size: 12px;
          }
        }
      }
    }
    .current-time {
      display: flex;
      flex-direction: column;
      align-items: center;
      .date {
        font-size: 12px;
      }
    }
    .mobile {
      display: none;
    }
    @media (max-width: 768px) {
      display: flex;
      .logo {
        img {
          width: 40px;
          height: 40px;
        }
        .name {
          span {
            &:nth-of-type(1) {
              font-size: 18px;
            }
          }
        }
      }
      .current-time,
      .controls {
        display: none;
      }
      .mobile {
        display: block;
      }
    }
  }
}
</style>
