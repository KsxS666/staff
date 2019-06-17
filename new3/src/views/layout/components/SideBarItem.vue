<template>
  <router-link v-if="itemData.noDropDown || !itemData.children || !itemData.children.length" :to="itemData.href">
    <el-menu-item :index="itemData.href"  :class="{'isActive': isActive(itemData)}">
      <div class="titleBox">
        <!--<i class="icon icon-menu"></i>-->
        <span class="icon" :class="itemData.meta && itemData.meta.icon ? itemData.meta.icon : ''"></span>
        <span class="titleTop">{{itemData.name}}</span>
      </div>
    </el-menu-item>
  </router-link>
  <!--<el-submenu v-else :index="String(index)">-->
  <el-submenu v-else :index="itemData.href">
    <template slot="title">
      <div class="titleBox">
        <!--<i class="icon icon-menu"></i>-->
        <span class="icon" :class="itemData.meta && itemData.meta.icon ? itemData.meta.icon : ''"></span>
        <span class="titleTop">{{itemData.name}}</span>
      </div>
    </template>
    <template v-for="(thirdItem, thirdIndex) in itemData.children">
      <SideBarItem v-if="!thirdItem.hidden" :itemData="thirdItem" :key="thirdIndex" :index="thirdIndex" />
    </template>
  </el-submenu>
</template>

<script>
export default {
  name: 'SideBarItem',
  props: {
    itemData: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    toLinkPath (itemData) {
      // console.log('路由的', item)
      return itemData.href
    },
    isActive (itemData) {
      if (this.$route.path === itemData.href) {
        return true
      }
      if (this.$route.path === itemData.redirect) {
        return true
      }
      let isActive = false
      if (itemData.meta && itemData.meta.childList && itemData.meta.childList.indexOf(this.$route.path) !== -1) {
        isActive = true
      }
      if (isActive) return isActive
      itemData.children && itemData.children.map(item => {
        if (item.href === this.$route.path || (item.meta && item.meta.childList && item.meta.childList.indexOf(this.$route.path) !== -1)) {
          isActive = true
        }
      })
      return isActive
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
