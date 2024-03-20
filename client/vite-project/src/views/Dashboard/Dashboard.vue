<template>
  <div class="main-panel">
    <!-- 侧边栏 -->
    <div class="menus">
      <div v-for="menu in menus" @click="toPage(menu)">{{ menu.name }}</div>
    </div>
     <!-- 右侧内容区  -->
    <div style="padding: 20px;width: 100%;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")

const adminStore = AdminStore()
//菜单
let menus = [
    { name: "文章管理", href: "/dashboard/article" },
    { name: "分类管理", href: "/dashboard/category" },
    { name: "退出登录", href: "logout" },
];
const toPage =(menu)=>{
  if(menu.href==='logout'){
    // 退出登录，返回登录页面
    localStorage.removeItem('token')
    router.push("/login")
  }else{
    router.push(menu.href)
  }
}
</script>

<style lang="scss" scoped>
.main-panel {
  display: flex;
  color: #64676a;
  // max-width: 1500px;
  margin: 0 auto
}
.menus {
  padding:20px 0;
  box-sizing: border-box;
  line-height: 55px;
  text-align: center;
  width: 180px;
  height: 100vh;
  border-right: 1px solid #dadada;
  div{
    cursor: pointer;
    &:hover {
      color: var(--color-text-hover);
    }
  }
}
</style>