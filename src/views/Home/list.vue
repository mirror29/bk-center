<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mirror29
 * @LastEditors: mirror29
 * @LastEditTime: 2021-04-28 16:54:34
-->
<template>
  <div id="list-container">
    <!-- 导航栏 -->
    <div class="nav-wrap">
      <div class="nav-left" @click="back">
        <i class="iconfont icon-zuo"></i>
      </div>
      <div class="nav-filters">
        <Filters
          v-if="zone_type == 0 || !noDataZones.includes(zone_type)"
          ref="filters"
          :courseInfo="courseInfo"
          :isFiltersPopupShow="false"
          @childEmitEvt="childEmitEvt"
        />
        <div class="sx-zone-name" v-if="noDataZones.includes(zone_type)">
          {{ courseInfo && courseInfo.stage && courseInfo.stage.name
          }}{{ courseInfo && courseInfo.subject && courseInfo.subject.name
          }}{{ sxZone.name }}
        </div>
      </div>

      <div class="nav-right">
        <i class="iconfont icon-sousuo" @click="toSearch"></i>
        <i class="iconfont icon-zhuye home-icon" @click="redirectHome"></i>
      </div>
    </div>
    <div class="content" ref="contentWrap">
      <!-- 章节筛选 -->
      <chapters-filter
        v-if="zone_type == 0"
        ref="chapters-filter"
        :chapters="chapters"
        @chaptersFilterEmitEvt="chaptersFilterEmitEvt"
      />
      <!-- 专区筛选 -->
      <zones-filter
        v-if="zone_type != 0 && !noDataZones.includes(zone_type)"
        ref="zones-filter"
        :zones="zones"
        @zonesFilterEmitEvt="zonesFilterEmitEvt"
      />
      <!-- 升学专区筛选 -->
      <sx-zones
        v-if="noDataZones.includes(zone_type)"
        :sxZone="sxZone"
        @sxZonesEmitEvt="sxZonesEmitEvt"
      />
      <!-- 文档类型 -->
      <div class="document-type" :class="fixDocumentType ? 'fixed' : ''">
        <ul class="my-tabs">
          <li
            :class="['tab-item', type_id == tab.value ? 'active' : '']"
            v-for="(tab, index) in documentTypeList"
            :key="tab.value"
            @click="toggleDocumentType(index)"
          >
            {{ tab.name }}
          </li>
        </ul>
        <div class="right-filtes-wrap" @click="showRightPopup">
          <div class="border-warp">
            <van-icon name="filter-o" size="14px" color="#808080" />
            <span class="f-text">筛选</span>
          </div>
        </div>
      </div>
      <!-- 专辑 -->
      <div class="album-wrap" v-if="albumList.length">
        <div class="tit">
          <img
            src="../../static/images/@2x/chengtao.png"
            width="57"
            height="19"
            alt="成套资源"
          />
          <nuxt-link
            :to="`/bkc/albums?book_id=${courseInfo.book.value}`"
            class="more"
            >更多<i class="iconfont icon-you"></i
          ></nuxt-link>
        </div>
        <ul>
          <li v-for="(item, index) in albumList" :key="index">
            <nuxt-link :to="`/album-${item.id}.html`">
              <span class="iconfont icon-huo fire-hot"></span>
              <div class="text-content">
                <h3 class="title">
                  {{ item.title }}
                </h3>
                <i class="iconfont icon-you"></i>
              </div>
            </nuxt-link>
          </li>
        </ul>
      </div>
      <!-- 列表部分 -->
      <div class="file-list-box">
        <van-list
          v-if="fileList.length > 0"
          v-model="loading"
          :finished="finished"
          finished-text="全部加载完啦~"
          @load="onLoad"
          :immediate-check="false"
          class="my-van-list"
        >
          <van-cell v-for="item in fileList" :key="item.id">
            <DocList :item="item" />
          </van-cell>
        </van-list>
        <EmptyTips
          v-if="fileList.length == 0"
          :load="load"
          :finished="finished"
        />
      </div>
      <FooterLogo />
    </div>
    <!-- 右部筛选 -->
    <van-popup
      v-model="rightPopup"
      class="list-right-popup"
      position="right"
      get-container="body"
      overlay-class="list-right-popup-mask"
      :style="{ height: '100%', width: '70%' }"
    >
      <div class="list-right-popup-content">
        <div class="filters-part">
          <div
            class="round-item"
            style="margin-right: 7px"
            :class="is_rank == 1 ? 'r-active' : ''"
            @click="filtersChecked(null, 'is_bount')"
          >
            精品资料
          </div>
          <div
            class="round-item"
            :class="is_free == 1 ? 'r-active' : ''"
            @click="filtersChecked(null, 'is_free')"
          >
            免费资料
          </div>
          <div
            class="round-item mg-none"
            v-if="zone_type != 0"
            :class="is_album == 1 ? 'r-active' : ''"
            @click="filtersChecked(null, 'is_album')"
          >
            成套资源
          </div>
        </div>
        <div class="filters-part">
          <p class="f-title"><span class="text">排序</span></p>
          <div
            class="round-item"
            v-for="item in sortList"
            :key="item.value"
            :class="order == item.value ? 'r-active' : ''"
            @click="filtersChecked(item, 'is_sort')"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="filters-part" v-if="zone_type != 0">
          <p class="f-title"><span class="text">年份</span></p>
          <ul class="area-list-wrap">
            <li class="w100">
              <span
                class="round-item"
                :class="year == 0 ? 'r-active' : ''"
                @click="filtersChecked({ name: '全部', value: 0 }, 'is_year')"
                >全部</span
              >
            </li>
            <li
              class="round-item"
              v-for="item in yearsList"
              :key="item.value"
              :class="year == item.value ? 'r-active' : ''"
              @click="filtersChecked(item, 'is_year')"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="filters-part">
          <p class="f-title">
            <span class="text">地区</span>
            <i
              class="iconfont"
              :class="allAreas ? 'icon-shang icon-active' : 'icon-xia'"
              @click="allAreas = !allAreas"
            ></i>
          </p>
          <ul
            class="area-list-wrap"
            :class="allAreas ? 'showAreas' : 'hideAreas'"
          >
            <li class="w100">
              <span
                class="round-item"
                :class="area_id == 0 ? 'r-active' : ''"
                @click="filtersChecked({ name: '全国', value: 0 }, 'is_area')"
                >全国</span
              >
            </li>
            <li
              class="round-item"
              v-for="item in areaList"
              :key="item.value"
              :class="area_id == item.value ? 'r-active' : ''"
              @click="filtersChecked(item, 'is_area')"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="operate-buttoms">
        <div class="btn reset" @click="btnClick('reset')">重置</div>
        <div class="btn comfirm" @click="btnClick('comfirm')">确定</div>
      </div>
    </van-popup>
    <!-- 返回顶部 -->
    <BackToTop :scroll="scroll" @backToTop="backToTop" />
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
import areaList from "../../utils/area"
import Filters from "../../components/Filters.vue"

