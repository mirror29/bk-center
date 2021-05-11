<template>
  <div class="file-empty-box">
    <div v-if="load" class="list-load">
      <van-loading color="#1989fa" type="spinner" />
      <p>加载中，请稍后</p>
    </div>
    <div v-if="!load && finished">
      <div class="icon">
        <img src="../../static/images/@2x/search@2x.png" width="48" alt="" />
      </div>
      <p class="no-tips">未找到相关结果</p>
      <p class="tips">
        请尝试更换册别/章节筛选或关注<span class="jx-wx-account"
          >“教习网”微信公众号</span
        >告诉我们您想要的资料，我们会尽快上传
      </p>
    </div>
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
  name: "listEmpty",
  props: {
    load: {
      type: Boolean,
      required: true,
    },
    finished: {
      type: Boolean,
      required: true,
    },
  },

  setup: (props, context) => {},
})
</script>

<style scoped lang="scss">
.file-empty-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 420px;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 0 0 10px 10px;
  .list-load {
    margin-top: 30px;
  }
  .icon {
    width: 100%;
    text-align: center;
    padding-top: 80px;
  }

  p {
    text-align: center;
    font-weight: normal;
  }

  .no-tips {
    font-size: 14px;
    color: #000;
    margin: 10px 0;
  }
  .tips {
    text-align: left;
    color: #999;
    font-size: 12px;
    margin: 0 auto 5px;
    text-align: center;
    width: 300px;
    line-height: 20px;
    .jx-wx-account {
      color: #2b99ff;
    }
    &.last {
      padding-left: 10px;
    }
  }
}
</style>

<script>
export default {
  props: ["load", "finished"],
  data() {
    return {}
  },
}
</script>
