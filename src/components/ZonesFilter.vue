<template>
  <div :class="['zones-filter-wrap', zonesPopup ? 'up' : '']">
    <div class="current-zones" @click="showZonesPopup">
      <div class="name">{{ zones.name }}</div>
      <i
        v-if="zones.name"
        :class="['iconfont', zonesPopup ? 'icon-shang' : 'icon-xia']"
      ></i>
    </div>
    <van-popup
      class="filters-popup-comp"
      v-model="zonesPopup"
      position="top"
      :overlay-style="{ top: '88px', zIndex: 100 }"
      get-container="body"
      @close="zonesPopup = false"
    >
      <ul class="list-wrap">
        <li
          v-for="(item, index) in zones.options"
          :key="index"
          :class="['list-item', item.value == zones.value ? 'active' : '']"
          @click="toggleZones(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onMounted,
  reactive,
  getCurrentInstance,
  toRefs,
} from "vue"
import { useRoute, useRouter } from "vue-router"

export default defineComponent({
  name: "ZonesFilter",
  props: {
    zones: {
      type: Object,
      required: true,
    },
  },

  setup: (props, context) => {
    const { ctx } = getCurrentInstance()
    const state: any = reactive({
      zonesPopup: false,
    })

    function showZonesPopup() {
      state.zonesPopup = !state.zonesPopup
    }

    function toggleZones(payload) {
      ctx.$emit("zonesFilterEmitEvt", payload)
      showZonesPopup()
    }
    return { ...toRefs(state), showZonesPopup, toggleZones }
  },
})
</script>

<style scoped lang="scss">
.zones-filter-wrap {
  position: relative;
  z-index: 102;
  width: 100%;
  height: 44px;
  padding: 0 15px;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 0 0 10px 10px;
  display: flex;
  align-items: center;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid transparent;
  &.up {
    box-shadow: none;
    border-radius: 0;
    border-bottom-color: #f2f2f2;
  }
  .current-zones {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    .name {
      max-width: 100%;
      font-size: 16px;
      font-weight: 600;
      color: #000;
      padding: 0 5px;
      @include ellipsis;
    }
    .icon-xia {
      color: $color-666;
    }
  }
}
.filters-popup-comp {
  top: 88px;
  z-index: 101 !important;
  border-radius: 0px 0px 10px 10px;
  padding: 0 15px;
  max-height: 70%;
  .list-wrap {
    background-color: #fff;
    width: 100%;
    padding: 15px 0 10px 0;
    overflow: hidden;
    .list-item {
      float: left;
      width: 109px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      background: $color-bg;
      border-radius: 20px;
      font-size: 12px;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      color: $color-666;
      margin: 0 8px 6px 0;
      &.active {
        background-color: $color-brand;
        color: #fff;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
</style>

