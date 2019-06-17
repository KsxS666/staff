<template>
  <header class="flex">
    <section class="logo" @click.stop.prevent="toggleSideBar"></section>
    <section class="census flex">
      <div class="flex">
        <strong class="title">总回收量</strong>
        <strong class="index-blue num"><countTo :startVal="0" :endVal="2201667" :duration="3000"></countTo><i>公斤</i></strong>
      </div>
      <div class="flex">
        <strong class="title">可回收总量</strong>
        <strong class="index-blue num"><countTo :startVal="0" :endVal="1962326" :duration="3000"></countTo><i>公斤</i></strong>
      </div>
      <div class="flex">
        <strong class="title">大件处理数量</strong>
        <strong class="index-blue num"><countTo :startVal="0" :endVal="36212" :duration="3000"></countTo><i>件</i></strong>
      </div>
    </section>
  </header>
</template>
<script>
import countTo from 'vue-count-to'
export default {
  name: 'Head',
  components: { countTo },
  data () {
    return {}
  },
  computed: {
    isShowMenu () {
      return this.$store.getters.isShowMenu
    }
  },
  methods: {
    toggleSideBar () {
      // this.$store.dispatch('ChangeMenuStatus', !this.isShowMenu)
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
  .index-blue{
    color: #06ebff
  }
  .flex{
    display: flex;
  }
  header{
    height: 10%;
    width: 100%;
    font-size: 16px;
    z-index: 1;
    padding: 0 50px;
    padding-right: 0;
    background: url(../../assets/topborder.png) center;
    background-size: 100% 100%;
    margin-bottom: 20px;
    z-index: 2;
    .logo{
      width: 200px;
      height: 100%;
      background: url(../../assets/logo.png) center no-repeat;
      background-size: 100% auto;
    }
    .census{
      flex: 1;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
      div{
        align-items: center;
        justify-content: center;
        width: calc((100% - 60px) / 3);
      }
      .title{
        font-size: 1.2vw;
        margin-right: 10px;
      }
      .num{
        font-size: 2.4vw;
        margin: 0 12px;
        i{
          font-size: 18px;
          font-style: normal;
          // font-weight: normal
        }
      }
    }
  }
</style>
