<!--居民排行榜表格-->
<template>
  <div id="Rank" class="flex">
    <section class="table-title">
      居民排行榜
    </section>
    <section class="table-content bac-set">
      <table border="0" style="width:100%;height:100%" cellspacing=0>
        <thead>
          <tr>
            <th>居民</th>
            <th>住址</th>
            <th>累计投放</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataList" :key="item.id">
            <td>{{item.userName}}</td>
            <td>{{item.address}}</td>
            <td>{{item.total}}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  name: 'rank',
  data () {
    return {
      dataList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () { // 获取居民排行榜列表
      let res = await this.$get('equipment/api/equipmentCast/castUserTotal')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.slice(0, 4) || 0
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
  #Rank{
    flex-flow: column nowrap;
    height: calc((47% - 40px));
    z-index: 2;
    .table-title{
      padding-left: 10px;
      border-left: 3px solid #06ebff;
      font-size: 16px;
      height: 16px;
      line-height: 16px;
      margin-bottom: 16px
    }
    .table-content{
      height: calc((100% - 32px));
      // background-image: url(../../assets/table2.png);
      position: relative;
      font-size: 14px;
      // box-shadow: 1px 1px 2px rgba(55, 78, 163, 0.7)
    }
      table{
        height: 100%;
        width: 100%;
        table-layout: fixed;
        thead{
          background: #1C5DAF;
          border-radius: 6px 6px 0 0;
          th{
            height: 30px;
          };
        };
        tbody{
          height: calc((100% - 30px));
          background: rgba(28, 90, 168, 0.4);
          // background-image: url(../../assets/table2.png);
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
</style>
