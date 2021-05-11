<template>
  <div class="filters-comp-wrap">
    <div class="label">教材：</div>
    <div
      class="filter-trigger"
      :class="filterPopup ? 'after-up' : ''"
      @click="showFiltersModal"
    >
      <div class="filter-text">
        {{ courseInfo.stage.name }}<em>·</em>{{ courseInfo.subject.name
        }}<em>·</em>{{ courseInfo.version.name }}<em>·</em
        >{{ courseInfo.book.name }}
      </div>
    </div>
    <van-popup
      class="filters-popup-comp"
      v-model:show="filterPopup"
      position="top"
      :overlay-style="{ top: '44px', zIndex: 100 }"
      teleport="body"
      v-if="filterList[0].length"
      @close="filterPopup = false"
    >
      <ul class="filters-tabs">
        <li
          v-for="(tab, index) in filtersData"
          :key="index"
          :class="['tab-item', active == index ? 'active' : '']"
          @click="tabChange(index)"
        >
          <div class="tab-name">{{ tab.label }}</div>
        </li>
      </ul>
      <div class="filters-content">
        <template v-if="active == 0">
          <ul class="stage-list">
            <li
              v-for="(item, index) in filterList[active]"
              :key="index"
              :class="['stage-list-item', item.toggle ? 'border-none' : '']"
            >
              <div
                class="list-item-bar"
                @click="toggleStage(filterList[active], item)"
              >
                <span class="text">{{ item.stage.name }}</span>
                <i
                  class="iconfont"
                  :class="item.toggle ? 'icon-shang icon-active' : 'icon-xia'"
                ></i>
              </div>
              <ul class="list-wrap" v-show="item.toggle">
                <li
                  v-for="(subject, index) in item.subjects"
                  :key="index"
                  :class="[
                    'list-item',
                    subject.stage_value == filtersData[active].stage_value &&
                    subject.value == filtersData[active].subject_value
                      ? 'active'
                      : '',
                  ]"
                  @click="
                    getFiltesContent('version', filtersData[active], subject)
                  "
                >
                  {{ subject.name }}
                </li>
              </ul>
            </li>
          </ul>
        </template>
        <template v-else>
          <ul class="list-wrap version-book">
            <li
              v-for="(item, index) in filterList[active]"
              :key="index"
              :class="[
                'list-item',
                item.value == filtersData[active].value ? 'active' : '',
              ]"
              @click="
                active == 1
                  ? getFiltesContent('book', filtersData[active], item)
                  : searchData(filtersData[active], item)
              "
            >
              {{ item.name }}
            </li>
          </ul>
        </template>
      </div>
    </van-popup>
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
import { Toast } from "vant"
import {
  userCourseInfo,
  dataFilters,
  subjectsData,
  saveUserCourseInfo,
} from "../apis/api"

