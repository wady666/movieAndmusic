<template>
  <div>
    <Toolbar :editor="editorRef"
             :defaultConfig="toolbarConfig"
             :mode="mode"
             style="border-bottom: 1px solid #ccc" />
    <Editor :defaultConfig="editorConfig"
            :mode="mode"
            v-model="valueHtml"
            style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated"
            @onChange="handleChange"/>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted, inject } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const serverUrl = inject("server_url")
const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };
// 上传图片文件
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
  base64LimitSize: 10 *1024,
  server: serverUrl+'/upload/rich_editor_upload'
}
// 对上传后 获取图片的src进行与serverURL的拼接
editorConfig.MENU_CONF["insertImage"] = {
  parseImageSrc:(src)=>{
    if(src.indexOf("http") !== 0 ){
      return `${serverUrl}${src}`
    }
    return src
  }
}
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

const mode = ref('default')
const props = defineProps({
  modelValue:{
    type:String,
    default:''
  }
})
const emit = defineEmits(["update:model-value"])
let initFinish = false

// 组件创建时,给予一个初始值，initFinish表示是否初始化完成，完成后才可以触发handleChange回调函数
onMounted(()=>{
  setTimeout(() => {
    valueHtml.value = props.modelValue
    initFinish = true
  }, 10);
})
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return

  editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor) => {
  console.log('created', editor)
  editorRef.value = editor // 记录 editor 实例，重要！
}
// 编辑器文本更新时 将更新父组件的绑定
const handleChange = (editor) => {
  if(initFinish) {
    emit("update:model-value",valueHtml.value)
  }
}
</script>

<style lang="scss" scoped>
</style>