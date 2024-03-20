<template>
  <Header v-show="route.meta.show"></Header>
  <router-view style="margin-top: 60px;"></router-view>
  <Footer></Footer>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const message = inject('message')
const axios = inject('axios')
const dialog = inject('dialog')
</script>

<style lang="scss">
#app {
  height: 100vh;
}
</style>