export default defineComponent({
  name: "Filters",
  emits: ["click"],
  props: {
    // courseInfo: {
    //   type: Object,
    //   required: true,
    // },
  },
  setup: (props, context) => {
    const { ctx } = getCurrentInstance() //获取上下文实例，ctx=vue2的this
    const state: any = reactive({
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
      filtersData: [
        {
          label: "学段学科",
          stage_value: "",
          subject_value: "",
        },
        {
          label: "教材版本",
          value: "",
        },
        {
          label: "册别",
          value: "",
        },
      ],
      filterList: {
        0: [],
        1: [],
        2: [],
      },
      active: 0,
    })
    // let book_id:any = ref('');
    let filterPopup = ref(false)

    const route = useRoute()
    let book_id = route.query.book_id || ""

    onMounted(() => {
      checkCourseInfo()
    })

    async function checkCourseInfo() {
      // 先从localStorage获取课程信息
      let tempCourseInfo = ctx.$utils.getSto("bkc_global_course_info")
      if (tempCourseInfo) {
        Object.assign(state.courseInfo, tempCourseInfo)
      } else {
        // 本地没有，可能是分享链接的情况，根据url上的参数book_id解析出来
        if (book_id) {
          let tempCourseInfo = await getCourseInfoByQueryBook(book_id)
          Object.assign(state.courseInfo, tempCourseInfo)
        }
      }
      // 如果登录了，则优先级比url的优先级高，需覆盖
      let token = ctx.$cookies.get("access_token") || null
      if (token) {
        let res: any = await userCourseInfo()
        if (res.code === 200) {
          Object.assign(state.courseInfo, res.data)
        }
      }
      // 如果以上条件都没执行到，则显示默认值，同时下拉让用户选择
      if (!tempCourseInfo && state.courseInfo.book.value == 128314) {
        filterPopup.value = true
      }
      setCourseInfo()
      getFiltersData()
      // 获取到课程信息
      if (!filterPopup.value) {
        state.filtersData[0].label =
          state.courseInfo.stage.name + state.courseInfo.subject.name
        state.filtersData[0].stage_value = state.courseInfo.stage.value
        state.filtersData[0].subject_value = state.courseInfo.subject.value
        state.filtersData[1].value = state.courseInfo.version.value
        state.filtersData[1].label = state.courseInfo.version.name
        state.filtersData[2].value = state.courseInfo.book.value
        state.filtersData[2].label = state.courseInfo.book.name
      }
    }

    async function getCourseInfoByQueryBook(book_id: any) {
      let res = await dataFilters({
        _keys: "stage,subject,version,book",
        book: book_id,
      })

      // if (res.status === 200) {
      let tempObj = ctx.$utils.getCurrentValue(res.data.data)
      return tempObj.courseInfo
      // }
    }

    async function getFiltersData() {
      let filterParams = {
        _keys: "version,book",
        book: state.courseInfo.book.value,
      }

      const { data } = await subjectsData()
      let tempArr: Array<any> = []
      Object.keys(data).forEach((key) => {
        let stageItem = {
          toggle: data[key][0].stage_id == state.courseInfo.stage.value,
          stage: {
            name: data[key][0].stage_name,
            value: data[key][0].stage_id,
          },
          subjects: [],
        }
        stageItem.subjects = data[key].map((item: any) => {
          return {
            name: item.subject_name,
            value: item.subject_id,
            stage_value: item.stage_id,
            stage_name: item.stage_name,
          }
        })
        tempArr.push(stageItem)
      })
      state.filterList[0] = tempArr

      let res = await dataFilters(filterParams)
      res.data.forEach((item: any) => {
        switch (item.class) {
          case "version":
            state.filterList[1] = item.options
            break
          case "book":
            state.filterList[2] = item.options
            break
        }
      })
    }

    async function getFiltesContent(_keys: string, activeData: any, row: any) {
      let filterParams: any = {
        _keys,
      }
      switch (_keys) {
        case "version":
          filterParams.stage = activeData.stage_value = row.stage_value
          filterParams.subject = activeData.subject_value = row.value
          activeData.label = row.stage_name + row.name
          break
        case "book":
          filterParams.version = activeData.value = row.value
          activeData.label = row.name
          break
      }
      let res = await dataFilters(filterParams)
      let data = res.data[0].options
      if (_keys == "version") {
        state.active = 1
        state.filtersData[state.active].label = "教材版本"
        state.filtersData[state.active].value = ""
        state.filtersData[state.active + 1].label = "册别"
        state.filtersData[state.active + 1].value = ""
        state.filterList[state.active] = data
      } else {
        state.active = 2
        state.filtersData[state.active].label = "册别"
        state.filtersData[state.active].value = ""
        state.filterList[state.active] = data
      }
    }
    async function saveCourseInfo() {
      let tokenInClient = ctx.$cookies.get("access_token") || null
      if (tokenInClient) {
        let res = await saveUserCourseInfo({
          book_id: state.courseInfo.book.value,
        })
      }
    }

    function setCourseInfo() {
      context.emit("childEmitEvt", state.courseInfo)
      ctx.$utils.setSto({
        key: "bkc_global_course_info",
        val: state.courseInfo,
      })
    }

    function searchData(activeData: any, row: any) {
      activeData.label = row.name
      activeData.value = row.value
      let subjectItem = state.filterList[0]
        .find((item: any) => {
          return item.toggle
        })
        .subjects.find((subject: any) => {
          return subject.value == state.filtersData[0].subject_value
        })
      let courseInfo = {
        stage: {
          name: subjectItem.stage_name,
          value: subjectItem.stage_value,
        },
        subject: {
          name: subjectItem.name,
          value: subjectItem.value,
        },
        version: {
          name: state.filtersData[1].label,
          value: state.filtersData[1].value,
        },
        book: {
          name: state.filtersData[2].label,
          value: state.filtersData[2].value,
        },
      }
      filterPopup.value = false
      state.courseInfo = courseInfo
      sessionStorage.clear() // 清空缓存页面
      saveCourseInfo()
      setCourseInfo()
    }

    function tabChange(i: number) {
      let tabInfo = state.filtersData[i - 1]
      switch (i) {
        case 1:
          if (!tabInfo.subject_value) {
            Toast("请选择学段学科")
            return false
          }
          break
        case 2:
          if (!tabInfo.value) {
            Toast("请选择版本")
            return false
          }
          break
      }
      state.active = i
    }

    function toggleStage(list: any, row: any) {
      if (row.toggle) {
        return (row.toggle = false)
      } else {
        list.map((item: any) => {
          item.toggle = false
        })
        row.toggle = true
      }
    }
    const showFiltersModal = () => {
      filterPopup.value = !filterPopup.value
      if (ctx.$parent.$refs["chapters-filter"]) {
        ctx.$parent.$refs["chapters-filter"].chaptersPopup = false // 收起章节筛选弹窗
      }
      if (ctx.$parent.$refs["zones-filter"]) {
        ctx.$parent.$refs["zones-filter"].zonesPopup = false // 收起章节筛选弹窗
      }
    }

    return {
      ...toRefs(state),
      filterPopup,
      searchData,
      showFiltersModal,
      getFiltesContent,
      tabChange,
      toggleStage,
    }
  },
})
</script>

