// 按需全局引入 vant组件
import Vue from 'vue'
import { Button, Checkbox, List, Cell, Icon, Toast, Dialog, Overlay, PullRefresh, ActionSheet, Skeleton } from 'vant'
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Cell)
Vue.use(List)
Vue.use(Icon)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Overlay)
Vue.use(PullRefresh)
Vue.use(ActionSheet)
Vue.use(Skeleton)

Toast.setDefaultOptions({ duration: 1000, forbidClick: true })
