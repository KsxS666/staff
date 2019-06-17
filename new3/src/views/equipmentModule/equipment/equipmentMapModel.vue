<template>
  <div class="wrap">
    <div>
      <!-- <h3 class="title">分类设备点</h3> -->
      <header class="header card">
        <h3 class="title">爱家分类点分布地图</h3>
      </header>
    </div>

    <div class="content-box">
      <!-- <section class="filter">
        <div style="display: flex">
          <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" style="margin-right: 10px"></el-input>
          <el-button size="mini" type="primary" @click="toSearch">搜索</el-button>
          <el-button size="mini" @click="toReset">重置</el-button>
        </div>
        <el-tree class="filter-tree" :data="communityAreaList" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" @node-click="nodeClick"></el-tree>
      </section> -->
      <section class="map-wrp card" :class="isShowFull ? 'showFull' : ''">
        <div class="filter-wrp">
          <div style="display: flex; height: 100%; align-items: center;padding-left: 30px">
            <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" style="width: 200px; margin-right: 10px" @focus="handleFocus"></el-input>
            <el-button size="mini" type="primary" @click="toSearch">搜索</el-button>
            <el-button size="mini" @click="toReset">重置</el-button>
            <i class="icon v-cursor" @click="toFull" :class="isShowFull ? 'nofull' : 'full'" :title="isShowFull ? '取消全屏' : '全屏'"></i>
          </div>
          <transition name="el-zoom-in-top">
            <el-tree v-show="isTree" class="tree" :data="communityAreaList" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" @node-click="nodeClick"></el-tree>
          </transition>
        </div>
        <mapEquipment ref="map" :castTypeList="castTypeList" :areaName="areaName"></mapEquipment>
        <infoEquipment :castTypeList="castTypeList" />
      </section>
      <section class="chart-wrp" style="flex: 1">
        <category :castTypeList="castTypeList"/>
        <summmary :formData="formData"/>
      </section>
    </div>
  </div>
</template>

<script>
import mapEquipment from './components/mapEquipment'
import infoEquipment from './components/infoEquipment'
import category from './components/chart/category'
import summmary from './components/summary'
export default {
  name: 'equipmentMapModel',
  components: { mapEquipment, infoEquipment, category, summmary },
  data () {
    return {
      isTree: false,
      isShowFull: false,
      communityAreaList: [],
      castTypeList: {},
      formData: {
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: ''
      },
      areaName: '',
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created () {
    this.getCommunityAreaList()
    this.getCastTypeList()
  },
  methods: {
    handleFocus () {
      this.isTree = true
    },
    handleBlur () {
      this.isTree = false
    },
    toFull () {
      this.isShowFull = !this.isShowFull
      this.$refs.map.isShowFull = this.isShowFull
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    nodeClick (row, node, data) {
      this.areaName = row.label
      let level = node.level
      switch (level) {
        case 1:
          this.clearForm()
          this.formData.provinceId = row.id
          break
        case 2:
          this.clearForm()
          this.formData.cityId = row.id
          break
        case 3:
          this.clearForm()
          this.formData.districtId = row.id
          break
        case 4:
          this.clearForm()
          this.formData.communityId = row.id
          break
      }
    },
    async getCommunityAreaList () {
      let reqData = Object.assign({}, this.formData)
      let res = await this.$post('equipment/equipment/getCommunityAreaList', reqData)
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.communityAreaList = res.data || []
    },
    async getCastTypeList () {
      let reqData = Object.assign({}, this.formData)
      let res = await this.$post('equipment/equipment/getCastTypeList', reqData)
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.castTypeList = res.data || {}
    },
    toSearch () {
      this.$refs.tree.filter(this.filterText)
    },
    toReset () {
      this.filterText = ''
      this.isTree = false
      this.clearForm()
      this.toSearch()
    },
    clearForm () {
      this.formData = {
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: ''
      }
    }
  },
  watch: {
    // filterText (val) {
    //   this.$refs.tree.filter(val)
    // },
    formData: {
      deep: true,
      handler () {
        this.getCastTypeList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .card{
    background: #FFFFFF;
    box-shadow: -3px 5px 10px #DEDEDE;
    border-radius: 8px;
  }
  .wrap{
    height: 100%;
    min-height: 800px;
    min-width: 1505px;
    display: flex;
    flex-direction: column;
    h3.title{
      font-size: 22px;
      color: #767778;
      margin: 10px 20px;
    }
    /*background: #ffffff;*/
    header{
      position: relative;
      height: 70px;
      line-height: 70px;
      text-align: center;
      margin: 20px 20px 0 20px;
      .el-button{
        position: absolute;
        right: 20px;
        top: 7px;
      }
    }
    .content-box{
      display: flex;
      justify-content: space-around;
      height: calc(100% - 45px);
      padding: 20px;
      /*min-height: 600px;*/
      .map-wrp{
        flex-basis: 72%;
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        transition: .3s;
        .filter-wrp{
          height: 35px;
        }
        &.showFull{
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 1100;
          height: 100vh;
          width: 100vw;
        }
      }
      .chart-wrp{
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .filter-wrp{
        position: relative;
        .tree{
          position: absolute;
          width: 200px;
          left: 30px;
          z-index: 1;
        };
        i.full{
          background: url('./assets/images/full.png') no-repeat;
          background-size: 16px;
        }
        i.nofull{
          background: url('./assets/images/nofull.png') no-repeat;
          background-size: 16px;
        }
        .icon{
          display: inline-block;
          width: 20px;
          height: 20px;
          position: absolute;
          right: 10px;
        }
      }

    }
  }
</style>