<style scoped lang="scss">
.filters-comp-wrap {
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  height: 100%;
  background: $color-bg;
  .label {
    width: 50px;
    flex-shrink: 0;
    font-size: 16px;
    color: $color-666;
  }
  .filter-trigger {
    display: flex;
    align-items: center;
    max-width: calc(100% - 50px);
    .filter-text {
      width: 100%;
      font-size: 16px;
      color: $color-333;
      font-weight: 600;
      max-width: 95%;
      @include ellipsis;
      em {
        padding: 0 3px;
      }
    }
    &:after {
      content: "";
      width: 0;
      height: 0;
      margin: 10px 0 0 5px;
      border-width: 5px;
      border-style: solid;
      border-color: #000 transparent transparent transparent;
    }
    &.after-up:after {
      border-color: transparent transparent #000 transparent;
      margin-top: -2px;
    }
  }
}
.filters-popup-comp {
  top: 44px;
  z-index: 103 !important;
  border-radius: 0px 0px 10px 10px;
  .filters-tabs {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 16px;
    border-bottom: 1px solid #f2f2f2;
    .tab-item {
      position: relative;
      flex: 1;
      height: 44px;
      line-height: 44px;
      .tab-name {
        text-align: center;
        font-size: 14px;
        color: $color-666;
        margin: 0 auto;
        width: 90%;
        @include ellipsis;
      }
      &::before {
        position: absolute;
        bottom: 0;
        left: 50%;
        margin-left: -11px;
        right: -2px;
        content: "";
        width: 22px;
        height: 2px;
        background-color: transparent;
        border-radius: 2px;
      }
      &::after {
        position: absolute;
        right: -1px;
        top: 50%;
        margin-top: -2px;
        content: "";
        width: 4px;
        height: 4px;
        background-color: #ccc;
        border-radius: 50%;
      }
      &:last-child::after {
        width: 0;
      }
      &.active {
        .tab-name {
          color: $color-brand;
          font-weight: 600;
        }
        &::before {
          background-color: $color-brand;
        }
      }
    }
  }
  .filters-content {
    padding: 0 16px;
    .stage-list {
      width: 100%;
      padding: 5px 0;
      .stage-list-item {
        width: 100%;
        &:not(:last-of-type) {
          @include border-bottom;
        }
        &.border-none::before {
          border-bottom: none;
        }
        .list-item-bar {
          height: 44px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .iconfont {
            color: #999;
            &.icon-active {
              color: $color-brand;
            }
          }
          .text {
            width: 90%;
            font-size: 14px;
            color: $color-333;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            white-space: nowrap;
          }
        }
      }
    }
    .list-wrap {
      background-color: #fff;
      width: 100%;
      overflow: hidden;
      &.version-book {
        padding: 15px 0 10px 0;
      }
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
}
</style>
