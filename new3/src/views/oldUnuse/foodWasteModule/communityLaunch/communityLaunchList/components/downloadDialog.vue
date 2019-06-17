<!-- 按日期导出弹窗 -->
<template>
  <v-dialog title="按日期导出" :visible="value" width="500px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="70px"
             style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="小区" prop="communityName">
        <el-select filterable clearable v-model="formData.communityName">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="timeArr">
        <el-date-picker v-model="formData.timeArr" type="daterange" range-separator="至" start-placeholder="开始日期"
                        value-format="yyyy-MM-dd" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <p class="v-top-info v-gray" style="margin-left: 70px">日期限制在 31 天内</p>
    </el-form>
    <div slot="footer">
      <el-button @click="beforeClose">取 消</el-button>
      <el-button type="primary" :loading="saveLoading" @click="toSave">导 出</el-button>
    </div>
  </v-dialog>
</template>

<script>

export default {
  name: 'downloadDialog',
  props: {
    value: Boolean,
    communityList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    const checkTime = (rule, value, callback) => {
      // 判断是否是31天内
      let starTime = new Date(value[0])
      let endTime = new Date(value[1])
      let time = (endTime - starTime) / 1000 / 60 / 60 / 24
      console.log(time)
      if (time > 30) {
        return callback(new Error('日期限制在 31 天内'))
      }
      callback()
    }
    return {
      formData: {
        timeArr: [],
        communityName: ''
      },
      formRules: {
        timeArr: [{ required: true, message: '请选择日期', trigger: 'change' }, { validator: checkTime, trigger: 'change' }],
        communityName: [{ required: true, message: '请选择小区', trigger: 'change' }]
      },
      saveLoading: false
    }
  },
  methods: {
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    },
    toSave () {
      this.$refs.ruleForm.validate((valid, validObj) => {
        if (!valid) {
          for (let item in validObj) {
            this.$message.error(validObj[item][0].message)
            return false
          }
          return false
        }
        // 下面是保存
        this.toDownload()
      })
    },
    // 导出用户
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      req.startTime = req.timeArr && req.timeArr.length ? req.timeArr[0] : ''
      req.endTime = req.timeArr && req.timeArr.length ? req.timeArr[1] : ''
      delete req.timeArr

      // let url = `${process.env.BASE_API}/user/communityLaunch/exportReport?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('user/communityLaunch/exportReport', req)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      // 重置数剧
      this.formData.timeArr = []
      this.formData.communityName = ''
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
<style lang="scss" rel="stylesheet/scss">

</style>
