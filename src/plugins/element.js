import Vue from 'vue'
// 按需导入，导入需要的组件
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    CheckboxGroup,
    Checkbox,
    Upload
} from 'element-ui'

// 导入timeline组件
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'

// Login.vue 需要使用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Home.vue 需要使用的组件
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
// User.vue 需要使用的组件
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
// Rights.vue 需要使用的组件
Vue.use(Tag)
// Roles.vue 需要使用的组件
Vue.use(Tree)
// Cate.vue 需要使用的组件
Vue.use(Cascader)
// Params.vue 需要使用的组件
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
// Add.vue 需要使用的组件
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
// Order.vue 需要使用到的组件
Vue.use(Timeline)
Vue.use(TimelineItem)
// 全局挂载，挂载到vue全局对象上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
