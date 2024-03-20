<template>
  <div>
    <div class="home-main">
      <div class="home-main-category">
        <ul class="_flex">
          <li @click="changeCategory()">全部</li>
          <li v-for="(category,index) in categoryList" @click="changeCategory(category.id)">{{category.name}}</li>
        </ul>
      </div>
      <div class="home-main-container">
        <div v-for="(blog,index) in blogListInfo"
             class="blogCard _flex">
          <div class="blogCard-cover"><img :src="blog.cover"
                 alt=""></div>
          <div class="blogCard-main _flex _f-y _f-justify-between">
            <div>
              <p class="blogCard-main-title" @click="toDetail(blog)">{{ blog.title }}</p>
              <p class="blogCard-main-desc">{{ blog.desc }}</p>
            </div>
            <n-space align="center">
              <div>发布时间：{{ blog.create_time }}</div>
            </n-space>
          </div>
        </div>
        <n-space style="justify-content: center;">
          <n-pagination @update:page="loadBlogData"
                        v-model:page="pageInfo.page"
                        :page-count="pageInfo.pageCount"
                        size="medium" />
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import emitter from '../utils/event-bus.js'
import { AdminStore } from '../stores/AdminStore'
import { ref, reactive, inject, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const message = inject('message')
const axios = inject('axios')
const dialog = inject('dialog')

const adminStore = AdminStore()
// 顶部跳转菜单
let menus = [
  { name: '首页', href: '/' },
  { name: '后台', href: '/dashboard' },
  { name: '关于我们', href: 'logout' },
]
// 分类
const categoryList = ref([])

// 博客文章列表
const blogListInfo = ref([])
const tabValue = ref([])
const pageInfo = reactive({
  page: 1,
  pageSize: 5,
  pageCount: 0,
  count: 0,
  categoryId: 0,
  keywords: ''
})

onMounted(() => {
  loadCategoryData()
  loadBlogData()
})

emitter.on('keyword',(info)=>{
  pageInfo.keywords = info
})
// 加载分类数据
const loadCategoryData = async () => {
  let res = await axios.get('/category/list')
  categoryList.value = res.data.rows
}
// 加载所有博客数据
const loadBlogData = async (page = 0) => {
  if (page !== 0) {
    pageInfo.page = page;
  }
  console.log(pageInfo)
  let res = await axios.get(
    `/blog/search?keyword=${pageInfo.keywords}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
  )
  console.log(res)
  let tempRows = res.data.data.rows
  // 文字溢出...
  for (let row of tempRows) {
    let d = new Date(row.create_time)
    row.create_time = `${d.getFullYear()}年${
      d.getMonth() + 1
    }月${d.getDate()}日`
  }
  blogListInfo.value = tempRows
  pageInfo.count = res.data.data.count
  pageInfo.pageCount =
    parseInt(pageInfo.count / pageInfo.pageSize) +
    (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
}
emitter.on('search',loadBlogData)
// 更改分类
const changeCategory = async (categoryId=0) =>{
  if(categoryId != 0){
    pageInfo.categoryId = categoryId
  }
  loadBlogData()
}
// 跳转至文章详情页
const toDetail = (blog)=>{
  router.push({path:'detail',query:{id:blog.id}})
}
</script>

<style lang="scss" scoped>
.home-main {
  margin: 24px 160px;
  &-category {
    background-color: #f7f7f7;
    height: 48px;
    line-height: 48px;
    ul {
      li {
        font-size: 16px;
        padding: 0 24px;
        &:hover {
          background-color: rgb(225, 224, 224);
        }
      }
    }
  }
  &-container {
    margin-top: 20px;
  }
}
.blogCard {
  height: 140px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f2;
  &-cover {
    height: 120px;
    padding: 10px 0;
    width: 200px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  &-main {
    margin-left: 12px;
    &-title {
      font-size: 18px;
      font-weight: 500;
      color: #222226;
      margin-bottom: 10px;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    &-desc {
      font-size: 14px;
      font-weight: 400;
      color: #555666;
    }
  }
}
</style>
