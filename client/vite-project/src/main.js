import { createApp } from 'vue';
import './style.css';
// 引入统一样式
import './style/style.scss';
import './style/common.scss';
import App from './App.vue';
import naive from 'naive-ui';
import {createDiscreteApi} from 'naive-ui';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import {router} from './router/router';
import {createPinia} from "pinia";
import axios from "axios";
import { AdminStore } from './stores/AdminStore';

/* 
axios pinia sass vue-router naive-ui wangeditor element-ui
*/
// 配置axios基础路径
axios.defaults.baseURL = "http://localhost:8080"

// 创建消息提醒框
const { message, notification, dialog} = createDiscreteApi(
  ["message", "dialog", "notification"]
);

const app = createApp(App)


app.provide("axios",axios)
app.provide("message",message)
app.provide("dialog",dialog)
app.provide("notification",notification)
app.provide("server_url","http://localhost:8080")
app.use(ElementPlus)
app.use(naive)
app.use(createPinia())
app.use(router)

// 配置请求拦截器
const adminStore = AdminStore()
axios.interceptors.request.use((config)=>{
  config.headers.token = adminStore.token
  return config
})

app.mount('#app')
