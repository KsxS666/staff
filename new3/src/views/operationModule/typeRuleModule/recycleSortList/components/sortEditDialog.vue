<!-- 回收类型编辑、查看、新建页面 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}类型`" class="dialogWrap" :visible="value" width="650px" :before-close="beforeClose">
    <el-form  class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="100px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <!-- <el-form-item label="上级类型"> {{formData.parentName}} </el-form-item> -->
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="排序"  v-if="infoObj.level === 1">
        <el-input v-model="formData.sort" @input="toSetNumber(formData, 'sort')"></el-input>
      </el-form-item>
      <el-form-item label="图片上传：" prop="img" v-if="type === 4 || infoObj.level === 2">
        <el-upload class="upload-demo" drag :action="uploadUrl" :file-list="fileList" :on-success="handlePreviewsucc" :show-file-list="false" list-type="picture">
          <div v-if="imgUrl === ''">
            <i class="el-icon-upload"></i>
          </div>
          <img :src="imgUrl" alt="" v-else>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      <!-- <el-upload class="upload-demo" :action="uploadUrl" :file-list="fileList" :on-success="handlePreviewsucc" :on-remove="handleRemove" list-type="picture" :limit="1" :on-exceed="overLimit">
        <el-button size="small" type="primary" plain>点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload> -->
      </el-form-item>
      <el-form-item label="注意事项" v-show="infoObj.level === 1 && type !== 4" prop="tip">
        <el-input type="textarea" placeholder="最多70个字" :maxlength="70" v-model="formData.tip"></el-input>
      </el-form-item>
      <!--<el-form-item label="" v-show="infoObj.level === 1 && type !== 4">
        <el-button size="small" icon="el-icon-plus" @click="addTips" style="margin-bottom: 6px">添加注意事项</el-button>
        <el-table class="v-table tableBox" border :data="tipsArr">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column align="center" label="注意事项" prop="tip">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              &lt;!&ndash;<el-button size="mini" @click="toShowEdit(scope.row)" type="primary" plain>编辑</el-button>&ndash;&gt;
              <el-button size="mini" @click="toDelete(scope.$index)" type="danger" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>-->
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'sortEditDialog',
  props: {
    value: Boolean,
    type: { // 1 是 新建  2是修改  4是添加下级
      type: Number,
      default: 1
    },
    infoObj: { // 表单数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    var tipValidator = (rule, value, callback) => {
      var sum = 0
      for (var i = 0; i < value.length; i++) {
        var c = value.charCodeAt(i)
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          sum++
        } else {
          sum += 2
        }
      }
      if (sum > 48) {
        callback(new Error('不可超过24个字'))
      }
      callback()
    }
    return {
      // uploadUrl: 'http://172.16.21.132:10000/system/util/upload',
      uploadUrl: this.$utils.uploadUrl,
      imgUrl: '',
      fileList: [],
      mainLoading: false,
      saveLoading: false,
      formData: {
        parentId: '', // 父级ID
        name: '',
        img: '',
        tip: ''
      },
      tipsArr: [],
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        tip: [{ validator: tipValidator, trigger: 'blur' }],
        img: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    // 添加注意事项
    addTips () {
      this.tipsArr.push({ value: '' })
    },
    beforeClose () {
      this.$emit('input', false)
    },
    handlePreviewsucc (res, file, fileList) {
      this.formData.img = res.data[0]
      this.imgUrl = res.data[0]
    },
    handleRemove (file, fileList) {
      this.fileList = []
      this.formData.img = ''
    },
    overLimit (file, fileList) {
      this.$message.error('只能上传一张图片，请先删除图片！')
    },
    // 删除单条注意事项
    toDelete (index) {
      this.tipsArr.splice(index, 1)
    },
    // 保存
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
        this.saveData()
      })
    },
    // 请求保存
    async saveData () {
      let tipArr = []
      this.tipsArr.map((i) => {
        if (!i.value) {
          console.log(i)
          // this.$message.error('请输入注意事项！')
          return
        }
        tipArr.push(i.value)
        // this.formData.tip.push(i.value)
      })

      if (tipArr.length < this.tipsArr.length) {
        this.$message.error('请输入注意事项！')
        return
      }

      // this.formData.tip = JSON.stringify(tipArr)
      this.saveLoading = true
      let res = await this.$post('integral/reclaimClassify/saveOrUpdate', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.$message.success('保存成功')
      this.$emit('success', true)
      this.beforeClose()
    }
  },
  watch: {
    // 监听是否显示弹窗--> 进行表单数据处理
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        parentId: '',
        name: '',
        img: '',
        tip: ''
      }
      this.tipsArr = []
      this.fileList = []
      // // 1 是 新建  2是编辑  4是添加下级
      if (this.type === 2) {
        this.formData.id = this.infoObj.id
        this.formData.name = this.infoObj.name
        this.formData.img = this.infoObj.img
        this.fileList = this.infoObj.level !== 1 ? [{ url: this.infoObj.img }] : []
        this.imgUrl = this.infoObj.img
        this.formData.tip = this.infoObj.tip
        // if (this.infoObj.level === 1) {
        //   if (this.infoObj.tip) {
        //     JSON.parse(this.infoObj.tip).map((i) => {
        //       let obj = { value: i }
        //       this.tipsArr.push(obj)
        //     })
        //   }
        // }
      }
      if (this.type === 4) {
        this.formData.parentId = this.infoObj.id
        this.formData.img = this.infoObj.img
        this.fileList = []
        this.imgUrl = ''
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
  .el-upload-dragger img{
    width: 100%;
    height: 100%
  }
</style>

<style>
  .el-upload-dragger{
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items:center
  }
  .el-icon-upload{
    margin:0!important
  }
</style>
