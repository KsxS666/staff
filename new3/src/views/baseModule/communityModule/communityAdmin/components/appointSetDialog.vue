<!-- 管理员编辑、新建页面 -->
<template>
  <v-dialog title="预约时间段配置"  :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" ref="ruleForm" label-width="80px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="">
        <el-button size="small" icon="el-icon-plus" @click="toAdd" style="margin-bottom: 6px">添加时间段</el-button>
        <el-table class="v-table tableBox" border :data="formData.timeArr">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column align="center" label="预约时间段">
            <template slot-scope="scope">
              <el-time-picker :picker-options="{selectableRange: '18:30:00 - 20:30:00'}" style="margin-bottom:10px" is-range v-model="scope.row.value" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH,mm" format="HH:mm"></el-time-picker>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <!--<el-button size="mini" @click="toShowEdit(scope.row)" type="primary" plain>编辑</el-button>-->
              <el-button size="mini" @click="toDelete(scope.$index)" type="danger" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="saveData">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'appointSet',
  props: {
    value: Boolean,
    infoObj: { // 表单数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formData: {
        timeArr: []
      },
      saveLoading: false,
      dataList: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取预约时间段列表
    async getList () {
      this.mainLoading = true
      let res = await this.$post('system/keyValue/getAppointmentTime')
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      let array = []
      if (res.data.length) {
        res.data.map((i) => {
          let obj = {}
          // obj.value = `${i.startHour},${i.startMinute}-${i.endHour},${i.endMinute}`
          obj.value = [`${i.startHour},${i.startMinute}`, `${i.endHour},${i.endMinute}`]
          array.push(obj)
        })
        this.formData.timeArr = array
        this.formData.reqData = res.data
      }
    },
    // 添加预约时间段
    toAdd () {
      this.formData.timeArr.push({ value: '' })
    },
    // 请求保存
    async saveData () {
      let reqData = Object.assign({}, this.formData)
      let reqArr = []
      reqData.timeArr.map(i => {
        if (!i.value || !i.value.length) {
          return
        }
        let ele = `${i.value[0]},${i.value[1]}`
        reqArr.push(ele)
      })
      if (reqArr.length < reqData.timeArr.length) {
        return this.$message.warning('请选择输入时间')
      }
      this.saveLoading = true
      let res = await this.$post('system/keyValue/addAppointmentTime', { dataArray: JSON.stringify(reqArr) })
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }

      this.beforeClose()
      this.$message.success('保存成功')
      this.$emit('success', true)
      // let reqArr = []
      // reqData.timeArr.map((i) => {
      //   let ele = `${i.value[0]},${i.value[1]}`
      //   reqArr.push(ele)
      // })
      // let res = await this.$post('system/keyValue/addAppointmentTime', {dataArray: JSON.stringify(reqArr)})
      // this.saveLoading = false
      // if (res.code !== 0) {
      //   res.msg && this.$message.error(res.msg)
      //   return false
      // }

      // this.beforeClose()
      // this.$message.success('保存成功')
      // this.$emit('success', true)
    },
    // 删除预约时间端
    toDelete (index) {
      this.formData.timeArr.splice(index, 1)
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">

</style>
