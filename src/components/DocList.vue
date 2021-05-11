<template>
  <a :herf="`/doc-${item.id}.html`" class="link">
    <h3 class="title">
      <span
        class="good"
        v-if="
          $utils.catchNull(item, 'rank', 0) === 2 ||
          $utils.catchNull(item, 'rank', 0) === 4
        "
        >[精]</span
      >
      <span class="title">{{ item.title }}</span>
    </h3>
    <div class="scroll-view_H" v-if="item.type_name === '课件' && item.preview">
      <div
        class="scroll-view-item"
        v-for="(el, idx) in item.preview.slice(0, 3)"
        :key="idx"
      >
        <img :src="`${el}?x-oss-process=image/resize,m_fixed,w_226,h_150/`" />
      </div>
    </div>
    <div class="foot">
      <span :class="item.file_type" class="fileType" />
      <p class="type">
        {{ item.type_name === "课件" ? "PPT课件" : item.type_name }}
      </p>
      <p>{{ item.display_date }}</p>
      <p>{{ item.download_num }}次下载</p>
      <p v-if="item.point > 0">{{ item.point }}学贝</p>
      <p class="is-free" v-else>免费</p>
    </div>
  </a>
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
  name: "DocList",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup: (props, context) => {},
})
</script>

<style scoped lang="scss">
.link {
  h3 {
    font-size: 16px;
    color: #000;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-weight: normal;
    .good {
      color: #f60;
      margin-right: 4px;
    }
  }
  &:visited h3 {
    color: #999 !important;
  }
  .scroll-view_H {
    margin-top: 10px;
    white-space: nowrap;
    overflow-x: auto;
    &::-webkit-scrollbar {
      //隐藏滚动条
      display: none;
    }
    .scroll-view-item {
      display: inline-block;
      border: 1px solid #f2f2f2;
      width: 113px;
      height: 75px;
      overflow: hidden;
      &:nth-child(1) {
        border-radius: 6px 0px 0px 6px;
      }
      &:nth-child(3) {
        border-radius: 0px 6px 6px 0px;
      }
      & + .scroll-view-item {
        margin-left: 2px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .foot {
    margin-top: 8px;
    display: flex;
    align-items: center;
    .item-img {
      width: 10px;
      height: 12px;
      margin-right: 5px;
    }
    .is-free {
      color: #14b926;
    }
    p {
      font-size: 12px;
      color: #999;
      line-height: 1.4;
      margin-left: 5px;
      & + p {
        margin-left: 10px;
      }
    }
  }
}
</style>
