<!--投放详情表格-->
<template>
  <div id="cast" class="flex">
    <section class="table-title">
      投放详情
    </section>
    <section class="table-content bac-set">
      <table border="0" style="width:100%;height:100%" cellspacing=0>
        <thead>
          <tr>
            <th>类型</th>
            <th>今日投放</th>
            <th>累计投放</th>
          </tr>
        </thead>
        <tbody v-if="dataList">
          <tr v-for="item in dataList" :key="item.id">
            <td>{{item.typeName}}</td>
            <td>{{item.todayTotal}}</td>
            <td>{{item.total}}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr><td>111</td></tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  name: 'cast',
  data () {
    return {
      dataList: [{typeName: '金属', total: 0}, {typeName: '金属', total: 0}, {typeName: '金属', total: 0}, {typeName: '金属', total: 0}] // 初始数据
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      let res = await this.$get('equipment/api/equipmentCast/castTypeTotalTotal')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.slice(0, 4) || [{typeName: '金属', total: 0}, {typeName: '金属', total: 0}, {typeName: '金属', total: 0}, {typeName: '金属', total: 0}]
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-blue{
    color: #06ebff
  }
  .flex{
    display: flex
  }
  .bold{
    font-weight: bold
  }
  .bac-set{
    background-position: center;
    background-size: 100% 100%
  }
  #cast{
    flex-flow: column nowrap;
    height: 33%;
    margin-bottom: 20px;
    z-index: 2;
    .table-title{
      padding-left: 10px;
      border-left: 3px solid #06ebff;
      font-size: 16px;
      line-height: 16px;
      margin-bottom: 16px
    }
    .table-content{
      height: calc((100% - 28px));
      // background-image: url(../../assets/table1.png);
      position: relative;
      font-size: 14px;
      table{
        height: 100%;
        width: 100%;
        thead{
          background: #1C5DAF;
          border-radius: 6px 6px 0 0;
          th{
            height: 28px;
          };
        };
        tbody{
          height: calc((100% - 30px));
          background: rgba(28, 90, 168, 0.4);
          tr{
            transition: .3s;
            width: 100%;
          };
          tr:hover{
            background: #0a55b8;
          };
        };
        td{
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

</style>
