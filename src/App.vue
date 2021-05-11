<template>
  <router-view v-slot="{ Component }">
    <!-- 缓存页面 -->
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "App",
  components: {},
})
</script>
