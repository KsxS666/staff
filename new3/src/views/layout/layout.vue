<template>
  <!--<div class="appWrapper">
    <side-bar class="sidebarContainer"/>

    <div class="mainContainer" :class="{'showAll': !isShowMenu}">
      <nav-bar class="navBar" />
      <div class="mainContent">
        <transition name="fade-transform" mode="out-in">
          <router-view :key="key" />
        </transition>
      </div>
    </div>
  </div>-->
  <div class="appWrapper">
    <nav-bar class="navBar"></nav-bar>
    <div class="mainContainer">
      <side-bar class="sidebarContainer" :class="{'hide': !isShowMenu}"></side-bar>
      <div class="mainContent">
        <transition name="fade-transform" mode="out-in">
          <router-view :key="key"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar'
import SideBar from './components/SideBar'
export default {
  name: 'layout',
  components: {
    NavBar,
    SideBar
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    },
    isShowMenu () {
      return this.$store.getters.isShowMenu
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .appWrapper{
    width: 100%;
    height: 100vh;
    background: $background-color;
    .navBar{
      height: 70px;
      width: 100%;
      min-width: 1507px;
      /*border-bottom: 2px solid #F8F8FA;*/
    }
    .mainContainer{
      height: calc( 100vh - 70px );
      width: 100%;
      display: flex;
      .sidebarContainer{
        flex: 0 0 240px;
        /*height: calc( 100vh - 60px );*/
        overflow-x: hidden;
        overflow-y: auto;
        transition: 0.3s;
        /*height: 100%;*/
        /*position: fixed;
        left: 0;
        top: 60px;
        bottom: 0;
        width: 250px;
        background: $module-color;*/
        /*overflow: hidden;*/
        &.hide{
          flex: 0;
        }
      }
      .mainContent{
        flex: 1;
        /*margin-left: 250px;*/
        height: 100%;
        // padding: 20px;
        overflow: auto;
      }
    }

  }
  /*.appWrapper{
    width: 100%;
    height: 100vh;
    background: $background-color;
    !*display: flex;*!
    .navBar{
      height: 56px;
      width: 100%;
    }
    !*.sidebarContainer{*!
      !**!
    !*}*!
    .mainContainer{
      !*height: calc( 100vh - 60px );*!
      height: 100vh;
      !*width: 100%;*!
      margin-left: 200px;
      transition: margin-left 0.3s;
      &.showAll{
        margin-left: 0;
      }
      !*flex: 1;*!
      .mainContent{
        height: calc( 100vh - 56px );
        !*padding: 0 20px;*!
        overflow: auto;
      }
    }

  }*/
</style>
