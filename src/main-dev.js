// 导入 vue
import Vue from 'vue'
// 导入 App.vue 根组件
import App from './App.vue'
// 导入路由
import router from './router'
// 导入elementUI对应的组件
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入第三方插件：树状表格
import TreeTable from 'vue-table-with-tree-grid'

// 导入第三方插件：富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入第三方插件: nprogress 进度条加载
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'

// 导入axios 发起网络数据请求
import axios from 'axios'
// 设置请求的根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = '/data/'
// 请求拦截器
// 在request拦截器中,展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
    // console.log(config)
    // 展示进度条
    NProgress.start()
    // 每发起请求，自动绑定一个token
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
// 在response拦截器中,隐藏进度条  NProgress.done()
axios.interceptors.response.use(config => {
    // 隐藏进度条
    NProgress.done()
    return config
})
// 挂载到Vue的原型对象上
Vue.prototype.$http = axios

// 全局注册第三方插件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 注册全局的时间过滤器
// 第一个参数：过滤的名称
// 第二个参数：过滤器的处理函数
Vue.filter('dateFormat', function (originVal) {
    // 创建Date对象
    const dt = new Date(originVal)

    // 拿到四位的年份
    const year = dt.getFullYear()
    // 拿到月份   padStart函数用于填充字符串
    // 第一个参数是字符串长度，第二个参数是填充的字符
    // 意思为：字符串长度小于2，就以0进行填充
    const month = (dt.getMonth() + 1 + '').padStart(2, '0')
    // 获得日期
    const day = (dt.getDate() + '').padStart(2, '0')

    // 获得小时
    const hour = (dt.getHours() + '').padStart(2, '0')
    // 获得分钟
    const minute = (dt.getMinutes() + '').padStart(2, '0')
    // 获得秒数
    const second = (dt.getSeconds() + '').padStart(2, '0')

    // 返回拼接好的字符串
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})

// 阻止启动生产消息
Vue.config.productionTip = false

new Vue({
    // 挂载路由
    router,
    // 将根组件渲染到页面上
    render: h => h(App)
}).$mount('#app')
