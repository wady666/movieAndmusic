<template>
  <div class="container">
    <n-h1>{{ blogInfo.title }}</n-h1>
    <div class="blog-content">
      <div v-html="blogInfo.content"></div>
    </div>
  </div>
</template>

<script setup>
import { AdminStore } from '../stores/AdminStore'
import { ref, reactive, inject, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const axios = inject('axios')
const blogInfo = ref({})
onMounted(() => {
  loadBlog()
})
const loadBlog = async ()=>{
  let res = await axios.get('/blog/detail?id='+ route.query.id)
  blogInfo.value = res.data.rows[0]
}
</script>
<style>
.blog-content img {
  max-width: 100%;
}
</style>
<style lang="scss" scoped>
.container {
  min-height: 100%;
  width: 1000px;
  margin: 0 auto;
}
</style>