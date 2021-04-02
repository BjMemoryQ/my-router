<!--
 * @Description: 
 * @version: 
 * @Author: ruiqiang
 * @Date: 2021-03-31 12:11:47
 * @LastEditors: ruiqiang
 * @LastEditorTime: Do not edit
-->
<template>
  <div class="hello" @click="goHome">click</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  methods: {
    goHome () {
      this.$router.push({
        path: '/homePage/detail/123'
      })
    }
  }
}
</script>
