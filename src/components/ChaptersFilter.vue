<template>
  <div :class="['chapters-filter-wrap', chaptersPopup ? 'up' : '']">
    <div :class="['chapter', 'prev', chapterIndex == 0 ? 'disabled' : '']" @click="toggleChapter('prev')">上一课</div>
    <div class="chapters-filters-comp-wrap">
      <div class="current-chapter" @click="showChaptersPopup">
        <div class="name">{{ chapters.name }}</div>
        <i v-if="chapters.name" :class="['iconfont', chaptersPopup ? 'icon-shang' : 'icon-xia']"></i>
      </div>
    </div>
    <div :class="['chapter', 'next', chapterIndex == chapters.childs && chapters.childs.length - 1 ? 'disabled' : '']" @click="toggleChapter('next')">
      下一课
    </div>
    <van-popup
      class="filters-popup-comp"
      v-model="chaptersPopup"
      position="top"
      :overlay-style="{ top: '88px', zIndex: 100 }"
      get-container="body"
      @close="chaptersPopup = false"
    >
      <ul class="chapters-wrap">
        <li v-for="chapter in chapters.options" :key="chapter.value" class="list-item" @click="chapterSelectedItem(chapters.options, chapter)">
          <div class="list-item-bar">
            <span class="text" :class="chapters.value == chapter.value ? 'icon-active' : ''">{{ chapter.name }}</span>
            <i
              v-if="chapter.children && chapter.children.length"
              class="iconfont"
              :class="chapter.toggle ? 'icon-shang icon-active' : 'icon-xia'"
            ></i>
            <i v-else class="iconfont icon-check" v-show="chapters.value == chapter.value"></i>
          </div>
          <ul class="chapter-level1-sub-content" v-if="chapter.children && chapter.children.length" v-show="chapter.toggle">
            <li
              class="sub-content-item"
              v-for="secondChilds in chapter.children"
              :key="secondChilds.value"
              @click.stop="chapterSelectedItem(chapter.children, secondChilds)"
            >
              <div class="list-item-bar">
                <span class="text" :class="chapters.value == secondChilds.value ? 'icon-active' : ''">{{ secondChilds.name }}</span>
                <i
                  v-if="secondChilds.children && secondChilds.children.length"
                  class="iconfont"
                  :class="secondChilds.toggle ? 'icon-shang icon-active' : 'icon-xia'"
                ></i>
                <i v-else class="iconfont icon-check" v-show="chapters.value == secondChilds.value"></i>
              </div>
              <ul class="chapter-level2-sub-content" v-if="secondChilds.children && secondChilds.children.length" v-show="secondChilds.toggle">
                <li
                  class="sub-content-item"
                  v-for="thirdChilds in secondChilds.children"
                  :key="thirdChilds.value"
                  @click.stop="chapterSelectedItem(secondChilds.children, thirdChilds)"
                >
                  <span class="text" :class="chapters.value == thirdChilds.value ? 'icon-active' : ''">• {{ thirdChilds.name }}</span>
                  <i class="iconfont icon-check" v-show="chapters.value == thirdChilds.value"></i>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'ChaptersFilter',
  props: ['chapters'],
  data() {
    return {
      chaptersPopup: false,
      chapterIndex: 0,
    }
  },
  watch: {
    chapters: {
      handler() {
        this.chapterIndex = this.chapters.childs.findIndex(item => {
          return item.value == this.chapters.value
        })
      },
      immediate: true,
    },
  },
  methods: {
    showChaptersPopup() {
      this.chaptersPopup = !this.chaptersPopup
    },
    chapterSelectedItem(rowList, row) {
      if (row.children && row.children.length) {
        rowList.forEach(item => {
          if (row.toggle) {
            item.toggle = false
          } else {
            if (row.value == item.value) {
              item.toggle = true
            } else {
              item.toggle = false
            }
          }
        })
      } else {
        rowList.map(item => {
          item.toggle = false
          if (item.children && item.children.length) {
            item.children.map(item2 => {
              item2.toggle = false
            })
          }
        })
        this.chapterIndex = this.chapters.childs.findIndex(item => {
          return item.value == row.value
        })
        this.$emit('chaptersFilterEmitEvt', row)
        this.showChaptersPopup()
      }
    },
    toggleChapter(direction) {
      if (direction == 'next' && this.chapterIndex < this.chapters.childs.length) {
        this.chapterIndex++
      }
      if (direction == 'prev' && this.chapterIndex > 0) {
        this.chapterIndex--
      }
      this.chapters.name = this.chapters.childs[this.chapterIndex].name
      this.chapters.value = this.chapters.childs[this.chapterIndex].value
      // 操作章节树展开、闭合
      this.chapters.options = this.$utils.sortTreeData(this.chapters.options)
      this.$utils.toggleTreeCheckedStatus(this.chapters.value, this.chapters.options)
      this.$emit('chaptersFilterEmitEvt', {
        name: this.chapters.name,
        value: this.chapters.value,
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/global-variate.scss';
.chapters-filter-wrap {
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
  .chapter {
    position: relative;
    border: 1px solid #f2f2f2;
    border-radius: 14px;
    color: $color-666;
    flex-shrink: 0;
    font-size: 12px;
    &.disabled {
      pointer-events: none;
      opacity: 0.6;
    }
    &.prev {
      padding: 3px 13px 3px 18px;
      &::before {
        position: absolute;
        top: 50%;
        left: 3px;
        transform: translateY(-40%);
        content: '';
        width: 0;
        height: 0;
        border-width: 5px;
        border-style: solid;
        border-color: transparent #666 transparent transparent;
      }
    }
    &.next {
      padding: 3px 18px 3px 10px;
      &::after {
        position: absolute;
        top: 50%;
        right: 3px;
        transform: translateY(-50%);
        content: '';
        width: 0;
        height: 0;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent transparent #666;
      }
    }
  }
  .chapters-filters-comp-wrap {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    .current-chapter {
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
}
.filters-popup-comp {
  top: 88px;
  z-index: 101 !important;
  border-radius: 0px 0px 10px 10px;
  padding: 0 15px;
  max-height: 70%;
  .chapters-wrap {
    width: 100%;
    .icon-check,
    .icon-active {
      color: $color-brand !important;
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
    .sub-content {
      background-color: #fff;
      width: 100%;
      overflow: hidden;
      .sub-content-item {
        float: left;
        width: 110px;
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
        margin: 0 7px 6px 0;
        &.active {
          background-color: $color-brand;
          color: #fff;
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
    .list-item {
      width: 100%;
      @include border-bottom;
      .list-item-bar {
        height: 45px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .iconfont {
          color: #999;
        }
      }
      &:last-child {
        border-bottom: none;
      }
      .chapter-level1-sub-content {
        padding-left: 20px;
        .sub-content-item {
          width: 100%;
          border-top: 1px solid $color-bg;
          .text {
            color: $color-666;
          }
        }
        .chapter-level2-sub-content {
          padding-left: 20px;
          .sub-content-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 45px;
            & + .sub-content-item {
              border-top: 1px solid $color-bg;
            }
          }
        }
      }
    }
  }
}
</style>
