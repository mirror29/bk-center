import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import Cookies from "js-cookie"
import utils from "./utils/utils"
import { $BASE_URL } from "./utils/env"

import { Button, Popup, Toast, Swipe, SwipeItem, Tab, Tabs } from "vant"
import "./style/base.scss"
import "./style/iconfont.css"
// import 'amfe-flexible/index.js'

const app = createApp(App)

const vants = [Button, Popup, Toast, Swipe, SwipeItem, Tab, Tabs]
vants.forEach((plugin) => {
  app.use(plugin)
})

app.config.globalProperties.$cookies = Cookies
app.config.globalProperties.$utils = utils
app.config.globalProperties.$BASE_URL = $BASE_URL

app.use(router).mount("#app")
