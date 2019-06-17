<template>
  <v-dialog
    :title="`${type == 2?'编辑':'新建'}`"
    class="dialogWrap"
    :visible.sync="value"
    width="50%"
    :before-close="beforeClose"
    @submit.native.prevent
  >
    <el-form
      :rules="formRules"
      ref="formDataRef"
      :model="formData"
      label-position="right"
      label-width="100px"
      style="margin-right: 20px"
    >
      <el-form-item
        label="题目："
        prop="problems"
      >
        <el-input
          type="text"
          v-model="formData.problems"
          placeholder="请输入题目"
          style="width:100%;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="题型："
        prop="isSelection"
      >
        <el-select
          filterable
          v-model="formData.isSelection"
          placeholder="请选择"
          @change="changeSelecttion"
          style="width:100%;"
        >
          <el-option
            label="单选题"
            :value="false"
          ></el-option>
          <el-option
            label="多选题"
            :value="true"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="排序："
        style="width:100%;"
      >
        <el-input
          type="tel"
          v-model="formData.sort"
          placeholder="请输入排序"
          style="width:100%;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="赠送积分："
        style="width:100%;"
        prop="integral"
      >
        <el-input
          type="tel"
          v-model="formData.integral"
          placeholder="请输入赠送积分"
          style="width:100%;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label
        style="width:100%;"
        label-width="20px"
      >
        <el-button
          size="small"
          @click="toAdd"
        >新增选项</el-button>
        <el-table
          class="v-table"
          border
          :data="listData"
        >
          <el-table-column
            align="center"
            label="序号"
            width="50"
          >
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="选项内容"
          >
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row.content"
                style="width: 440px;"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="选择答案"
            width="100"
          >
            <template slot-scope="scope">
              <!--<el-radio v-show="!formData.isSelection" v-model="formData.radio" :label="scope.$index" style="margin-left: 17px"> &nbsp; </el-radio>-->
              <el-checkbox
                v-model="scope.row.isTrue"
                @change="selectAnswer(scope.row)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <!--<el-button size="mini" @click="toShowEdit(scope.row)" type="primary" plain>编辑</el-button>-->
              <el-button
                style="margin-left: 10px"
                size="mini"
                @click="toDelete(scope.$index)"
                type="danger"
                plain
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="beforeClose">取 消</el-button>
      <el-button
        type="primary"
        :loading="saveLoading"
        @click="toSave"
      >确 定</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'answerListEditDialog',
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
    }
  },
  data () {
    return {
      // uploadUrl: `${process.env.BASE_API}/system/util/upload`,
      formData: {
        name: '',
        img: '',
        productTypeID: '',
        defaultCode: '',
        exchangeType: '',
        price: '',
        integral: '',
        inventory: '',
        shelves: true,
        recommend: false,
        content: '',
        locationCode: '',
        garbageBags: '',
        matterAreaId: ''
      },
      formRules: {
        problems: [
          { required: true, message: '请输入题目', trigger: 'blur' },
          { min: 2, max: 10, message: '最少2位，最多10位', trigger: 'blur' }
        ],
        integral: [
          { required: true, message: '请输入赠送积分', trigger: 'blur' }
        ],
        isSelection: [
          { required: true, message: '请选择题型', trigger: 'change' }
        ]
      },
      listData: [], // 添加的答案的选项
      saveLoading: false,
      goodsTypeLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    uploadUrl () {
      return this.$utils.uploadUrl
    }
  },
  methods: {
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
    changeSelecttion () {
      if (this.formData.isSelection) {
        // 多选
        return false
      }
      // 单选
      this.listData.map(itemObj => {
        if (itemObj.isTrue) {
          itemObj.listData = false
        }
      })
      this.listData = JSON.parse(JSON.stringify(this.listData))
    },
    // 删除选项
    toDelete (index) {
      this.listData.splice(index, 1)
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    },
    // 保存
    toSave () {
      this.$refs['formDataRef'].validate(valid => {
        if (!valid) return false
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
        this.$notify.success({
          title: '成功',
          message: `${this.itemInfo ? '修改成功' : '新增成功'}`
        })
        this.$emit('confirm', true)
        this.beforeClose()
      }
    },
    handlePreviewsucc (res, file, fileList) {
      this.formData.img = res.data[0]
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        problems: '',
        integral: '',
        sort: '',
        img: '',
        isSelection: '',
        dataArray: [],
        orgId: this.infoObj.orgId,
        matterAreaId: this.infoObj.matterAreaId
      }
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          problems: this.infoObj.problems,
          integral: this.infoObj.integral,
          sort: this.infoObj.sort,
          img: this.infoObj.img,
          isSelection: this.infoObj.isSelection,
          dataArray: [],
          orgId: this.infoObj.orgId,
          matterAreaId: this.infoObj.matterAreaId
        }
      }
      this.formData = JSON.parse(JSON.stringify(this.formData))
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped>
</style>
