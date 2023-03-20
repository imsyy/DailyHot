<template>
  <div class="setting">
    <div class="title">全局设置</div>
    <n-h6 prefix="bar"> 基础设置 </n-h6>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">链接跳转方式</n-text>
          <n-text class="tip" :depth="3"> 选择榜单列表内容的跳转方式 </n-text>
        </div>
        <n-select
          class="set"
          v-model:value="linkOpenType"
          :options="linkOptions"
        />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">固定导航栏</n-text>
          <n-text class="tip" :depth="3"> 导航栏是否固定 </n-text>
        </div>
        <n-switch v-model:value="headerFixed" :round="false" />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">榜单排序</n-text>
          <n-text class="tip" :depth="3">
            拖拽以排序，开关用以控制在页面中的显示状态
          </n-text>
        </div>
        <n-popconfirm @positive-click="restoreDefault">
          <template #trigger>
            <n-button class="control" size="small"> 恢复默认 </n-button>
          </template>
          确认将排序恢复到默认状态？
        </n-popconfirm>
      </div>
      <draggable
        :list="newsArr"
        :animation="200"
        class="mews-group"
        item-key="order"
        @end="saveSoreData()"
      >
        <template #item="{ element }">
          <n-card
            class="item"
            embedded
            :content-style="{ display: 'flex', alignItems: 'center' }"
          >
            <div class="desc" :style="{ opacity: element.show ? null : 0.6 }">
              <img
                class="logo"
                :src="`/logo/${element.value}.png`"
                alt="logo"
              />
              <n-text class="news-name" v-html="element.label" />
            </div>
            <n-switch
              class="switch"
              :round="false"
              v-model:value="element.show"
              @update:value="saveSoreData(element.label, element.show)"
            />
          </n-card>
        </template>
      </draggable>
    </n-card>
    <n-h6 prefix="bar"> 杂项设置 </n-h6>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">重置所有数据</n-text>
          <n-text class="tip" :depth="3">
            重置所有数据，你的自定义设置都将会丢失
          </n-text>
        </div>
        <n-popconfirm @positive-click="reset">
          <template #trigger>
            <n-button type="warning"> 重置 </n-button>
          </template>
          确认重置所有数据？你的自定义设置都将会丢失！
        </n-popconfirm>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "@/store";
import draggable from "vuedraggable";

const store = mainStore();
const { newsArr, linkOpenType, headerFixed } = storeToRefs(store);

// 榜单跳转
const linkOptions = [
  {
    label: "新页面打开",
    value: "open",
  },
  {
    label: "当前页打开",
    value: "href",
  },
];

// 恢复默认排序
const restoreDefault = () => {
  newsArr.value = newsArr.value.sort((a, b) => a.order - b.order);
  $message.success("恢复默认榜单排序成功");
};

// 将排序结果写入
const saveSoreData = (name = null, open = false) => {
  $message.success(
    name ? `${name}榜单已${open ? "开启" : "关闭"}` : "榜单排序成功"
  );
};

// 重置数据
const reset = () => {
  if ($timeInterval) clearInterval($timeInterval);
  localStorage.clear();
  location.reload();
};
</script>

<style lang="scss" scoped>
.setting {
  .title {
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 40px;
    font-weight: bold;
  }
  .n-h {
    padding-left: 16px;
    font-size: 20px;
    margin-left: 4px;
  }
  .set-item {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 12px;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name {
        font-size: 18px;
        display: flex;
        flex-direction: column;
        .tip {
          font-size: 12px;
        }
      }
      .set {
        max-width: 200px;
      }
    }

    .mews-group {
      margin-top: 16px;
      display: grid;
      grid-template-columns: repeat(5, minmax(0px, 1fr));
      gap: 24px;
      @media (max-width: 1666px) {
        grid-template-columns: repeat(4, minmax(0px, 1fr));
      }
      @media (max-width: 1200px) {
        grid-template-columns: repeat(3, minmax(0px, 1fr));
      }
      @media (max-width: 890px) {
        grid-template-columns: repeat(2, minmax(0px, 1fr));
      }
      @media (max-width: 620px) {
        grid-template-columns: repeat(1, minmax(0px, 1fr));
      }
      .item {
        cursor: pointer;
        .desc {
          display: flex;
          align-items: center;
          width: 100%;
          transition: all 0.3s;
          .logo {
            width: 40px;
            height: 40px;
            margin-right: 12px;
          }

          .news-name {
            font-size: 16px;
          }
        }
        .switch {
          margin-left: auto;
        }
      }
    }
  }
}
</style>
