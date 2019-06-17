<template>
  <div class="navBarWrap">
    <router-link to="/" v-show="currentTitleName" class="logoBox" title="首页">
      {{currentTitleName}}
    </router-link>
    <hamburger class="hamburger" v-show="subMenuList && subMenuList.length" />
    <div class="hamburger" v-show="!subMenuList || !subMenuList.length"></div>
    <el-menu :default-active="activeIndex"
      class="navBox"
      mode="horizontal"
      background-color="transparent"
      text-color="#333"
      @select="changeMenu"
      active-text-color="#333">
      <template v-for="(item, index) in menuList" > <!---->
        <!--<router-link :to="toLinkPath(item)" :key="index"> </router-link>-->
        <el-menu-item v-if="item.isShowMenu" :index="item.path" :key="index" :class="{'isActive': item.path === activeIndex}" @click="toClick(item)">{{item.name}}</el-menu-item>
      </template>
    </el-menu>
    <el-dropdown  class="userBox" trigger="click" @command="handleCommand">
      <div class="userInfo el-dropdown-link">
        <img src="~@/assets/avator.png" alt="">
        <!--<img alt="">-->
        <span>{{userInfo && (userInfo.name || userInfo.username)}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <!--<el-dropdown-menu slot="dropdown" class="menuDropWrap">
        &lt;!&ndash;<el-dropdown-item command="toChangePws">修改密码</el-dropdown-item>&ndash;&gt;
        <el-dropdown-item command="toHome">返回首页</el-dropdown-item>
        <el-dropdown-item command="toLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>-->
      <el-dropdown-menu slot="dropdown" class="menuDropWrap">
        <el-dropdown-item command="toPersonInfo">个人信息</el-dropdown-item>
        <el-dropdown-item command="toChangePws">修改密码</el-dropdown-item>
        <el-dropdown-item command="toLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 个人信息的弹窗 -->
    <PersonInfoDialog v-model="showPersonInfo"/>
    <!-- 修改密码的弹窗 -->
    <ChangePwd v-model="changeDialogVisible" />
  </div>

</template>

<script>
import PersonInfoDialog from './PersonInfoDialog'
import ChangePwd from './ChangePwd'
import Hamburger from './hamburger'
export default {
  name: 'NavBar',
  components: { PersonInfoDialog, ChangePwd, Hamburger },
  data () {
    return {
      currentPath: this.$route.path,
      changeDialogVisible: false, // 是否显示修改密码的弹窗
      showPersonInfo: false // 是否显示个人信息的弹窗
    }
  },
  computed: {
    menuList () {
      let menu = [
        { name: '概览', path: '/', isShowMenu: true },
        { name: '大数据', path: '/large', isShowMenu: true }
      ]
      menu = menu.concat(this.$store.getters.showMenuList || [])
      return menu
      // return this.$store.getters.menuList || []
      // let list = []
      // list.push({
      //   children: [],
      //   name: '首页',
      //   // noDropDown: true,
      //   href: '/index',
      //   redirect: '/index'
      // })
      // return list.concat(this.$store.getters.showMenuList)
      // return menu
    },
    activeIndex () {
      let menuList = this.menuList
      // let menuList = this.$store.getters.addRouters
      let path = this.currentPath
      menuList.map((item) => {
        if (this.currentPath.indexOf(item.path) === 0) {
          this.$store.dispatch('SetFirstMenu', item.path)
          path = item.path
        }
      })
      return path
    },
    subMenuList () {
      let currentFirstMenu = this.$store.getters.menuInfo.currentFirstMenu || null
      if (!currentFirstMenu || !currentFirstMenu.children || !currentFirstMenu.children.length) {
        return null
      }
      return currentFirstMenu.children
    },
    currentTitleName () {
      // let currentFirstMenu = this.$store.getters.menuInfo.currentFirstMenu || null
      // if (!currentFirstMenu) {
      //   return null
      // }
      // if (currentFirstMenu.isShowMenu) {
      //   return '爱家物联管理后台'
      // }
      // return `${currentFirstMenu.name}后台`
      return '爱家物联管理后台'
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 切换菜单
    changeMenu (item) {
      if (item.indexOf('http') !== -1) return
      this.currentPath = item
    },
    // 跳转页面
    toClick (itemData) {
      if (itemData.isJump) {
        window.open(itemData.path, '_blank')
        // window.location.href = itemData.path
        return
      }
      this.$router.push(itemData.path)
    },
    // 处理 dropdown 菜单
    handleCommand (command) {
      // switch (command) {
      //   case 'toHome':
      //     // this.toChangePws()
      //     this.$router.push('/')
      //     break
      //   case 'toLogout':
      //     this.toLogout()
      //     break
      //   default:
      //     console.log('none')
      // }
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
  $nav-height: 70px;
  .navBarWrap{
    display: flex;
    background: #fff;
    .logoBox{
      flex: 0 0 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: $color-primary;
      font-size: 22px;
      color: #fff;
      /*margin-right: 60px;*/
    }
    .hamburger{
      width: 70px;
      height: 100%;
    }
    .navBox{
      flex: 1;
      display: flex;
      border: none;
      height: $nav-height;
      li{
        box-sizing: border-box;
        height: $nav-height;
        line-height: $nav-height;
        padding: 0 40px;
        border-bottom: 2px solid transparent !important;
        font-size: $font-sub-title;
        &:hover {
          background-color: rgba(0,0,0,0) !important;
          /*background: mix(#fff, $color-primary, 80%) !important;*/
          color: $color-primary !important;
        }
        /*&.is-active{*/
        &.isActive{
          background: mix(#fff, $color-primary, 80%) !important;
          color: $color-primary !important;
          border-bottom-color: $color-primary !important;
        }
      }
    }
    .userBox{
      margin-right: 30px;
      .userInfo{
        cursor: pointer;
        color: $text-primary;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
        img{
          /*background: #ccc;*/
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        span{
          font-size: $font-size-base;
          margin: 0 10px;
        }
      }
    }
  }
</style>
