// 按需全局引入 vant组件
import Vue from 'vue'
import { Button, Checkbox, List, Cell, Icon, Toast } from 'vant'
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Cell)
Vue.use(List)
Vue.use(Icon)
Vue.use(Toast)

Toast.setDefaultOptions({ duration: 1000, forbidClick: true })
