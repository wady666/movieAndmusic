<template>
  <div>
    <div class="home-head">
      <div class="home-head-left flex-1">
        <div class="_flex">
          <img src="../assets/img/logo.png"
               alt=""
               style="height: 46px;">
          <span class="home-head-left-text">myBlog</span>
        </div>
        <ul>
          <li v-for="menu in menus"
              @click="toPage(menu)">{{ menu.name }}</li>
        </ul>
      </div>
      <div class="home-head-middle flex-1 _flex _f-align-center _f-justify-center ">
          <n-input round
                   placeholder="搜索文章"
                   v-model:value="keyword"
                   class="home-head-middle-search"></n-input>
          <n-button strong
                    secondary
                    round
                    type="primary"
                    @click="search">搜索
          </n-button>
      </div>
      <div class="home-head-right flex-1">
        <p v-if="!isLogin"
           class="home-head-right-text">登录请点击 <span @click="router.push('/login')"
                class="home-head-right-text-login text-hover">登录</span></p>
        <p v-else
           class="home-head-right-text">欢迎您</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import emitter from '../utils/event-bus.js'
import { AdminStore } from '../stores/AdminStore'
import { ref, reactive, inject, onMounted,watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const message = inject('message')
const axios = inject('axios')
const dialog = inject('dialog')
const keyword = ref('')
let isLogin = ref('')
// 组件创建时
onMounted(() => {
  setTimeout(() => {
    isLogin = localStorage.getItem('token')
  }, 10)
})
watch(keyword,(newValue)=>{
  emitter.emit('keyword', newValue)
})
// 顶部跳转菜单
let menus = [
  { name: '首页', href: '/' },
  { name: '后台', href: '/dashboard' },
  { name: '关于我们', href: 'logout' },
]
// 点击顶部菜单跳转其他页面
const toPage = (menu) => {
  router.push(menu.href)
}
const search = ()=>{
  emitter.emit('search')
}
</script>

<style lang="scss" scoped>
.home-head {
  width: 100%;
  height: 48px;
  line-height: 48px;
  box-sizing: border-box;
  padding: 0 24px;
  display: flex;
  border-bottom: 1px solid #ebe5e5;
  position: fixed;
  top: 0;
  z-index: 999;
  background-color: #fff;
  &-left {
    display: flex;
    &-text {
      margin-left: 8px;
      font-weight: 400;
      font-size: 20px;
      color: #4d4848;
    }
    ul {
      margin-left: 24px;
      display: flex;
      li {
        font-size: 14px;
        padding: 0 12px;
        &:hover {
          background-color: rgb(225, 224, 224);
        }
      }
    }
  }
  &-middle {
    &-search {
      width: 480px;
    }
  }
  &-right {
    &-text {
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>