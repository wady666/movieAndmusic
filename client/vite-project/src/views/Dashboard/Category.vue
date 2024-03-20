<template>
  <n-button @click="showAddModel = true">添加</n-button>
  <n-table :bordered="false"
           :single-line="false">
    <thead>
      <tr>
        <th></th>
        <th>编号</th>
        <th>名称</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(category,index) in categoryList">
        <td>图片</td>
        <td>{{category.id}}</td>
        <td>{{ category.name }}</td>
        <td>
          <n-space>
            <n-button @click="toUpdate(category)">修改</n-button>
            <n-button @click="deleteCategory(category)">删除</n-button>
          </n-space>
        </td>
      </tr>
    </tbody>
  </n-table>
  <n-modal v-model:show="showAddModel"
           preset="dialog"
           title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <div>
      <n-input v-model:value="addCategory.name"
               type="text"
               placeholder="请输入分类名称" />
    </div>
    <template #action>
      <div>
        <n-button @click="add">提交</n-button>
      </div>
    </template>
  </n-modal>
  <n-modal v-model:show="showUpdateModel"
           preset="dialog"
           title="Dialog">
    <template #header>
      <div>修改分类</div>
    </template>
    <div>
      <n-input v-model:value="updateCategory.name"
               type="text"
               placeholder="请输入修改后分类名称" />
    </div>
    <template #action>
      <div>
        <n-button @click="update">修改</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const message = inject('message')
const axios = inject('axios')
const dialog = inject('dialog')

const adminStore = AdminStore()

// 添加
const showAddModel = ref(false)
const categoryList = ref([])
const addCategory = reactive({
  name: '',
})

// 修改
const showUpdateModel = ref(false)
const updateCategory = reactive({
  id: '',
  name: '',
})

onMounted(() => {
  loadData()
})

// 加载数据
const loadData = async () => {
  let res = await axios.get('/category/list')
  categoryList.value = res.data.rows
  console.log(res)
}
// 添加数据
const add = async () => {
  let res = await axios.post('/category/_token/add', { name: addCategory.name })
  if (res.data.code === 200) {
    message.info(res.data.msg)
    loadData()
  } else {
    message.error(res.data.msg)
  }
  showAddModel.value = false
}
// 删除数据
const deleteCategory = async (category) => {
  dialog.warning({
    title: '警告',
    content: '是否删除',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
      if (res.data.code == 200) {
        message.info(res.data.msg)
        loadData()
      } else {
        message.error(res.data.msg)
      }
    },
    onNegativeClick: () => {},
  })
}
// 显示修改数据弹出框
const toUpdate = async (category) => {
  showUpdateModel.value = true
  updateCategory.id = category.id
  updateCategory.name = category.name
}

// 修改数据
const update = async () => {
  let res = await axios.put('/category/_token/update', {
    id: updateCategory.id,
    name: updateCategory.name,
  })
  if (res.data.code === 200) {
    message.info(res.data.msg)
    loadData()
  } else {
    message.error(res.data.msg)
  }
  showUpdateModel.value = false
}
</script>

<style lang="scss" scoped>
</style>