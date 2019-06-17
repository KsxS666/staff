<!-- 头部导航 -->
<template>
  <div class="navBarWrap">
    <!--<router-link to="/" class="logoBox">
      <img src="~@/assets/logo.png" alt="">
    </router-link>-->
    <hamburger />
    <el-dropdown  class="userBox" trigger="click" @command="handleCommand">
      <div class="userInfo el-dropdown-link">
        <img src="~@/assets/avator.png" alt="">
        <span>{{userInfo.name || userInfo.username}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown" class="menuDropWrap">
        <el-dropdown-item command="toPersonInfo">个人信息</el-dropdown-item>
        <el-dropdown-item command="toChangePws">修改密码</el-dropdown-item>
        <el-dropdown-item command="toLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 个人信息的弹窗 -->
    <personInfoDialog v-model="showPersonInfo"/>
    <!-- 修改密码的弹窗 -->
    <changePwd v-model="changeDialogVisible" />
  </div>

</template>

<script>
import hamburger from './components/hamburger'
import personInfoDialog from './components/PersonInfoDialog'
import changePwd from './components/ChangePwd'
export default {
  name: 'navBar',
  components: { hamburger, personInfoDialog, changePwd },
  data () {
    return {
      currentPath: this.$route.path,
      changeDialogVisible: false, // 是否显示修改密码的弹窗
      showPersonInfo: false // 是否显示个人信息的弹窗
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 处理 dropdown 菜单
    handleCommand (command) {
      switch (command) {
        case 'toPersonInfo':
          this.toPersonInfo()
          break
        case 'toChangePws':
          this.toChangePws()
          break
        case 'toLogout':
          this.toLogout()
          break
        default:
          console.log('none')
      }
    },
    // 显示个人信息
    toPersonInfo () {
      this.showPersonInfo = true
    },
    // 修改密码
    toChangePws () {
      this.changeDialogVisible = true
    },
    // 退出登录
    async toLogout () {
      this.$store.dispatch('ClearLogout')
      location.reload()
    }
  }
}
</script>

<style  lang="scss" scoped rel="stylesheet/scss">

  .navBarWrap{
    position: relative;
    background: #fff;
    color: $text-primary;
    border-bottom: 1px solid $line-color;
    .logoBox{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 100%;
      vertical-align: top;
      img{
        width: 160px;
      }
    }
    .userBox{
      position: absolute;
      top: 0;
      right: 30px;
      line-height: 60px;
      .userInfo{
        cursor: pointer;
        /*color: #fff;*/
        img{
          display: inline-block;
          width: 36px;
          height: 36px;
          margin: 12px 10px 0;
          border-radius: 50%;
          vertical-align: top;
        }
        span{
          line-height: 60px;
          font-size: $font-size-base;
        }
      }
      .menuDropWrap{
        li {
          padding: 0 40px !important;
        }
      }
    }
  }

</style>
