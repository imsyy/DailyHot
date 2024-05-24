<template>
  <Provider>
    <n-layout
      embedded
      :native-scrollbar="false"
      :class="store.headerFixed ? 'fixed' : null"
    >
      <n-back-top :visibility-height="2" @update:show="backTopChange" />
      <Header :class="headerShow ? 'show' : null" />
      <main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <transition name="scale" mode="out-in">
              <component :is="Component" />
            </transition>
          </keep-alive>
        </router-view>
      </main>
      <Footer />
    </n-layout>
  </Provider>
</template>

<script setup>
import { mainStore } from "@/store";
import Provider from "@/components/Provider.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const store = mainStore();

// 顶栏显隐
const headerShow = ref(false);

// 回顶按钮显隐
const backTopChange = (val) => {
  headerShow.value = val;
};

onMounted(() => {
  store.checkNewsUpdate();
  // 写入默认
  nextTick(() => {
    if (store.newsArr.length === 0) {
      store.newsArr = store.defaultNewsArr;
    }
  });
});
</script>

<style lang="scss" scoped>
.n-layout {
  height: 100%;
  &.fixed {
    .header {
      width: 100%;
      margin: 0;
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      box-sizing: border-box;
      &.show {
        height: 70px;
        border-bottom: 2px solid var(--n-border-color);
        background-color: var(--n-color);
        :deep(section) {
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
        }
      }
    }
    main {
      padding: 118px 5vw 0 5vw;
    }
  }
  :deep(.n-scrollbar-rail) {
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 3;
  }
  main {
    padding: 0 5vw;
    max-width: 1800px;
    margin: 0 auto;
    min-height: calc(100vh - 238px);
  }
}

// 路由跳转动画
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