export default defineComponent({
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  components: {
    Filters,
  },

  setup: (props, context) => {
    const { ctx } = getCurrentInstance()
    const state: any = reactive({
      initFlag: true,
      zonesInitFlag: true,
      noDataZones: [4, 8, 10, 99],
      courseInfo: {},
      zones: {
        name: "",
        value: 0,
        options: [],
      },
      chapters: {
        name: "",
        value: "",
        options: [],
        childs: [],
      },
      sxZone: {
        value: "",
        name: "",
        options: [],
      },
      order: "default",
      area_id: 0,
      fileList: [],
      albumList: [],
      documentTypeList: [
        { name: "全部", value: 0 },
        { name: "课件", value: 3 },
        { name: "教案", value: 8 },
        { name: "试卷", value: 7 },
        { name: "学案", value: 4 },
        { name: "视频", value: 12 },
        { name: "其他", value: 99 },
      ],
      areaList: [],
      is_rank: 0,
      is_free: 0,
      is_album: 0,
      sortList: [
        { name: "综合", value: "default" },
        { name: "最近更新", value: "newest" },
        { name: "最多下载", value: "download" },
      ],
      year: 0,
      yearsList: [],
      allAreas: false,
      rightPopup: false,
      chaptersPopup: false,
      page: 1,
      loading: false,
      finished: false,
      scroll: false,
      scrollTop: 0,
      fixDocumentType: false,
      load: false,
      historyInfo: {},
      zone_type: "",
      type_id: "",
      zone_type_book_id: "",
      sx_version_id: "",
      chapter_id: "",
    })
    const router = useRouter()

    state.areaList = areaList
    // 专区年份筛选
    if (state.zone_type != 0) {
      let year = new Date().getFullYear() + 1
      while (year >= 2014) {
        state.yearsList.push({ name: year, value: year })
        year--
      }
    }

    function back() {
      router.back()
    }

    function toSearch() {
      window.location.href = `${ctx.$BASE_URL}/search?type=-1`
    }
    return { ...toRefs(state), back, toSearch }
  },
})
</script>

