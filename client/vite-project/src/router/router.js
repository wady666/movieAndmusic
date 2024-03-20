import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
  { path: "/test", component: () => import("../views/Test.vue") },
  { path: "/login", component: () => import("../views/Login/login.vue"),meta:{show:false} },
  { path:'/detail',component:()=> import("../views/Detail.vue"),meta:{show:true}},
  { path:'/',component:()=> import("../views/HomePage.vue"),meta:{show:true}},
  { path: "/dashboard", component: () => import("../views/Dashboard/Dashboard.vue") ,children:[
    {path:"/dashboard/category",component: () => import("../views/Dashboard/Category.vue")},
    {path:"/dashboard/article",component: () => import("../views/Dashboard/Article.vue")},
  ],meta:{show:true}},
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to,from,next)=>{
  const isLogin = localStorage.getItem('token')
  if(isLogin){
    // 已登录情况
    if(to.path === '/login'){
      next('/')
    }else {
      next()
    }
  }else {
    if(to.path === '/dashboard'){
      next('/')
    }else {
      next()
    }
  }
})
export { router, routes };
