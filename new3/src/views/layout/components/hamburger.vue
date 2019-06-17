<!-- 头部导航的左侧 -->
<template>
  <div class="wrap">
    <svg t="1492500959545" @click="toggleClick" class="svg" :class="{'is-active':isShowMenu}" style="" viewBox="0 0 1024 1024"
         version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1691" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64">
      <path d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"
            p-id="1692"></path>
      <path d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"
            p-id="1693"></path>
      <path d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"
            p-id="1694"></path>
    </svg>
    <!--<el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item to="/index">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, i) in titleList" :key="i"  :to="item.href">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>-->
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  data () {
    return {
      titleList: []
    }
  },
  computed: {
    isShowMenu () {
      return this.$store.getters.isShowMenu
    },
    showMenuList () {
      return this.$store.getters.showMenuList
    }
  },
  created () {
    this.getTitleList()
  },
  methods: {
    // 点击 切换显示菜单
    toggleClick () {
      this.$store.dispatch('ChangeMenuStatus', !this.isShowMenu)
    },
    // 获得导航列表
    getTitleList () {
      this.titleList = this.getTitle(this.showMenuList)
      if (!this.titleList.length && this.$route.matched && this.$route.matched.length && this.$route.path !== '/index') { // 没有在菜单中显示 就显示默认的路由的name
        this.titleList = []
        this.$route.matched.map(item => {
          this.titleList.push({
            href: item.path,
            name: item.name
          })
        })
        if (this.$route.meta && this.$route.meta.parentList) {
          let last = this.titleList.splice(this.titleList.length - 1, 1)
          let parentList = this.$route.meta.parentList
          this.titleList = this.titleList.concat(parentList).concat(last)
        }
      }
    },
    // 根据路径 获得对应的菜单的数组 (包括父级的)
    getTitle (menuList) {
      let titleArr = []
      let path = this.$route.path
      menuList.map(item => {
        if (item.href === path) {
          titleArr.push(item)
          return true
        }
        if (item.children && item.children.length) {
          let res = this.getTitle(item.children)
          if (res && res.length) {
            titleArr.push(item)
            titleArr = titleArr.concat(res)
          }
        }
      })
      return titleArr
    }
  },
  watch: {
    $route () {
      this.getTitleList()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .wrap{
    min-height: 56px;
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
  .svg {
    display: inline-block;
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    transform: rotate(0deg);
    transition: .38s;
    transform-origin: 50% 50%;
    &.is-active {
      transform: rotate(90deg);
    }
  }
</style>
