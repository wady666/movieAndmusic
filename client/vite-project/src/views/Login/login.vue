<template>
  <div class="login">
    <div class="login-content">
      <n-card title="管理后台登录">
        <n-form :rules="rules"
                :model="admin">
          <n-form-item path="account"
                       label="账号">
            <n-input v-model:value="admin.account"
                     placeholder="请输入账号" />
          </n-form-item>
          <n-form-item path="password"
                       label="密码">
            <n-input v-model:value="admin.password"
                     type="password"
                     placeholder="请输入密码" />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-checkbox v-model:checked="admin.remembered"
                      label="记住我" />
          <n-button @click="login">登录</n-button>
        </template>
      </n-card>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, inject } from 'vue'
import {AdminStore} from '../../stores/AdminStore'
import {useRouter,useRoute} from 'vue-router'
const message = inject("message")
const adminStore = AdminStore()
const axios = inject('axios')

const router = useRouter()
const route = useRoute()
// 验证表单规则
let rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '账号长度在 3 到 12 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '密码长度在 6 到 18 个字符', trigger: 'blur' },
  ],
}

const admin = reactive({
  account: localStorage.getItem("account")||'',
  password: localStorage.getItem("password")||'',
  remembered: localStorage.getItem("remembered") == 1 || false,
})

const login = async () => {
  console.log(123)
  let result = await axios.post('/admin/login', {
    account: admin.account,
    password: admin.password,
  })
  if(result.data.code == 200){
    adminStore.token = result.data.data.token
    adminStore.account = result.data.data.account
    adminStore.id = result.data.data.id
    localStorage.setItem("token",result.data.data.token)
    if(admin.remembered){
      localStorage.setItem('account',admin.account)
      localStorage.setItem('password',admin.password)
      localStorage.setItem('remembered',admin.remembered ? 1:0)
    } 
        // 成功后跳转路由
    router.push("/dashBoard")
    message.info("登录成功")
    console.log(adminStore.token)
  }else{
    message.error("登录失败")
  }
}
</script>
  
<style scoped lang="scss">
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-content {
    width: 500px;
  }
}
</style>