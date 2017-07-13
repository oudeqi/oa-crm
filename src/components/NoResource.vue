<template>
  <div class="warpper">
    <div class="header">
      <h1>联联办公自动化与客户关系系统</h1>
    </div>
    <p class="no-resource">
      没有找到资源...
    </p>
  </div>

</template>

<script>

  import router from '@/router'
  export default {
    name: 'noResource',
    created: function () {
      let msg = '登录超时，请重新登录！'
      if (this.$route.params.code === 2 || this.$route.params.code === '2') {
        msg = '角色无权限，请联系管理员添加'
      }
      this.$alert(msg, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          router.push('/login')
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  .warpper{
    height: 100%;
    background: #eef1f6;
    .header{
      height:70px;
      background: #333;
      border-bottom: 1px solid #ddd;
      box-sizing: border-box;
      h1{
        line-height: 1.3;
        font-size: 20px;
        margin: 0;
        padding-top: 20px;
        text-align: left;
        padding-left: 20px;
        color: #eeeeee;
      }
    }
    .no-resource{
      text-align: center;
      font-size: 20px;
      color: #333;
    }
  }
</style>
