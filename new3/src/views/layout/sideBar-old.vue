<template>
  <div class="sideMenuWrap" :class="{'hide': !isShowMenu}"  v-if="menuList && menuList.length"  @click.stop.prevent="">
    <!--
      :default-openeds="currentOpen"-->
    <el-menu :default-active="$route.path" background-color="#304156" text-color="#fff" active-text-color="#409EFF" class="menuBox">
      <template v-for="(firstItem, index) in menuList" >
        <!-- 一级菜单 无子集-->
        <router-link v-if="!firstItem.children || !firstItem.children.length" :key="index" :to="firstItem.href">
          <el-menu-item :index="firstItem.href" :class="{'is-active' : isActive(firstItem)}">
            <div class="titleBox firstTitleBox">
              <!--<i class="icon" :class="firstItem.meta.icon ? firstItem.meta.icon : 'el-icon-star-off'"></i>-->
              <i class="icon" :class="firstItem.icon ? firstItem.icon : ''"></i>
              <span class="titleTop">{{firstItem.name}}</span>
            </div>
          </el-menu-item>
        </router-link>
        <!-- 一级菜单 有子集-->
        <el-submenu v-else :key="index" :index="String(index)">
          <template slot="title">
            <div class="titleBox firstTitleBox">
              <i class="icon" :class="firstItem.icon ? firstItem.icon : ''"></i>
              <span class="titleTop">{{firstItem.name}}</span>
            </div>
          </template>
          <template v-for="(secondItem, secondIndex) in firstItem.children">
            <!-- 二级菜单 -->
            <router-link v-if="!secondItem.hidden" :key="`${index}-${secondIndex}`" :to="secondItem.href">
              <el-menu-item :index="secondItem.href" :class="{'is-active' : isActive(secondItem)}">
                <div class="titleBox subTitleBox">
                  <!--<i class="icon" :class="firstItem.meta.icon ? firstItem.meta.icon : 'el-icon-star-off'"></i>-->
                  <i v-if="secondItem.icon" class="icon" :class="secondItem.icon ? secondItem.icon : ''"></i>
                  <span class="titleTop">{{secondItem.name}}</span>
                </div>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'side-bar',
  data () {
    return {}
  },
  computed: {
    isShowMenu () {
      return this.$store.getters.isShowMenu
    },
    menuList () {
      let list = []
      list.push({
        children: [],
        name: '首页',
        // noDropDown: true,
        href: '/index',
        redirect: '/index'
      })
      return list.concat(this.$store.getters.showMenuList)
    }
  },
  created () {
    // this.getIsShow('/admin/menu', 'addSubmenu')
  },
  methods: {
    isActive (data) {
      if (this.$route.path === data.href) {
        return true
      }
      let isActive = false
      if (data.children && data.children.length) {
        data.children.map(async item => {
          let res = await this.isActive(item)
          if (res) isActive = true
        })
      }
      return isActive
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  $menu-height: 48px; // 一级菜单高度
  $menu-size: 16px; // 一级菜单的字号
  $sub-menu-height: 44px; // 次级菜单高度
  $sub-menu-size: 14px; // 次级菜单的字号
  $menu-bg: #304156;
  $sub-menu-bg: #1f2d3d;
  $menu-hover-bg: #263445;
  $menu-text: #fff;

  .sideMenuWrap{
    width: 204px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    transition: 0.3s;
    z-index: 100;
    &.hide{
      left: -200px;
    }
  }
  .menuBox{
    /*height: calc( 100vh - 60px );*/
    height: 100vh;
    overflow-y: auto;
    /*background: $menu-bg;*/
    border: none;
    .el-submenu{
      .el-menu-item{
        background: $sub-menu-bg !important;
        &:hover{
          background: $menu-hover-bg !important;
        }
      }
    }
  }

</style>
<style lang="scss" rel="stylesheet/scss">
  /*.sideMenuWrap{
    .el-submenu__icon-arrow{
      font-size: 16px;
      right: 30px;
    }
    .el-submenu__title{
      height: auto;
      !*line-height: $menu-height;*!
    }
  }*/
  .el-menu--collapse{
    width: 0 !important;
  }
</style>
