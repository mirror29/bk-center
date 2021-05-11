<template>
  <div class="sx-zone">
    <ul class="sx-books">
      <li
        :class="['sx-book-item', item.value == sxZone.value ? 'active' : '']"
        v-for="item in sxZone.options"
        :key="item.value"
        @click="toggleSxBooks(item)"
      >
        {{ item.name }}
      </li>
    </ul>
    <img
      v-if="sxZone.options.length > 4"
      src="../../static/images/@2x/bkc/shadow.png"
      class="shadow"
    />
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  getCurrentInstance,
} from "vue"
import { useRoute, useRouter } from "vue-router"
import { dataFilters ,userCourseInfo} from "../apis/api"

export default defineComponent({
  props: {
    sxZone: {
      type: Object,
      required: true,
    },
  },

  setup: (props, context) => {
    const state: any = reactive({
      book_id: "",
      courseInfo: {
        stage: {
          name: "小学",
          value: 1,
        },
        subject: {
          name: "语文",
          value: 2,
        },
        version: {
          name: "人教部编版",
          value: 141764,
        },
        book: {
          name: "一年级下册",
          value: 128314,
        },
      },
    })

    const { ctx } = getCurrentInstance()
    const route = useRoute()
    state.book_id = route.query.book_id || ""

    onMounted(() => {
      checkCourseInfo()
    })

    async function getCourseInfoByQueryBook(book_id) {
      let res = await dataFilters({
        _keys: "stage,subject,version,book",
        book: book_id,
      })

      if (res.status === 200) {
        let tempObj = ctx.$utils.getCurrentValue(res.data.data)
        return tempObj.courseInfo
      }
    }

    async function checkCourseInfo() {
      let tempCourseInfo = ctx.$utils.getSto("bkc_global_course_info")
      if (tempCourseInfo) {
        Object.assign(state.courseInfo, tempCourseInfo)
      } else {
        // 本地没有，可能是分享链接的情况，根据url上的参数book_id解析出来
        if (state.book_id) {
          let tempCourseInfo = await getCourseInfoByQueryBook(state.book_id)
          Object.assign(state.courseInfo, tempCourseInfo)
        }
      }
      // 如果登录了，则优先级比url的优先级高，需覆盖
      let token = ctx.$cookies.get("access_token") || null
      if (token) {
        let res = await userCourseInfo()
        if (res.data.code === 200) {
          Object.assign(state.courseInfo, res.data.data)
        }
      }

      ctx.$utils.setSto({
        key: "bkc_global_course_info",
        val: state.courseInfo,
      })
      ctx.$emit("sxZonesEmitEvt")
    }

    function toggleSxBooks(payload:any) {
      ctx.$emit("sxZonesEmitEvt", payload)
    }

    return {
      ...toRefs(state),
      toggleSxBooks
    }
  },
})
</script>

<style scoped lang="scss">
.sx-zone {
  position: relative;
  width: 100%;
  height: 44px;
  background-color: #fff;
  overflow: hidden;
  padding-right: 10px;
  .shadow {
    position: absolute;
    right: 10px;
    top: 0;
    height: 44px;
  }
  .sx-books {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
    .sx-book-item {
      white-space: nowrap;
      display: inline-block;
      border-radius: 14px;
      background-color: #f2f2f2;
      font-size: 14px;
      color: $color-666;
      height: 28px;
      line-height: 28px;
      padding: 0 10px;
      & + .sx-book-item {
        margin-left: 10px;
      }
      &.active {
        color: #fff;
        background-color: $color-brand;
      }
    }
  }
}
</style>
