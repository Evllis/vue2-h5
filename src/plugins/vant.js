// 按需全局引入 vant组件
import Vue from 'vue'
import { Button, Checkbox, List, Cell, Icon, Toast, Dialog, Overlay, PullRefresh } from 'vant'
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Cell)
Vue.use(List)
Vue.use(Icon)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Overlay)
Vue.use(PullRefresh)

Toast.setDefaultOptions({ duration: 1000, forbidClick: true })
