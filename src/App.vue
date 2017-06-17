<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
  html{
    height: 100%;
  }
  body{
    margin: 0;
    padding: 0;
    height:100%;
    background: #eef1f6;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #app{
    height: 100%;
  }

</style>
