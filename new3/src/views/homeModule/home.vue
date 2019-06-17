<template>
  <div class="overviewWrap">
    <div class="boxWrap">
      <WasteLaunch class="box" />
      <PeopleJoin class="box" />
    </div>
    <div class="boxWrap bottomBox">
      <WasteType class="box" />
      <PeopleLaunch class="box" />
    </div>
  </div>
</template>

<script>
import WasteLaunch from './components/WasteLaunch'
import PeopleJoin from './components/PeopleJoin'
import WasteType from './components/WasteType'
import PeopleLaunch from './components/PeopleLaunch'
export default {
  name: 'home',
  components: { WasteLaunch, PeopleJoin, WasteType, PeopleLaunch },
  created () {
    this.getAuth()
  },
  methods: {
    getAuth () {
      const menuIds = this.$store.getters.userInfo.menuIds.split(',')
      // console.log(menuIds)
      let result = menuIds.filter(ele => {
        return ele === '/equipmentModule' || ele === '/equipmentModule/flowWarn'
      })
      // console.log(result)
      if (!result.length) return false
      this.getWarnNum()
    },
    async getWarnNum () {
      this.mainLoading = true
      let res = await this.$post('equipment/simCard/getWarnNum')
      this.mainLoading = false
      if (res.code === 0) {
        if (res.data.warnNum > 0) {
          const h = this.$createElement
          this.$msgbox({
            title: '消息',
            message: h('p', null, [
              h('span', null, `目前有${res.data.warnNum}张流量卡预警，请及时处理解决！`),
              h('br'),
              h('span', { style: 'color: teal' }, '点击确认跳转到流量卡预警列表')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '跳转中...'
                done()
                setTimeout(() => {
                  instance.confirmButtonLoading = false
                }, 300)
              } else {
                done()
              }
            }
          }).then(action => {
            this.$router.push('/equipmentModule/flowWarn/flowWarnTab')
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .overviewWrap {
    width: 100%;
    min-width: 1288px;
    /*height: 100%;*/
    min-height: calc(100vh - 70px);
    padding: 20px;
    background: $background-color-liner;
    .boxWrap{
      display: flex;
      /*align-items: center;*/
      justify-content: space-between;
      margin-bottom: 20px;
      .box{
        /*flex: 1;*/
        &+.box{
          margin-left: 20px;
        }
      }
    }
    .bottomBox{
      margin-bottom: 0;
      /*min-height: calc(100% - 440px);*/
      .box{
        height: calc(100vh - 520px);
        min-height: 500px;
        overflow: hidden;
      }
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .overviewWrap {
    .box {
      /*padding: 30px 30px 0;*/
      background: #fff;
      border-radius: 8px;
      height: 100%;
      .title{
        color: $text-primary;
        font-size: $font-sub-title;
        margin: 30px 30px 20px;
        font-weight: normal;
      }
      .numBox{
        padding: 0 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        div{
          /*flex: 1;*/
          display: flex;
          flex-direction: column;
          &.right{
            align-items: flex-end;
          }
          strong{
            position: relative;
            font-size: 30px;
            i{
              content: ' ';
              display: inline-block;
              width: 16px;
              height: 16px;
              /*margin-left: 4px;*/
              background-repeat: no-repeat;
              background-position: center;
              /*background: no-repeat center;*/
              background-size: contain;
            }
          }
          span{
            margin-top: -6px;
            color: $text-third;
          }
        }
      }
    }
  }
</style>
