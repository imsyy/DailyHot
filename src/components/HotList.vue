<template>
  <n-card
    hoverable
    class="hot-list"
    :header-style="{ padding: '16px' }"
    :content-style="{ padding: '0 16px' }"
    :footer-style="{ padding: '16px' }"
    @click="toList"
  >
    <template #header>
      <Transition name="fade" mode="out-in">
        <template v-if="!hotListData">
          <div class="loading">
            <n-skeleton text round />
          </div>
        </template>
        <template v-else>
          <div class="title">
            <n-avatar
              class="ico"
              :src="`/logo/${hotType}.png`"
              fallback-src="/ico/icon_error.png"
            />
            <n-text class="name">{{ hotListData.title }}</n-text>
            <n-text class="subtitle" :depth="2">
              {{ hotListData.subtitle }}
            </n-text>
          </div>
        </template>
      </Transition>
    </template>
    <n-scrollbar class="news-list" ref="scrollbarRef">
      <Transition name="fade" mode="out-in">
        <template v-if="!hotListData || listLoading">
          <div class="loading">
            <n-skeleton text round :repeat="10" height="20px" />
          </div>
        </template>
        <template v-else>
          <div class="lists" :id="hotType + 'Lists'">
            <div
              class="item"
              v-for="(item, index) in hotListData.data.slice(0, 15)"
              :key="item"
            >
              <n-text
                class="num"
                :class="
                  index === 0
                    ? 'one'
                    : index === 1
                    ? 'two'
                    : index === 2
                    ? 'three'
                    : null
                "
                :depth="2"
                >{{ index + 1 }}</n-text
              >
              <n-text class="text" @click.stop="jumpLink(item)">
                {{ item.title }}
              </n-text>
            </div>
          </div>
        </template>
      </Transition>
    </n-scrollbar>
    <template #footer>
      <Transition name="fade" mode="out-in">
        <template v-if="!hotListData">
          <div class="loading">
            <n-skeleton text round />
          </div>
        </template>
        <template v-else>
          <div class="message">
            <n-text class="time" :depth="3" v-if="updateTime">
              {{ updateTime }}
            </n-text>
            <n-text class="time" :depth="3" v-else> 获取失败 </n-text>
            <n-space class="controls">
              <n-popover v-if="hotListData.data.length > 15">
                <template #trigger>
                  <n-button
                    size="tiny"
                    secondary
                    strong
                    round
                    @click.stop="toList"
                  >
                    <template #icon>
                      <n-icon :component="More" />
                    </template>
                  </n-button>
                </template>
                查看更多
              </n-popover>
              <n-popover>
                <template #trigger>
                  <n-button
                    size="tiny"
                    secondary
                    strong
                    round
                    @click.stop="getNewData"
                  >
                    <template #icon>
                      <n-icon :component="Refresh" />
                    </template>
                  </n-button>
                </template>
                获取最新
              </n-popover>
            </n-space>
          </div>
        </template>
      </Transition>
    </template>
  </n-card>
</template>

<script setup>
import { Refresh, More } from "@icon-park/vue-next";
import { getHotLists } from "@/api";
import { formatTime } from "@/utils/getTime";
import { mainStore } from "@/store";
import { useRouter } from "vue-router";

const router = useRouter();
const store = mainStore();
const props = defineProps({
  // 热榜类别
  hotType: {
    type: String,
    default: null,
  },
});

// 更新时间
const updateTime = ref(null);

// 刷新按钮数据
const lastClickTime = ref(localStorage.getItem(`${props.hotType}Btn`) || 0);

// 热榜数据
const hotListData = ref(null);
const scrollbarRef = ref(null);
const listLoading = ref(false);

// 获取热榜数据
const getHotListsData = (type, isNew = false) => {
  // hotListData.value = null;
  getHotLists(type, isNew).then((res) => {
    console.log(res);
    if (res.code === 200) {
      listLoading.value = false;
      hotListData.value = res;
      // 滚动至顶部
      if (scrollbarRef.value) {
        scrollbarRef.value.scrollTo({ position: "top", behavior: "smooth" });
      }
    } else {
      $message.error(res.title + res.message);
    }
  });
};

// 获取最新数据
const getNewData = () => {
  const now = Date.now();
  if (now - lastClickTime.value > 60000) {
    // 点击事件
    listLoading.value = true;
    getHotListsData(props.hotType, true);
    // 更新最后一次点击时间
    lastClickTime.value = now;
    localStorage.setItem(`${props.hotType}Btn`, now);
  } else {
    // 不执行点击事件
    $message.info("请稍后再刷新");
  }
};

// 链接跳转
const jumpLink = (data) => {
  if (!data.url || !data.mobileUrl) return $message.error("链接不存在");
  const url = window.innerWidth > 680 ? data.url : data.mobileUrl;
  if (store.linkOpenType === "open") {
    window.open(url, "_blank");
  } else if (store.linkOpenType === "href") {
    window.location.href = url;
  }
};

// 前往全部列表
const toList = () => {
  if (props.hotType) {
    router.push({
      path: "/list",
      query: {
        type: props.hotType,
      },
    });
  } else {
    $message.error("数据出错，请重试");
  }
};

// 实时改变更新时间
watch(
  () => store.timeData,
  () => {
    if (hotListData.value) {
      updateTime.value = formatTime(hotListData.value.updateTime);
    }
  }
);

onMounted(() => {
  if (props.hotType) getHotListsData(props.hotType);
});
</script>

<style lang="scss" scoped>
.hot-list {
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease-in-out;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .title {
    display: flex;
    align-items: center;
    font-size: 16px;
    height: 26px;
    .n-avatar {
      background-color: transparent;
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .subtitle {
      margin-left: auto;
      font-size: 12px;
    }
  }
  .message {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    font-size: 12px;
    height: 24px;
    .time {
      padding: 0 6px;
    }
  }
  :deep(.news-list) {
    height: 300px;
    .n-scrollbar-rail {
      right: 0;
    }
    .loading {
      display: flex;
      flex-direction: column;
      height: 300px;
      justify-content: space-between;
    }
  }
  .lists {
    padding-right: 6px;
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      padding-bottom: 2px;
      min-height: 30px;
      border-radius: 8px;
      transition: all 0.3s;
      cursor: pointer;
      &:nth-last-of-type(1) {
        margin-bottom: 0;
      }
      .num {
        width: 24px;
        height: 24px;
        min-width: 24px;
        margin-right: 8px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--n-border-color);
        border-radius: 8px;
        transition: all 0.3s;
        &:hover {
          background-color: var(--n-close-color-hover);
        }
        &.one {
          background-color: #ea444d;
          color: #fff;
        }
        &.two {
          background-color: #ed702d;
          color: #fff;
        }
        &.three {
          background-color: #eead3f;
          color: #fff;
        }
      }
      .text {
        position: relative;
        display: inline-block;
        width: 100%;
        transition: all 0.3s;
        @media (min-width: 768px) {
          &:hover {
            transform: translateX(4px);
            &::after {
              width: 90%;
            }
          }
        }
        @media (max-width: 768px) {
          &:active {
            color: #ea444d;
          }
        }
        &::after {
          content: "";
          width: 0;
          height: 2px;
          max-height: 2px;
          background-color: var(--n-close-color-pressed);
          position: absolute;
          left: 0;
          bottom: -2px;
          border-radius: 8px;
          transition: all 0.3s;
        }
      }
    }
  }
  :deep(.n-card-header) {
    .loading {
      height: 26px;
    }
  }
  :deep(.n-card__footer) {
    .loading {
      height: 24px;
    }
  }
}
</style>
