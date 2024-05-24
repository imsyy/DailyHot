<template>
  <n-card
    :header-style="{ padding: '16px' }"
    :content-style="{ padding: '0 16px' }"
    :footer-style="{ padding: '16px' }"
    :id="`hot-list-${hotData.name}`"
    class="hot-list"
    hoverable
    @click="toList"
  >
    <template #header>
      <n-space class="title" justify="space-between">
        <div class="name">
          <n-avatar
            class="ico"
            :src="`/logo/${hotData.name}.png`"
            fallback-src="/ico/icon_error.png"
          />
          <n-text class="name-text">{{ hotData.label }}</n-text>
        </div>
        <n-text v-if="hotListData?.type" class="subtitle" :depth="2">
          {{ hotListData.type }}
        </n-text>
        <n-skeleton v-else width="60px" text round />
      </n-space>
    </template>
    <n-scrollbar class="news-list" ref="scrollbarRef">
      <Transition name="fade" mode="out-in">
        <div v-if="loadingError" class="error">
          <n-result
            size="small"
            status="500"
            title="哎呀，加载失败了"
            description="生活总会遇到不如意的事情"
            style="margin-top: 40px"
          />
          <n-button
            size="small"
            secondary
            strong
            round
            @click.stop="getHotListsData(hotData.name)"
          >
            <template #icon>
              <n-icon :component="Refresh" />
            </template>
            重试
          </n-button>
        </div>
        <div v-else-if="!hotListData || listLoading" class="loading">
          <n-skeleton text round :repeat="10" height="20px" />
        </div>
        <div v-else class="lists" :id="hotData.name + 'Lists'">
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
            <n-text
              :style="{ fontSize: store.listFontSize + 'px' }"
              class="text"
              @click.stop="jumpLink(item)"
            >
              {{ item.title }}
            </n-text>
          </div>
        </div>
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
  // 热榜数据
  hotData: {
    type: Object,
    default: {},
  },
});

// 更新时间
const updateTime = ref(null);

// 刷新按钮数据
const lastClickTime = ref(
  localStorage.getItem(`${props.hotData.name}Btn`) || 0
);

// 热榜数据
const hotListData = ref(null);
const scrollbarRef = ref(null);
const listLoading = ref(false);
const loadingError = ref(false);

// 获取热榜数据
const getHotListsData = async (name, isNew = false) => {
  try {
    // hotListData.value = null;
    loadingError.value = false;
    const item = store.newsArr.find((item) => item.name == name);
    const result = await getHotLists(item.name, isNew, item.params);
    // console.log(result);
    if (result.code === 200) {
      listLoading.value = false;
      hotListData.value = result;
      // 滚动至顶部
      if (scrollbarRef.value) {
        scrollbarRef.value.scrollTo({ position: "top", behavior: "smooth" });
      }
    } else {
      loadingError.value = true;
      $message.error(result.title + result.message);
    }
  } catch (error) {
    loadingError.value = true;
    $message.error("热榜加载失败，请重试");
  }
};

// 获取最新数据
const getNewData = () => {
  const now = Date.now();
  if (now - lastClickTime.value > 60000) {
    // 点击事件
    listLoading.value = true;
    getHotListsData(props.hotData.name, true);
    // 更新最后一次点击时间
    lastClickTime.value = now;
    localStorage.setItem(`${props.hotData.name}Btn`, now);
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
  if (props.hotData.name) {
    router.push({
      path: "/list",
      query: {
        type: props.hotData.name,
      },
    });
  } else {
    $message.error("数据出错，请重试");
  }
};

// 判断列表是否显示
const checkListShow = () => {
  const typeName = props.hotData.name;
  const listId = "hot-list-" + typeName;
  const listDom = document.getElementById(listId);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log(`👀 ${typeName} 可见，开始加载`);
        getHotListsData(props.hotData.name);
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(listDom);
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
  checkListShow();
});
</script>

<style lang="scss" scoped>
.hot-list {
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;
  .title {
    display: flex;
    align-items: center;
    font-size: 16px;
    height: 26px;
    .name {
      display: flex;
      align-items: center;
      .n-avatar {
        background-color: transparent;
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
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

    .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      .n-button {
        margin-top: 12px;
      }
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
