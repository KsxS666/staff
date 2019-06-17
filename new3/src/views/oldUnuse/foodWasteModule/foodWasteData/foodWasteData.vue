<!--厨余数据分析-->
<template>
  <div class="mainWrap">
    <div class="wrap">
      <div class="boxWrap topInfo">
        <div class="itemBox infoItem">
          <div class="imgBox launch"></div>
          <div><strong>{{data.houseCheckinCount || 0}}</strong>
            <p>实际投放总数</p></div>
        </div>
        <div class="itemBox infoItem">
          <div class="imgBox totalNum"></div>
          <div><strong>{{data.lanchCount || 0}}</strong>
            <p>累计投放次数</p></div>
        </div>
        <div class="itemBox infoItem">
          <div class="imgBox barrel"></div>
          <div><strong>{{data.recycleBucketCount || 0}}</strong>
            <p>累计回收桶数</p></div>
        </div>
        <div class="itemBox infoItem">
          <div class="imgBox point"></div>
          <div><strong>{{data.integralCount || 0}}</strong>
            <p>累计赠送积分</p></div>
        </div>
      </div>
      <div class="boxWrap middleInfo">
        <div class="itemBox bigItem">
          <h5 class="itemTitle">累计投放次数表</h5>
          <!-- 柱状图表 -->
          <launchChart :year="year"/>
        </div>
        <div class="itemBox smallItem">
          <h5 class="itemTitle">居民参与率</h5>
          <div class="progressBox">
            <v-progress :percentage="data.joinRate || 0" :showText="`${data.joinRate || 0}%`"/>
          </div>
        </div>
        <div class="itemBox smallItem">
          <h5 class="itemTitle">投放准确率</h5>
          <div class="progressBox">
            <v-progress :percentage="data.passRate || 0" :showText="`${data.passRate || 0}%`"/>
          </div>
        </div>
      </div>
      <div class="boxWrap bottomInfo">
        <div class="itemBox bigItem">
          <h5 class="itemTitle">回收量走势图</h5>
          <recycleChart :year="year"/>
        </div>
        <div class="itemBox smallItem totalLauchWrap">
          <div class="totalLauchBox">
            <v-progress :percentage="100" :showText="`${data.bucketCount || 0}`" :showTime="0"/>
            <span>个</span>
            <p>发放桶数量</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import progress from './components/progress'
import launchChart from './components/launchChart'
import recycleChart from './components/recycleChart'

export default {
  name: 'foodWasteData',
  components: { 'v-progress': progress, launchChart, recycleChart },
  data () {
    return {
      year: 2018,
      data: {
        houseCheckinCount: '', // 参与投放总户数
        lanchCount: '', // 累计投放总次数
        lanchPassCount: '', // 累计投放合格次数
        recycleBucketCount: '', // 累积回收桶数（240L）
        integralCount: '', // 累积赠送积分
        bucketCount: '', // 发桶数
        joinRate: '', // 参与率
        passRate: '', // 准确率
        lanchCountReportList: null, // 累积投放次数月份表
        joinRateReportList: [], // 参与率月份表
        lanchRateReportList: [], // 投放率月份表
        passRateReportList: [] // 准确率月份表
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      let res = await this.$post('user/communityStatistics/getReportByTotalData', { year: this.year })
      if (res.code === 0) {
        this.data = res.data
        this.data.joinRate = this.handlePercentage(this.data.joinRate) // 居民参与率 百分率
        this.data.passRate = this.handlePercentage(this.data.passRate) // 投放准确率 百分率
      }
    },
    // 处理百分率  取整 / 保留一位小数
    handlePercentage (num) { // num  0 - 1
      if (num > 1) {
        num = 1
      }
      num = num * 100
      return Number(num.toFixed(1))
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .mainWrap{
    width: 100%;
    overflow: auto;
  }
  .wrap{
    min-width: 1288px;
    height: 100%;
    min-height: calc(100vh - 56px);
    padding: 18px 40px;
    background: $background-color-liner;
  }
  .boxWrap{
    /*min-width: 1450px;*/
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .itemBox{
    background: #fff;
    box-shadow: 0 2px 5px 0 rgba(8, 52, 76, 0.2);
    border-radius: 4px;
  }
  .itemTitle{
    font-size: 22px;
    font-weight: normal;
    color: #999999;
    margin: 24px 0 0 26px;
  }
  .progressBox{
    width: 100%;
    height: calc(100% - 56px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .topInfo{
    .infoItem{
      display: flex;
      align-items: center;
      /*flex: 1;*/
      width: calc((100% - 80px) / 4);
      height: 136px;
      .imgBox{
        flex: 0 0 80px;
        width: 80px;
        height: 80px;
        margin:0 24px 0 34px;
        border-radius: 50%;
        background:  no-repeat center;
        background-size: 46px;
        &.launch{
          background-color: #1f87e6;
          background-image: url("assets/launch.png");
        }
        &.totalNum{
          background-color: #fdb32e;
          background-image: url("assets/totalNum.png");
        }
        &.barrel{
          background-color: #7360ed;
          background-image: url("assets/barrel.png");
        }
        &.point{
          background-color: #fd4b6d;
          background-image: url("assets/point.png");
        }
      }
      strong{
        font-size: 36px;
        font-weight: normal;
        line-height: 60px;
        color: #333333;
      }
      p{
        margin: 0;
        font-size: 20px;
        font-weight: 400;
        color: #666;
      }
    }
  }
  .middleInfo{
    margin: 24px 0;
    .itemBox{
      height: 454px;
    }
    .bigItem{
      width: calc((100% - 52px) / 9 * 4);
    }
    .smallItem{
      width: calc((100% - 52px) / 9 * 5 / 2 );
    }
  }
  .bottomInfo{
    .itemBox{
      height: 320px;
    }
    .bigItem{
      width: calc((100% - 26px) / 10 * 6);
    }
    .smallItem{
      width: calc((100% - 26px) / 10 * 4 );
      background: #fff url("assets/barrelBg.png") no-repeat right bottom;
      background-size: 200px auto;

    }
    .totalLauchWrap{
      display: flex;
      align-items: center;
      padding-left: 80px;
      .totalLauchBox{
        position: relative;
        color: #333;
        span{
          position: absolute;
          bottom: 46px;
          left: calc(50% - 13px);
          font-size: 24px;
          z-index: 10;
        }
        p {
          position: absolute;
          width: 160px;
          bottom: 0px;
          left: calc(50% - 80px);
          margin: 0;
          background: #fff;
          background: linear-gradient(135deg, transparent 15px, #fff 0) left,
          linear-gradient(-135deg, transparent 15px, #fff 0) right;
          background-size: 50% 100%;
          background-repeat: no-repeat;
          text-align: center;
          line-height: 50px;
          font-size: 20px;
          z-index: 10;
        }
      }
    }
  }
</style>
