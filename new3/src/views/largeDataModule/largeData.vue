<template>
  <div id="index" @click.stop.prevent="toggleSideBar">
    <!--<side-bar/>-->
    <Head />
    <four-card />
    <Wrp />
  </div>
</template>

<script>

// import SideBar from '../layout/sideBar-old'
import Head from './fake/components/head2'
import FourCard from './fake/components/fourCard2'
import Wrp from './fake/components/wrp2'

export default {
  name: 'home-index',
  // eslint-disable-next-line standard/object-curly-even-spacing
  components: { Head, FourCard, Wrp },
  computed: {
    isShowMenu () {
      return this.$store.getters.isShowMenu
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('ChangeMenuStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  #index {
    height: 100vh;
    background: #0e1b4d url("assets/bgbak.png");
    padding: 0 30px 30px 30px;
    color: #ffffff;
    min-width: 1224px;
    min-height: 760px;
  }
</style>
