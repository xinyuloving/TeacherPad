import Vue from 'vue'
import {
    Cascader,
    Loading,
    Select,
    Option,
    Table,
    TableColumn,
    Form,
    FormItem,
    Input,
    Progress,
    Message,
    Button,
    Popconfirm,
    Popover,
    Pagination
} from 'element-ui'
Vue.use(Cascader)
Vue.use(Loading);    // 使用服务方式的话，只安装Loading即可
// Vue.use(Loading.directive);  //  指令方式(v-loading)的话这两行都得有
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Progress)
Vue.use(Button)
Vue.use(Popconfirm)
Vue.use(Popover)
Vue.use(Pagination)

Vue.prototype.$message = Message