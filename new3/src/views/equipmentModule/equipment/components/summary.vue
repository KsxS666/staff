<template>
  <div id="summary">
    <weight :weightList="weightList"/>
    <integral :integralList="integralList" />
  </div>
</template>

<script>
import weight from './chart/weight'
import integral from './chart/integral'
export default {
  name: 'summmary',
  components: { weight, integral },
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dataList: [],
      weightList: [],
      integralList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      let reqData = Object.assign({}, this.formData)
      let res = await this.$post('equipment/equipment/getCastSummaryList', reqData)
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
      this.weightList = []
      this.integralList = []
      this.dataList.map(ele => {
        this.weightList.push({ value: parseFloat(ele.weightPercent), name: ele.typeName })
        this.integralList.push({ value: parseFloat(ele.integralPercent), name: ele.typeName })
      })
    }
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.getList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #summary{
    width: 100%;
    height: 67%;
    display: flex;
    flex-flow: column nowrap;
  }
</style>
