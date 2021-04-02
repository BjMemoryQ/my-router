/*
 * @Description: 
 * @version: 
 * @Author: ruiqiang
 * @Date: 2021-03-31 13:00:02
 * @LastEditors: ruiqiang
 * @LastEditorTime: Do not edit
 */

class History {
  listen (callback) {
    window.addEventListener('hashchange', () => {
      callback && callback(window.location.hash)
    })
  }

  push (path) {
    window.location.hash = '#' + path
  }

  static getPath () {
    const curHash = window.location.hash
    return curHash.replace(/#/, '')
  }
}
const convert = (route,parent) => {
  const path = route.path
  const normalPath = '/' + path.split('/')
    .filter(item => item !== '')
    .join('/')
  const regexStr = normalPath
    .replace(/(:\w+)/g, '([^\/]+)')
    .replace(/\//g, () => '\\/') + '$'
  const pathRegx = new RegExp(regexStr)
  return {
    ...route,
    regx: pathRegx,
    parent
  }
}

const getComponentsStack = route => {
  console.log('route', route)
  let routeStack = []
  while(route) {
    routeStack.unshift(route)
    route = route.parent
  }
  return routeStack
}

const createMatcher = routesConfig => {
  const formatRoutes = (routes, basePath = '', parent = null) => {
    return routes.reduce((flatternArr, route)=>{
      if(route.children) {
        flatternArr = flatternArr.concat(formatRoutes(route.children, route.path + '/', route))
      }
      route.path = basePath + route.path
      flatternArr.push(convert(route, parent))
      return flatternArr
    }, [])
  }
  const pathMap = formatRoutes(routesConfig)

  const match = curPath => {
    return pathMap.find(route => {
      return route.regx.exec(curPath)
    })
  }
  return {
    match
  }
}
export default class VueRouter {
  constructor(options) {
    // options 就是外面的routes
    this.routes = options.routes;
    // 检测路由变化
    this.history = new History()
    this.history.listen(newHash => {
      // 路由改变刷新组件
      // TODO 修改更新视图的方式
      this.vm.$forceUpdate()
    })
    this.matcher = createMatcher(this.routes)
  }
  

  getRoute (path) {
    const gotPath = this.matcher.match(path)
    return gotPath
  }

  
  push ({ path }) {
    this.history.push(path)
  }

  // 插件install
  static install (Vue) {
    // 给每个组件加this.$router
    Vue.mixin({
      // 全局混入 created
      created () {
        if (this.$options.router) {
          this.$router = this.$options.router;
          this.$router.vm = this
          // 记录根组件
          this._routerRoot = this
        } else {
          this.$router = this.$parent.$router
          this._routerRoot = this.$parent._routerRoot
        }
      }
    })
    
    // 创建router-view组件
    Vue.component('router-view', {
      functional: true,
      render (createElement, { data, parent }) {
        const router = parent.$router;
        data.routeView = true
        const currentPath = History.getPath()
        const singleRoute = router.getRoute(currentPath)
        const componentsStack = getComponentsStack(singleRoute)
        let depth = 0
        while(parent) {
          const vNodedata = parent.$vnode ? parent.$vnode.data : {}
          if(vNodedata.routeView) {
            depth++
          }
          parent = parent.$parent
        }
        const finalRoute = componentsStack[depth]
        if(!finalRoute){ 
          return null
        }
        // 每次渲染根据当前页面path 找到当前组件
        return createElement(finalRoute.component, data)
      }
    })
  }
}