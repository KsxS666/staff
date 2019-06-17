<template>
  <v-dialog :title="`${type === 2?'编辑':'新建'}题目`" class="dialogWrap" :visible="value" width="800px" :before-close="beforeClose">
    <el-form :rules="formRules" ref="formDataRef" :model="formData" label-position="right" label-width="100px" style="margin-right: 20px" @submit.native.prevent>
      <el-form-item label="题目" prop="problems">
        <el-input type="text" v-model="formData.problems" placeholder="请输入题目"></el-input>
      </el-form-item>
      <el-form-item label="题型" prop="isSelection">
        <el-radio v-model="formData.isSelection" :label="false" @change="changeSelect">单选题</el-radio>
        <el-radio v-model="formData.isSelection" :label="true" @change="changeSelect">多选题</el-radio>
        <!--<el-select filterable v-model="formData.isSelection" placeholder="请选择" @change="changeSelect" style="width:100%;">
          <el-option label="单选题" :value="false"></el-option>
          <el-option label="多选题" :value="true"></el-option>
        </el-select>-->
      </el-form-item>
      <el-form-item label="排序">
        <el-input type="tel" v-model="formData.sort" placeholder="请输入排序" @input="toSetNumber(formData, 'sort')"></el-input>
      </el-form-item>
      <el-form-item label="赠送积分"  prop="integral">
        <el-input type="tel" v-model="formData.integral" placeholder="请输入赠送积分" @input="toSetNumber(formData, 'integral')"></el-input>
      </el-form-item>
      <el-form-item label-width="20px">
        <el-button size="small" icon="el-icon-plus" @click="toAdd" style="margin-bottom: 6px">新增选项</el-button>
        <el-table class="v-table tableBox" border :data="listData">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column align="center" label="选项内容">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.content"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="选择答案" width="100">
            <template slot-scope="scope">
              <!--<el-radio v-show="!formData.isSelection" v-model="formData.radio" :label="scope.$index" style="margin-left: 17px"> &nbsp; </el-radio>-->
              <el-checkbox v-model="scope.row.isTrue" @change="selectAnswer(scope.row)"></el-checkbox>
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
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'answerEditDialog',
  props: {
    value: Boolean,
    type: {
      // 1 是 新建  2是修改
      type: Number,
      default: 1
    },
    infoObj: {
      // 表单数据
      type: Object,
      default: () => {}
    },
    matterAreaId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formData: {
        problems: '', // 题目
        integral: '', // 积分
        sort: '', // 排序
        isSelection: false, // 是否多选
        matterAreaId: this.matterAreaId
      },
      formRules: {
        problems: [
          { required: true, message: '请输入题目', trigger: 'blur' }
          // { min: 2, max: 10, message: '最少2位，最多10位', trigger: 'blur' }
        ],
        integral: [{ required: true, message: '请输入赠送积分', trigger: 'blur' }],
        isSelection: [{ required: true, message: '请选择题型', trigger: 'change' }]
      },
      listData: [], // 添加的答案的选项
      saveLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    // 新增选项
    toAdd () {
      this.listData.push({
        content: '',
        isTrue: false
      })
    },
    // 选择选项 -- 控制单选多选
    selectAnswer (item) {
      if (this.formData.isSelection) {
        // 是多选
        return false
      }
      if (!item.isTrue) {
        // 不是选中的
        return false
      }
      // 单选 -- 选中
      this.listData.map(itemObj => {
        if (itemObj.isTrue) {
          itemObj.isTrue = false
        }
      })
      item.isTrue = true
      this.listData = JSON.parse(JSON.stringify(this.listData))
    },
    // 切换单多选
    changeSelect () {
      if (this.formData.isSelection) {
        // 多选
        return false
      }
      // 单选
      this.listData.map(itemObj => {
        if (itemObj.isTrue) {
          itemObj.isTrue = false
        }
      })
      this.listData = JSON.parse(JSON.stringify(this.listData))
    },
    // 删除选项
    toDelete (index) {
      this.listData.splice(index, 1)
    },
    // 保存
    toSave () {
      this.$refs['formDataRef'].validate((valid, validObj) => {
        if (!valid) {
          for (let item in validObj) {
            this.$message.error(validObj[item][0].message)
            return false
          }
          return false
        }
        // 下面是校验表格的数据
        if (!this.listData.length) {
          this.$message.error('请添加选项')
          return false
        }
        if (this.listData.length < 2) {
          this.$message.error('至少要有两条选项')
          return false
        }
        // 判断每个项是否有输入
        let inputList = this.listData.filter(item => {
          item.content = item.content ? item.content.trim() : null
          return item.content
        })
        if (inputList.length < this.listData.length) {
          this.$message.error('请输入选项内容')
          return false
        }
        // 选中的选项
        let selectList = this.listData.filter(item => {
          return item.isTrue
        })
        if (!selectList.length) {
          this.$message.error('请选择答案')
          return false
        }
        if (this.formData.isSelection && selectList.length < 2) {
          // 多选
          this.$message.error('请至少选择两个答案')
          return false
        }
        if (!this.formData.isSelection && selectList.length > 1) {
          // 单选
          this.$message.error('单选题只能选择一个答案')
          return false
        }
        // 下面是保存
        // this.$emit('confirm', true)
        // this.beforeClose()
        this.saveData()
      })
    },
    // 保存数据
    async saveData () {
      let reqData = Object.assign({}, this.formData)
      this.listData.map((item, i) => {
        item.sort = i + 1
      })
      reqData.dataArray = JSON.stringify(this.listData)
      this.saveLoading = true
      let res = await this.$post('/system/matter/addMatter', reqData)
      this.saveLoading = false
      if (res.code === 0) {
        this.$message.success('保存成功')
        this.$emit('success', true)
        this.beforeClose()
      }
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        problems: '', // 题目
        integral: '', // 积分
        sort: '', // 排序
        isSelection: false, // 是否多选
        matterAreaId: this.matterAreaId
      }
      this.listData = []
      // 编辑
      if (this.type !== 1) {
        this.formData.problems = this.infoObj.problems
        this.formData.integral = this.infoObj.integral
        this.formData.sort = this.infoObj.sort
        this.formData.isSelection = this.infoObj.isSelection
        this.formData.matterId = this.infoObj.id
        this.infoObj.answerList && this.infoObj.answerList.map(item => {
          this.listData.push({
            id: item.id,
            content: item.content,
            isTrue: item.isTrue
          })
        })
      }
      this.formData = JSON.parse(JSON.stringify(this.formData))
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .tableBox{
    line-height: 22px;
  }
</style>
