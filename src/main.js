/*
 * @Description: 
 * @version: 
 * @Author: ruiqiang
 * @Date: 2021-03-31 12:11:47
 * @LastEditors: ruiqiang
 * @LastEditorTime: Do not edit
 */
import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
import helloWorld from './components/HelloWorld.vue'
import homePage from './components/HomePage.vue'
import firstPage from './components/FirstPage.vue'


// 引入插件 MyRouter
import VueRouter from './my-router'

// 通过vue.use方法使用
Vue.use(VueRouter)

// 配置url与组件关系
const routes = [{
  path: '/helloWorld',
  component: helloWorld
},
{
  path: '/homePage/:id',
  component: homePage,
  children:[
    {
      path: 'first',
      component: firstPage
    }
  ]
}
]
 // 实例化并传入参数
const router = new VueRouter({routes})

// 注册
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