<style scoped lang="scss">
#list-container {
  width: 100%;
  height: 100%;
  padding-top: 44px;
  .nav-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    z-index: 104;
    padding: 0 16px;
    background-color: #fff;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    .nav-left {
      padding-right: 10px;
      border-right: 1px solid #e2e2e2;
      .icon-zuo {
        font-size: 18px;
        color: $color-333;
        font-weight: 600;
      }
    }
    .sx-zone-name {
      padding-left: 10px;
      font-size: 14px;
      font-weight: 400;
      color: $color-333;
    }
    .nav-filters {
      width: 75%;
      .filters-comp-wrap {
        background-color: #fff;
        padding: 0 20px 0 10px;
      }
    }
    .nav-right {
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 18px;
      }
      .home-icon {
        margin-left: 20px;
      }
    }
  }
  .content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: $color-bg;

    .document-type {
      border-radius: 10px 10px 0 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid $color-bg;
      background-color: #fff;
      margin-top: 10px;
      overflow: hidden;
      &.fixed {
        position: fixed;
        top: 44px;
        left: 0;
        border-radius: 0;
        width: 100%;
        z-index: 999;
        margin-top: -1px;
        border-top: 1px solid #f6f6f6;
      }
      .my-tabs {
        display: flex;
        align-items: center;
        width: calc(100% - 60px);
        height: 44px;
        color: $color-333;
        .tab-item {
          position: relative;
          flex: 1;
          padding: 0 5px;
          line-height: 44px;
          text-align: center;
          box-sizing: border-box;
          cursor: pointer;
          font-size: 14px;
          &.active {
            color: $color-brand;
            font-weight: 500;
            &::after {
              position: absolute;
              z-index: 1;
              left: 50%;
              transform: translateX(-50%);
              bottom: 0;
              height: 3px;
              content: "";
              background-color: $color-brand;
              width: 36px;
              transition-duration: 0.3s;
              height: 2px;
              border-radius: 2px;
            }
          }
        }
      }
      .right-filtes-wrap {
        width: 60px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .border-warp {
          width: 100%;
          line-height: 14px;
          display: flex;
          font-size: 14px;
          align-items: center;
          justify-content: center;
          border-left: 1px solid #eee;
          .f-text {
            color: $color-333;
            margin-left: 2px;
            font-size: 13px;
          }
        }
      }
    }
    .file-list-box {
      width: 100%;
      -webkit-overflow-scrolling: touch;
      background-color: $color-bg;
      margin-top: 10px;
      .file-empty-box {
        margin-bottom: 60px;
      }
      .van-list__finished-text {
        color: $color-666;
      }
      .van-loading {
        margin: 0 auto;
      }
      .van-cell:not(:last-child)::after {
        border: none;
      }

      .van-cell {
        z-index: 0;
        border-radius: 10px;
        padding: 12px 10px;
        & + .van-cell {
          margin-top: 10px;
        }
      }

      .my-van-list {
        border-radius: 0 0 10px 10px;
        padding: 0 6px;
      }
    }
    .album-wrap {
      padding: 15px 12px 5px;
      margin: 10px 6px 0;
      background-color: #fff;
      border-radius: 10px;
      .tit {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .more {
          display: flex;
          align-items: center;
          color: #999;
          i {
            font-size: 14px;
          }
        }
      }
      ul {
        width: 100%;
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
        li {
          width: 100%;
          z-index: 1;
          & + li {
            @include border-top;
          }
          a {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 12px 0;
            .fire-hot {
              flex-shrink: 0;
              font-size: 20px;
              color: #f60;
            }
            .text-content {
              width: 100%;
              margin-left: 6px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .title {
                color: #000;
                line-height: 20px;
                font-weight: 500;
                font-size: 16px;
                margin-right: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
              }
              i {
                font-size: 14px;
                color: #999;
              }
            }
          }
        }
      }
    }
    .pagination {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 20px 15px;
      a {
        width: 165px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #666;
        text-align: center;
        border: 1px solid #eee;
        border-radius: 16px;
        background-color: #fff;
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}
.list-right-popup {
  border-radius: 10px 0px 0px 10px;
  background-color: $color-bg;
  overflow: hidden;
  .operate-buttoms {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #fff;
    border-radius: 0px 0px 0px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 10px;
    .btn {
      height: 30px;
      line-height: 30px;
      width: 48.5%;
      font-size: 12px;
      border-radius: 17px;
      text-align: center;
      &.reset {
        color: $color-333;
        border: 1px solid #f2f2f2;
      }
      &.comfirm {
        background: #2b99ff;
        color: #fff;
      }
    }
  }
  .list-right-popup-content {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow-y: scroll;
    padding-bottom: 50px;
  }
  .icon-active {
    color: $color-brand !important;
  }
  .filters-part {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fff;
    width: 100%;
    border-radius: 10px 0px 0px 10px;
    overflow: hidden;
    .f-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 10px;
      .text {
        line-height: 17px;
        font-size: 12px;
        color: $color-333;
      }
      .iconfont {
        color: $color-333;
      }
    }
    .area-list-wrap {
      overflow: hidden;
      width: 100%;
      &.showAreas {
        height: auto;
      }
      &.hideAreas {
        height: 155px;
      }
    }
  }
  .w100 {
    width: 100%;
    height: 26px;
    margin-bottom: 6px;
    .round-item {
      display: block;
      margin-bottom: 0;
    }
  }
  .round-item {
    font-size: 12px;
    float: left;
    width: 76px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 13px;
    background: rgba(242, 242, 242, 1);
    color: $color-666;
    margin-right: 7px;
    margin-bottom: 6px;
    border: 1px solid transparent;
    overflow: hidden;
    padding: 0 10px;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    &:nth-child(3n + 1) {
      margin-right: 0;
    }
    &.r-active {
      background: rgba(35, 184, 255, 0.1);
      border: 1px solid #2b99ff;
      color: $color-brand;
    }
    &.mg-none {
      margin-right: 0;
    }
  }
}
</style>
