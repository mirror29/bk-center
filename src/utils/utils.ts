/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mirror29
 * @LastEditors: mirror29
 * @LastEditTime: 2021-04-28 10:55:36
 */

class Utils {
  constructor() {}

  /**
   * 设置本地缓存
   * @param { key: str , val: any }
   * @retunrs true: bool
   */
  setSto({ key, val }) {
    localStorage.setItem(key, JSON.stringify(val))
    return true
  }

  /**
   * 读取本地缓存
   * @param key: str
   * @retunrs *: any
   */
  getSto(key: string) {
    if (localStorage.getItem(key)) {
      // @ts-ignore
      return JSON.parse(localStorage.getItem(key))
    } else {
      return null
    }
  }

  /**
   * 删除本地缓存
   * @param key: str
   * @returns {}
   */
  deleteSto(key: string) {
    localStorage.removeItem(key)
    return this
  }

  getSessionSto(key: string) {
    let sessionItem = sessionStorage.getItem(key)
    if (sessionItem) {
      return JSON.parse(sessionItem)
    }
  }

  /** 获取地址栏参数 */
  getUrlKey(url, name) {
    // return (
    //   decodeURIComponent(
    //     (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(url) || [
    //       ,
    //       "",
    //     ])[1].replace(/\+/g, "%20")
    //   ) || null
    // )
  }

  /** 动态修改query参数 */
  async changeQueryParams(query: any, obj: any, router: any) {
    let newQuery = JSON.parse(JSON.stringify(query))
    Object.assign(newQuery, obj)
    router.replace({ query: newQuery })
  }

  getById(Data: any, id: any, key = "value", sonKey = "children"): any {
    var Deep, T, F
    for (F = Data.length; F; ) {
      T = Data[--F]
      if (id == T[key]) return T
      if (T.children) {
        Deep = this.getById(T[sonKey], id, key, sonKey)
        if (Deep) return Deep
      }
    }
  }

  /** 递归获取子节点 */
  parseTreeJson(array: any, childs: any) {
    let treeData = JSON.parse(JSON.stringify(array))
    for (let index = 0; index < treeData.length; index++) {
      const element = treeData[index]
      if (element) {
        if (element.children && element.children.length) {
          this.parseTreeJson(element.children, childs)
        } else {
          // 判断是否为子节点
          if (!element.children.length) {
            childs.push({
              name: element.name,
              value: element.value,
            })
          }
        }
      }
    }
    return childs
  }

  // 递归修改树结构的属性
  sortTreeData(
    Data: any,
    chapterId?: any,
    sonKey = "children",
    key = "toggle"
  ) {
    var T, F
    for (F = Data.length; F; ) {
      T = Data[--F]
      T[key] = false
      if (chapterId && T.value == chapterId) {
        T[key] = true
      }
      if (T[sonKey]) {
        this.sortTreeData(
          T[sonKey],
          chapterId,
          (sonKey = "children"),
          (key = "toggle")
        )
      }
    }
    return Data
  }

  // 切换上下章节时操作选中状态
  toggleTreeCheckedStatus(value: any, options: any) {
    let parentIds = this.findPathByLeafId(value, options) // 找到父->子->孙的value数组
    if (parentIds && parentIds.length) {
      parentIds.pop() // 删掉最后一个，剩下都是父级的value
      parentIds.forEach((item) => {
        let parent = this.getById(options, item)
        parent.toggle = true
      })
    }
  }

  // 当存在chapterId的时候，给父级togggle设置true
  findPathByLeafId(leafId: any, nodes: any, path?: any, type?: any): any {
    if (path === undefined) {
      path = []
    }
    for (var i = 0; i < nodes.length; i++) {
      var tmpPath = path.concat()
      if (type) {
        tmpPath.push(nodes[i].name)
      } else {
        tmpPath.push(nodes[i].value)
      }
      if (leafId == nodes[i].value) {
        return tmpPath
      }
      if (nodes[i].children) {
        var findResult = this.findPathByLeafId(
          leafId,
          nodes[i].children,
          tmpPath,
          type
        )
        if (findResult) {
          return findResult
        }
      }
    }
  }

  getCurrentValue(data: any, chapter_id: any) {
    let courseInfo: any = {},
      zones: any = {},
      chapters: any = {},
      sxZone: any = {}
    data.forEach((item: any) => {
      if (item.class == "chapter") {
        let currentChapters = this.getById(item.options, item.currentValue)
        if (chapter_id) {
          chapters.name = currentChapters ? currentChapters.name : ""
          chapters.value = item.currentValue
        } else {
          // 册别时默认第一个最深子节点
          let firtTreeDeepChild = this.parseTreeJson([currentChapters], [])
          if (firtTreeDeepChild && firtTreeDeepChild.length) {
            chapters.name = firtTreeDeepChild[0].name
            chapters.value = firtTreeDeepChild[0].value
          }
        }
        chapters.options = this.sortTreeData(item.options)
        chapters.childs = this.parseTreeJson(item.options, [])
        this.toggleTreeCheckedStatus(chapters.value, chapters.options)
      } else {
        let currentOption = item.options.find((option) => {
          return option.value == item.currentValue
        })
        courseInfo[item.class] = {}
        courseInfo[item.class]["name"] = currentOption ? currentOption.name : ""
        courseInfo[item.class]["value"] = item.currentValue
        if (item.class == "zone_type") {
          zones.name = currentOption ? currentOption.name : ""
          zones.value = item.currentValue
          zones.options = item.options
        } else if (item.class == "book") {
          sxZone.value = item.currentValue
          sxZone.options = item.options
        } else if (item.class == "version") {
          sxZone.name = currentOption ? currentOption.name : ""
        }
      }
    })
    return {
      courseInfo,
      zones,
      sxZone,
      chapters,
    }
  }
}

const utils = new Utils()

export default utils
