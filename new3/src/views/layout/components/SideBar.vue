<template>
  <div class="sideMenuWrap" v-if="menuList && menuList.length">
    <el-menu
      :default-active="$route.path"
      :default-openeds="currentOpen"
      class="menuBox ">
      <template v-for="(secondItem, index) in menuList" >
        <SideBarItem v-if="!secondItem.hidden" :itemData="secondItem" :key="index" :index="index" />
      </template>
    </el-menu>
  </div>
</template>

<script>
import SideBarItem from './SideBarItem'
export default {
  name: 'SideBar',
  components: { SideBarItem },
  data () {
    return {
      currentOpen: []
    }
  },
  computed: {
    menuList () {
      let currentFirstMenu = this.$store.getters.menuInfo.currentFirstMenu || null
      if (!currentFirstMenu || !currentFirstMenu.children || !currentFirstMenu.children.length) {
        return []
      }
      return currentFirstMenu.children
    }
  },
  mounted () {
    this.currentOpen = this.getCurrentOpen(this.menuList)
  },
  methods: {
    /* 当前一级菜单下的 所以二级菜单都展开 */
    getCurrentOpen (menuList) {
      let list = []
      menuList.map(item => {
        list.push(item.href)
        if (item.children && item.children.length) {
          let childList = this.getCurrentOpen(item.children)
          list = list.concat(childList)
        }
      })
      return list
    }
  },
  watch: {
    menuList () {
      this.currentOpen = this.getCurrentOpen(this.menuList)
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
</style>
<style lang="scss" rel="stylesheet/scss">
  .sideMenuWrap{
    $menu-height: 50px; // 一级菜单高度
    $menu-size: 16px; // 一级菜单的字号
    $sub-menu-height: 44px; // 次级菜单高度
    $sub-menu-size: 14px; // 次级菜单的字号
    $menu-text: $text-primary; // 一级菜单字体颜色
    $sub-menu-text: $text-second; // 次级菜单字体颜色
    $menu-text-active: $color-primary; // 选中的字体颜色
    .menuBox{
      height: calc(100vh - 70px);
      overflow-y: auto;
      border: none;
      .titleBox{
        margin-left: 30px;
        .icon{
          font-size: 20px;
          margin-right: 4px;
          margin-left: - 10px;
          font-weight: 400;
          color: #8492a6;
        }
      }
      .el-submenu__title{
        min-width: auto;
        height: $menu-height;
        line-height: $menu-height;
        color: $menu-text;
        font-size: $menu-size;
        border-left: 6px solid transparent;
      }
      .el-menu-item{
        min-width: auto;
        height: $menu-height;
        line-height: $menu-height;
        border-left: 6px solid transparent;
        color: $menu-text;
        font-size: $menu-size;
        &.isActive{
          border-left-color: $menu-text-active;
          background: mix(#fff, $menu-text-active, 80%) !important;
          color: $menu-text-active !important;
          .icon{
            color: $menu-text-active !important;
          }
        }
      }
      .el-submenu{
        .el-menu{
          /*padding: 10px 0;*/
          /*background: mix(#fff, $color-primary, 95%);*/
        }
        .el-menu-item{
          min-width: auto;
          height: $sub-menu-height;
          line-height: $sub-menu-height;
          color: $sub-menu-text;
          font-size: $sub-menu-size !important;
        }
      }
    }
  }
</style>
