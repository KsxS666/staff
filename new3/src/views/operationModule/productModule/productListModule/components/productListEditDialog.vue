<template>
  <v-dialog :title="`${type == 2?'编辑':'新建'}`" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent >
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="商品名称：" prop="name">
        <el-input type="text" v-model="formData.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="图片上传：" prop="img">
        <el-upload class="upload-demo" drag :action="uploadUrl" :file-list="fileList" :on-success="handlePreviewsucc" :show-file-list="false">
          <div v-if="imgUrl === ''">
            <i class="el-icon-upload"></i>
          </div>
          <img :src="imgUrl" alt="" v-else>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="所属类型：" prop="productTypeID">
        <el-select filterable clearable v-model="formData.productTypeID" placeholder="请选择" remote :loading="goodsTypeLoading" loading-text="加载中,请稍后..." :remote-method="getTypeList" style="width:100%">
          <el-option v-for="item in productTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="兑换类型 ：" prop="exchangeType">
        <el-radio v-model="formData.exchangeType" :label="0">个人</el-radio>
      </el-form-item>-->
      <el-form-item label="位置 ：" prop="locationCode">
        <el-radio v-model="formData.locationCode" :label="3">全部</el-radio>
        <el-radio v-model="formData.locationCode" :label="1">积分商城</el-radio>
        <el-radio v-model="formData.locationCode" :label="2">兑换机</el-radio>
      </el-form-item>
      <el-form-item label="积分：" prop="integral">
        <el-input v-model="formData.integral" type="number"></el-input>
      </el-form-item>
      <el-form-item label="价格：" prop="price">
        <el-input v-model="formData.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="库存：" prop="inventory">
        <el-input v-model="formData.inventory" type="number"></el-input>
      </el-form-item>
      <el-form-item label="是否垃圾袋：" prop="garbageBags">
        <el-radio v-model="formData.garbageBags" :label="1">是</el-radio>
        <el-radio v-model="formData.garbageBags" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="是否上架：" prop="shelves">
        <el-radio v-model="formData.shelves" :label="true">是</el-radio>
        <el-radio v-model="formData.shelves" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="是否推荐：" prop="shelves">
        <el-radio v-model="formData.recommend" :label="true">是</el-radio>
        <el-radio v-model="formData.recommend" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="编辑：" class="editor">
        <div class="createPost-main-container">
          <div class="editor-container" v-if="value">
            <Tinymce ref="editor" :height="400" v-model="formData.content" :is-edit="false"></Tinymce>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  name: 'productListEditDialog',
  components: { Tinymce },
  props: {
    value: Boolean,
    type: {
      // 1 是 新建  2是修改
      type: Number,
      default: 1
    },
    infoObj: { // 表单数据
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      // uploadUrl: `${process.env.BASE_API}/system/util/upload`,
      imgUrl: '',
      formData: {
        name: '',
        img: '',
        productTypeID: '',
        exchangeType: 0,
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
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        integral: [{ required: true, message: '请输入', trigger: 'blur' }],
        price: [{ required: true, message: '请输入', trigger: 'blur' }],
        img: [{ required: true, message: '请选择图片', trigger: 'change' }],
        exchangeType: [{ required: true, message: '请选择', trigger: 'change' }],
        locationCode: [{ required: true, message: '请选择', trigger: 'change' }],
        shelves: [{ required: true, message: '请选择', trigger: 'change' }],
        recommend: [{ required: true, message: '请选择', trigger: 'change' }],
        garbageBags: [{ required: true, message: '请选择', trigger: 'change' }],
        inventory: [{ required: true, message: '请输入', trigger: 'blur' }],
        productTypeID: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      productTypeList: [],
      fileList: [],
      saveLoading: false,
      goodsTypeLoading: false
    }
  },
  created () {
    this.getTypeList()
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
    // 获取商品类型列表
    async getTypeList () {
      this.goodsTypeLoading = true
      let res = await this.$post('system/goodsType/getGoodTypePage')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.productTypeList = res.data.resultList || []
      this.goodsTypeLoading = false
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
      this.saveLoading = true
      let req = Object.assign({}, this.formData)
      let type = this.type
      let res
      switch (type) {
        case 1:
          res = await this.$post('system/productDetail/addProductDetail', req)
          break

        default:
          res = await this.$post('system/productDetail/updateProductDetail', req)
          break
      }
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('保存成功！')
      this.$emit('success', true)
    },
    beforeClose () {
      this.$emit('input', false)
    },
    handlePreviewsucc (res, file, fileList) {
      this.formData.img = res.data[0]
      this.imgUrl = res.data[0]
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        name: '',
        img: '',
        productTypeID: '',
        defaultCode: '',
        exchangeType: 0,
        price: '',
        integral: '',
        inventory: '',
        shelves: true,
        recommend: false,
        content: '',
        locationCode: '',
        garbageBags: '',
        orgId: this.infoObj.orgId,
        provinceId: this.infoObj.provinceId,
        cityId: this.infoObj.cityId,
        matterAreaId: this.infoObj.matterAreaId
      }
      this.fileList = []
      this.imgUrl = ''
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          name: this.infoObj.name,
          img: this.infoObj.img,
          id: this.infoObj.id,
          productTypeID: this.infoObj.productTypeID,
          exchangeType: this.infoObj.exchangeType,
          price: this.infoObj.price,
          integral: this.infoObj.integral,
          inventory: this.infoObj.inventory,
          shelves: this.infoObj.shelves,
          recommend: this.infoObj.recommend,
          content: this.infoObj.content,
          locationCode: this.infoObj.locationCode,
          garbageBags: this.infoObj.garbageBags,
          orgId: this.infoObj.orgId,
          provinceId: this.infoObj.provinceId,
          cityId: this.infoObj.cityId,
          matterAreaId: this.infoObj.matterAreaId
        }
        this.imgUrl = this.infoObj.img
        this.fileList = [{ url: this.infoObj.img }]
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
    width: 180px;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items:center
  }
  .el-icon-upload{
    margin:0!important
  }
</style>
