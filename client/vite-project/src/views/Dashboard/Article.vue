<template>
  <n-tabs v-model:value="tabValue"
          type="line"
          animated>
    <n-tab-pane name="list"
                tab="文章列表">
      <div v-for="(blog,index) in blogListInfo"
           class="blogCard _flex">
        <div class="blogCard-cover"><img :src="blog.cover"
               alt=""></div>
        <div class="blogCard-main _flex _f-y _f-justify-between">
          <div>
            <p class="blogCard-main-title">{{ blog.title }}</p>
            <p class="blogCard-main-desc">{{ blog.desc }}</p>
          </div>
          <n-space align="center">
            <div>发布时间：{{ blog.create_time }}</div>
            <n-button @click="toUpdate(blog)">修改</n-button>
            <n-button @click="toDelete(blog)">删除</n-button>
          </n-space>
        </div>
      </div>
      <n-space>
        <n-pagination @update:page="loadBlog"
                      v-model:page="pageInfo.page"
                      :page-count="pageInfo.pageCount"
                      size="medium" />
      </n-space>
    </n-tab-pane>
    <n-tab-pane name="add"
                tab="添加文章">
      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="addArticle.title" />
        </n-form-item>
        <n-form-item label="封面图片">
          <n-upload multiple
                    directory-dnd
                    action="#"
                    :custom-request="uploadImage"
                    :max="5">
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48"
                        :depth="3">
                  <i class="iconfont icon-shangchuan"
                     style="font-size: 48px;"></i>
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
        <n-form-item label="类型">
          <n-select v-model:value="addArticle.categoryId"
                    :options="categoryOptions" />
        </n-form-item>
        <n-form-item label="简要描述">
          <n-input v-model:value="addArticle.desc" />
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="addArticle.content"></rich-text-editor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="submit()">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="update"
                tab="修改">
      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="updateArticle.title" />
        </n-form-item>
        <n-form-item label="封面图片">
          <n-upload multiple
                    directory-dnd
                    action="#"
                    :custom-request="uploadImage"
                    :max="5">
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48"
                        :depth="3">
                  <i class="iconfont icon-shangchuan"
                     style="font-size: 48px;"></i>
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
        <n-form-item label="类型">
          <n-select v-model:value="updateArticle.categoryId"
                    :options="categoryOptions" />
        </n-form-item>
        <n-form-item label="简要描述">
          <n-input v-model:value="updateArticle.desc" />
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="update()">修改</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RichTextEditor from '../../components/RichTextEditor.vue'

const router = useRouter()
const route = useRoute()

const message = inject('message')
const axios = inject('axios')
const dialog = inject('dialog')

const adminStore = AdminStore()
const serverUrl = inject('server_url')
const uploadImageUrl = serverUrl + '/upload/blog_cover_upload'
const categoryOptions = ref([])
const addArticle = reactive({
  categoryId: 0,
  title: '',
  content: '',
  desc: '',
  cover: '',
})
const updateArticle = reactive({
  id: 0,
  categoryId: 0,
  title: '',
  content: '',
  desc: '',
  cover: '',
})
const blogListInfo = ref([])
const tabValue = ref('list')
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
})
onMounted(() => {
  loadBlog()
  loadData()
})

// 加载所有博客数据
const loadBlog = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page
  }
  let res = await axios.get(
    `/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
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
// 加载数据
const loadData = async () => {
  let res = await axios.get('/category/list')
  categoryOptions.value = res.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id,
    }
  })
}
// 提交数据
const submit = async () => {
  let res = await axios.post('/blog/_token/add', addArticle)
  if (res.data.code === 200) {
    message.info(res.data.msg)
  } else {
    message.error(res.data.msg)
  }
}
// 切换tab栏到修改数据
const toUpdate = async (blog) => {
  tabValue.value = 'update'
  let res = await axios.get('/blog/detail?id=' + blog.id)
  updateArticle.id = blog.id
  updateArticle.title = res.data.rows[0].title
  updateArticle.content = res.data.rows[0].content
  updateArticle.categoryId = res.data.rows[0].category_id
  updateArticle.desc = res.data.rows[0].desc
}
// 提交修改数据
const update = async () => {
  let res = await axios.put('/blog/_token/update', updateArticle)
  if (res.data.code === 200) {
    message.info(res.data.msg)
    loadBlog()
    tabValue.value = 'list'
  } else {
    message.error(res.data.msg)
  }
}
// 删除
const toDelete = async (blog) => {
  dialog.warning({
    title: '警告',
    content: '是否删除',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      let res = await axios.delete('/blog/_token/delete?id=' + blog.id)
      if (res.data.code === 200) {
        message.info(res.data.msg)
        loadBlog()
      } else {
        message.error(res.data.msg)
      }
    },
    onNegativeClick: () => {},
  })
}
// 图片上传
const uploadImage = async (type, file) => {
  let formdata = new FormData()
  formdata.append('file', file.file.file)
  let res = await axios.post(uploadImageUrl, formdata)
  if (tabValue.value === 'add') {
    addArticle.cover = serverUrl + res.data.data.url
  } else if (tabValue.value === 'update') {
    updateArticle.cover = serverUrl + res.data.data.url
  }
}
</script>

<style lang="scss" scoped>
.blogCard {
  height: 140px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f2;
  &-cover {
    height: 120px;
    padding: 10px 0;
    width: 200px;
    img{
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
      &:hover{
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