<template>
  <n-layout
    embedded
    class="state"
    :content-style="{
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }"
  >
    <n-result
      class="error"
      status="500"
      title="500 服务器错误"
      description="服务器寄了，等会再试吧"
    >
      <template #footer>
        <n-button @click="goHome">重新载入</n-button>
      </template>
    </n-result>
  </n-layout>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
.state {
  height: 100%;
}
</style>
