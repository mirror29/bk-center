<template>
  <div id="index-container">
    <div class="filters-wrap">
      <Filters
        ref="filters"
        :courseInfo="courseInfo"
        @childEmitEvt="childEmitEvt"
      />
    </div>
    <main class="main">
      <!-- 搜索 -->
      <a class="search" to="/search">
        <i class="iconfont icon-sousuo"></i>
        <span class="text">搜索备课资料</span>
      </a>
      <!-- 轮播 -->
      <section class="swipe">
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item
            v-for="item in banners"
            :key="item.id"
            @click="bannersRedirect(item.redirec_url)"
          >
            <a :data-url="item.redirec_url">
              <img
                :src="`${item.cdn_url}?x-oss-process=image/resize,w_750/`"
                :alt="item.name"
                :title="item.name"
                class="swipe-img"
              />
            </a>
          </van-swipe-item>
        </van-swipe>
      </section>
      <!-- 浏览记录 -->
      <section class="view-history" v-if="historyInfo" @click="clearPageCache">
        <div class="label">最近浏览：</div>
        <div class="inner">
          <a :href="historyInfo.link" class="view-info">{{
            historyInfo.name
          }}</a>
          <a :href="historyInfo.link" class="link">继续</a>
        </div>
      </section>
      <!-- 导航 -->
      <section class="subject">
        <ul class="subject-list">
          <li
            v-for="(item, index) in navs"
            :key="index"
            :class="['subject-item', `subject-item-${item.value}`]"
          >
            <a
              :href="`${item.url}?book_id=${
                courseInfo && courseInfo.book && courseInfo.book.value
              }&type_id=${item.value}`"
              class="item-link"
            >
              <span class="subject-name">{{ item.name }}</span>
            </a>
          </li>
          <li class="subject-item albums">
            <div class="item-link" @click="toAlbums">
              <span class="subject-name">成套</span>
              <img
                src="../../assets/img/hot.png"
                width="20"
                height="12"
                class="hot"
              />
            </div>
          </li>
        </ul>
      </section>
      <!-- 专区 -->
      <section class="list-block zone" v-if="zones.length">
        <div class="common-title">
          <span class="title-icon">
            <span class="title-icon-inner left"></span>
          </span>
          <h2 class="text">试卷试题</h2>
          <span class="title-icon">
            <span class="title-icon-inner right"></span>
          </span>
        </div>
        <ul class="zone-list">
          <li
            v-for="(item, index) in zones"
            :key="index"
            class="list-item"
            :class="{ [zonesTotal]: true }"
          >
            <a
              :href="`${
                [8, 10, 99].includes(item.zone_type)
                  ? `/#/list?book_id=${
                      courseInfo && courseInfo.book && courseInfo.book.value
                    }&zone_type=${item.zone_type}&sx_version_id=${
                      item.version_id
                    }`
                  : `/#/list?book_id=${
                      courseInfo && courseInfo.book && courseInfo.book.value
                    }&zone_type=${item.zone_type}`
              }`"
            >
              <span class="zone-name">{{ item.version_name }}</span>
            </a>
          </li>
        </ul>
      </section>
      <!-- 升学专区 -->
      <section class="list-block zone" v-if="entry_zone.info">
        <div class="common-title">
          <span class="title-icon">
            <span class="title-icon-inner left"></span>
          </span>
          <h2 class="text">{{ entry_zone.info.version_name }}</h2>
          <span class="title-icon">
            <span class="title-icon-inner right"></span>
          </span>
        </div>
        <ul class="zone-list">
          <li
            v-for="(item, index) in entry_zone.books"
            :key="index"
            class="list-item"
            :class="{ [sxZonesTotal]: true }"
          >
            <a
              :href="`/#/list?book_id=${
                courseInfo && courseInfo.book && courseInfo.book.value
              }&zone_type=4&sx_version_id=${
                entry_zone.info.version_id
              }&zone_type_book_id=${item.book_id}`"
            >
              <span class="zone-name">{{ item.book_name }}</span>
            </a>
          </li>
        </ul>
      </section>
      <!-- 推荐专辑 -->
      <section class="list-block album" v-if="albumList.length">
        <div class="common-title">
          <span class="title-icon">
            <span class="title-icon-inner left"></span>
          </span>
          <h2 class="text">精品专辑</h2>
          <span class="title-icon">
            <span class="title-icon-inner right"></span>
          </span>
        </div>
        <ul class="album-list">
          <li
            v-for="(item, index) in albumList"
            :key="index"
            class="album-item"
          >
            <a :href="`/album-${item.id}.html`">
              <h2
                class="title"
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                "
              >
                {{ item.title }}
              </h2>
              <div class="download">{{ item.created_at }}</div>
            </a>
          </li>
        </ul>
      </section>
      <!-- 精品资料 -->
      <section class="list-block resources">
        <div class="common-title">
          <span class="title-icon">
            <span class="title-icon-inner left"></span>
          </span>
          <h2 class="text">精品资料</h2>
          <span class="title-icon">
            <span class="title-icon-inner right"></span>
          </span>
        </div>
        <van-tabs
          v-model="active"
          color="#2b99ff"
          title-inactive-color="#333"
          title-active-color="#2b99ff"
          :swipe-threshold="best.length"
          animated
        >
          <van-tab
            v-for="(item, index) in best"
            :title="item.name"
            :key="index"
          >
            <ul class="data-list clearfix">
              <li class="data-item" v-for="i in item.documents" :key="i.id">
                <a
                  :href="item.key == 'zt' ? `/zt/${i.id}/` : `/doc-${i.id}.html`"
                >
                  <span :class="i.file_type" class="fileType" />

                  <span style="line-height: 22px">{{ i.title }}</span>
                </a>
              </li>
            </ul>
          </van-tab>
        </van-tabs>
      </section>
      <FooterLogo />
    </main>
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
  watch,
} from "vue"
import { useRoute, useRouter } from "vue-router"
import Filters from "../../components/Filters.vue"
import FooterLogo from "../../components/FooterLogo.vue"
import { bkcIndexData } from "../../apis/api"

export default defineComponent({
  components: {
    Filters,
    FooterLogo,
  },

  setup: () => {
    const { ctx } = getCurrentInstance()
    const state = reactive({
      active: 0,
      zonesTotal: "",
      sxZonesTotal: "",
      courseInfo: {
        book: {
          value: "",
        },
      },
      banners: [],
      best: [{}],
      entry_zone: {
        books: [],
        info: {},
      },
      navs: [
        {
          name: "课件",
          value: 3,
          url: "/#/list",
        },
        {
          name: "教案",
          value: 8,
          url: "/#/list",
        },
        {
          name: "练习",
          value: 7,
          url: "/#/list",
        },
        {
          name: "学案",
          value: 4,
          url: "/#/list",
        },
      ],
      zones: [],
      albumList: [],
      historyInfo: null,
    })

    const route = useRoute()
    const router = useRouter()
    // @ts-ignore
    state.courseInfo.book.value = route.query.book_id || ""

    onMounted(() => {
      getIndexData()
    })

    watch(state.zones,(val) => {
      console.log(val)
      if (val) {
          let len = val.length,
            clsName = null
          if (len <= 4) {
            clsName = 'max4'
          } else if (4 < len && len <= 8) {
            clsName = 'max8'
          } else if (8 < len && len <= 12) {
            clsName = 'max12'
          } else if (12 < len && len <= 16) {
            clsName = 'max16'
          } else {
            clsName = 'maxMoreThan16'
          }
          state.sxZonesTotal = clsName
        }
    })

    watch(state.entry_zone.books,(val) => {
      if (val) {
          let len = val.length,
            clsName = null
          if (len <= 4) {
            clsName = 'max4'
          } else if (4 < len && len <= 8) {
            clsName = 'max8'
          } else if (8 < len && len <= 12) {
            clsName = 'max12'
          } else if (12 < len && len <= 16) {
            clsName = 'max16'
          } else {
            clsName = 'maxMoreThan16'
          }
          state.sxZonesTotal = clsName
        }
    })

    async function getIndexData() {
      ctx.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      })
      let res: any = await bkcIndexData(state.courseInfo.book.value)
      ctx.$toast.clear()
      if (res.code == 200) {
        let resp = res.data
        state.banners = resp.banners
        state.zones = resp.statistics
        state.albumList = resp.albums
        state.best = resp.docs
        state.entry_zone = resp.entry_zone
        // 组合专题
        let ztObj = {
          key: "zt",
          name: "专题",
          documents: resp.tags,
        }
        state.best.push(ztObj)
      }
    }

    function clearPageCache() {
      sessionStorage.clear()
      // 如果当前册别id和章节历史记录的册别id不一致，则需要重置学段学科版本册别的筛选值
      let book = ctx.$utils.getUrlKey(state.historyInfo.link, 'book_id')
      if (state.courseInfo.book.value != book) {
        localStorage.removeItem('bkc_global_course_info')
      }
    }

    function childEmitEvt(payload: any) {
      state.courseInfo = payload
      let pageCache = ctx.$utils.getSessionSto(ctx.$options.name)
      ctx.$utils.changeQueryParams(route.query, {
        book_id: state.courseInfo.book.value,
      },router)
      if (!pageCache) {
        getIndexData()
      } else {
        Object.assign(state, pageCache)
      }
      getHistoryInfo()
    }

    function getHistoryInfo() {
      let historyInfo = ctx.$utils.getSto('CHAPTER_HISTORY')
      state.historyInfo = historyInfo || null
    }

    return {
      ...toRefs(state),
      childEmitEvt,
    }
  },
})
</script>

<style scoped lang="scss">
#index-container {
  padding: 44px 0 50px;
  width: 100%;
  min-height: 100%;
  background: $color-bg;
  .filters-wrap {
    position: fixed;
    top: 0px;
    left: 0;
    z-index: 104;
    width: 100%;
    height: 44px;
  }
  .main {
    padding: 0 16px;
    .search {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 36px;
      text-align: center;
      background: #eee;
      border-radius: 20px;
      color: $color-999;
      margin: 6px 0 10px 0;
      i {
        margin-right: 5px;
      }
      .search-icon {
        display: inline-block;
        font-size: 16px;
        margin-right: 5px;
      }
      .text {
        font-size: 14px;
        line-height: 16px;
      }
    }
    .swipe {
      width: 100%;
      margin-bottom: 10px;
      .swipe-img {
        width: 100%;
      }
      .van-swipe {
        border-radius: 6px;
        overflow: hidden;
        transform: translateY(0);
      }
    }
    .subject {
      padding: 10px 0;
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      margin-bottom: 16px;
      .subject-list {
        @include wh100;
        display: flex;
        flex-wrap: wrap;
        .subject-item {
          flex: 1;
          background-repeat: no-repeat !important;
          background-position-x: center;
          background-clip: content-box;
          background-size: 44px 44px;
          &.subject-item-3 {
            background-image: url("../../assets/img/tb_3.png");
          }
          &.subject-item-4 {
            background-image: url("../../assets/img/tb_4.png");
          }
          &.subject-item-7 {
            background-image: url("../../assets/img/tb_7.png");
          }
          &.subject-item-8 {
            background-image: url("../../assets/img/tb_8.png");
          }
          &.albums {
            background-image: url("../../assets/img/albums.png");
          }
          .item-link {
            position: relative;
            @include wh100;
            display: block;
            padding-top: 48px;
            text-align: center;
            font-size: 12px;
            color: #333;
            text-decoration: none;
            .subject-name {
              height: 100%;
              line-height: 20px;
            }
            .hot {
              position: absolute;
              right: 5px;
              top: 0;
            }
          }
        }
      }
    }
    .view-history {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      background-color: #fef7ec;
      border-radius: 10px;
      margin: 10px 0;
      padding: 0 10px;
      font-size: 14px;
      .label {
        width: 73px;
        color: $color-666;
        flex-shrink: 0;
      }
      .inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: calc(100% - 73px);
        .view-info {
          max-width: 85%;
          @include ellipsis;
          color: $color-333;
        }
      }
      .link {
        width: 40px;
        position: relative;
        &::after {
          position: absolute;
          top: 50%;
          right: -3px;
          transform: translateY(-50%);
          content: "";
          width: 0;
          height: 0;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent transparent $color-brand;
        }
      }
    }
    .list-block {
      width: 100%;
      margin-bottom: 16px;
      .common-title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        .title-icon {
          position: relative;
          width: 10px;
          height: 10px;
          background: rgba(25, 125, 224, 1);
          opacity: 0.5;
          border-radius: 50%;
          .title-icon-inner {
            position: absolute;
            width: 6px;
            height: 6px;
            background: rgba(165, 224, 90, 1);
            opacity: 1;
            border-radius: 50%;
            &.left {
              transform: translate(-50%, 40%);
            }
            &.right {
              transform: translate(100%, 40%);
            }
          }
        }
        .text {
          font-size: 16px;
          line-height: 22px;
          color: #000;
          font-weight: 600;
          padding: 0 7px;
        }
      }
    }
    .zone {
      width: 100%;
      .zone-list {
        border-radius: 10px;
        background-color: #fff;
        width: 100%;
        display: flex;
        flex-flow: wrap;
        .list-item {
          position: relative;
          width: 25%;
          padding: 4px 0;
          &.max4:after {
            height: 0;
          }
          &.max8 {
            &:nth-child(n + 5):nth-child(-n + 8):after {
              height: 0;
            }
          }
          &.max12 {
            &:nth-child(n + 9):nth-child(-n + 12):after {
              height: 0;
            }
          }
          &.max16 {
            &:nth-child(n + 13):nth-child(-n + 16):after {
              height: 0;
            }
          }
          &.maxMoreThan16 {
            &:nth-child(n + 17):nth-child(-n + 20):after {
              height: 0;
            }
          }
          &:nth-child(4n) {
            a {
              border-right: none;
            }
          }
          &:after {
            position: absolute;
            bottom: 0;
            content: "";
            width: calc(100% - 8px);
            height: 1px;
            background-color: #f2f2f2;
            transform: translateX(4px);
          }
          a {
            width: 100%;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            border-right: 1px solid #f2f2f2;
            .zone-name {
              font-size: 14px;
              line-height: 20px;
              color: #000;
              font-weight: 400;
            }
            .zone-total {
              font-size: 12px;
              line-height: 17px;
              color: $color-999;
            }
          }
        }
      }
    }
    .album {
      width: 100%;
      .album-list {
        width: 100%;
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
        .album-item {
          width: 48.5%;
          height: 80px;
          padding: 8px;
          background-size: 100%;
          background-repeat: no-repeat;
          &:nth-child(1) {
            background-image: url("./assets/img/album_bg_01@2x.png");
            margin-bottom: 10px;
          }
          &:nth-child(2) {
            background-image: url("./assets/img/album_bg_02@2x.png");
            margin-bottom: 10px;
          }
          &:nth-child(3) {
            background-image: url("./assets/img/album_bg_03@2x.png");
          }
          &:nth-child(4) {
            background-image: url("./assets/img/album_bg_04@2x.png");
          }
          a {
            display: block;
            width: 100%;
            height: 100%;
            .title {
              width: 100%;
              font-size: 14px;
              line-height: 20px;
              color: #000;
              margin-bottom: 6px;
              font-weight: normal;
            }
            .download {
              font-size: 12px;
              line-height: 17px;
              color: #9e9e9e;
            }
          }
        }
      }
    }
    .resources {
      width: 100%;
      .van-tabs {
        background-color: #fff;
        padding: 0 10px;
        border-radius: 10px;
        :deep .van-tabs__wrap {
          border-radius: 10px;
          position: inherit;
        }
      }
      .data-list {
        padding: 2px 0 10px;
        .data-item {
          float: left;
          height: 38px;
          width: 100%;
          a {
            @include wh100;
            padding: 10px 5px 0;
            display: block;
            line-height: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
            color: #000;
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>
