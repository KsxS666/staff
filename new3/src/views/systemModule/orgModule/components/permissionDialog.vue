<!-- 权限管理 -->
<template>
  <v-dialog title="权限管理" class="dialogWrap" :visible="value" width="700px" :before-close="beforeClose">
    <el-form  class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="110px" style="margin-right: 20px"  v-loading="mainLoading" size="small" @submit.native.prevent>
      <el-form-item label="机构名称"> {{infoObj.name}} </el-form-item>
      <el-form-item label="添加管理员">
        <el-select filterable clearable multiple v-model="formData.adminIdArr">
          <el-option v-for="(item, i) in adminList" :key="i" :label="`${item.username}—${item.name}`" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加菜单">
        <menuPermission v-model="value" :infoObj="infoObj" :formData="formData" :menuIdArr="formData.menuIdArr" ref="menuPermission"/>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
import menuPermission from './menuPermission'
export default {
  name: 'permissionsDialog',
  components: { menuPermission },
  props: {
    value: Boolean,
    infoObj: { // 表单数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      mainLoading: false,
      saveLoading: false,
      formData: {
        adminIdArr: [], // 管理员id集合
        menuIdArr: [], // 菜单id集合
        buttonIdArr: [] // 菜单id集合
      },
      formRules: {},
      adminList: [] // 管理员列表
    }
  },
  mounted () {
    this.getAdminList()
  },
  methods: {
    // 获得管理员列表
    async getAdminList () {
      let res = await this.$post('system/admin/getList')
      if (res.code === 0) {
        this.adminList = res.data.filter(item => {
          return item.username !== 'admin'
        })
      }
    },
    // 获得该机构下面的详情
    async getDetail () {
      this.formData = {
        adminIdArr: [], // 管理员id集合
        menuIdArr: [], // 菜单id集合
        buttonIdArr: [] // 菜单id集合
      }
      if (this.infoObj.permissionObj) {
        this.formData.adminIdArr = this.infoObj.permissionObj.adminIds ? this.infoObj.permissionObj.adminIds.split(',') : []
        this.formData.menuIdArr = this.infoObj.permissionObj.menuIds ? this.infoObj.permissionObj.menuIds.split(',') : []
        this.formData.buttonIdArr = this.infoObj.permissionObj.buttonIds ? this.infoObj.permissionObj.buttonIds.split(',') : []
        return
      }
      this.mainLoading = true
      let res = await this.$post('system/organization/getById', { organizationId: this.infoObj.id })
      this.mainLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.infoObj.permissionObj = {
        adminIds: res.data.adminIds || '',
        menuIds: res.data.menuIds || '',
        buttonIds: res.data.buttonIds || ''
      }
      this.formData.adminIdArr = this.infoObj.permissionObj.adminIds ? this.infoObj.permissionObj.adminIds.split(',') : []
      this.formData.menuIdArr = this.infoObj.permissionObj.menuIds ? this.infoObj.permissionObj.menuIds.split(',') : []
      this.formData.buttonIdArr = this.infoObj.permissionObj.buttonIds ? this.infoObj.permissionObj.buttonIds.split(',') : []
    },
    // 保存
    toSave () {
      // 获得选中的菜单
      let data = this.$refs.menuPermission.getAllCheck()
      console.log(data)
      this.saveData(data)
      // this.$refs.ruleForm.validate((valid, validObj) => {
      //   if (!valid) {
      //     for (let item in validObj) {
      //       this.$message.error(validObj[item][0].message)
      //       return false
      //     }
      //     return false
      //   }
      //   // 下面是保存
      //   this.saveData()
      // })
    },
    // 请求保存
    async saveData ({ menuList, btnList }) {
      let reqData = {
        organizationId: this.infoObj.id,
        adminIds: this.formData.adminIdArr.join(','),
        menuIds: menuList.join(','),
        buttonIds: btnList.join(',')
      }
      this.saveLoading = true
      let res = await this.$post('system/organization/bindAdminAndMenu', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.$message.success('保存成功')
      this.infoObj.permissionObj = reqData
      this.$emit('success', true)
      this.beforeClose()
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    // 监听是否显示弹窗--> 进行表单数据处理
    value (newValue) {
      if (!newValue) return false
      this.getDetail()
      // this.formData = {
      //   parentId: '', // 父级菜单ID
      //   parentName: '', // 父级菜单name
      //   name: '', // 名称
      //   phone: '', // 手机
      //   type: 1, // 1-公司 2-部门 3-区域
      //   email: '', // 邮箱
      //   address: '' // 地址
      // }
      // // // 1 是 新建  2是修改  4是添加下级
      // if (this.type === 2) {
      //   this.formData.parentId = this.infoObj.id
      //   this.formData.parentName = this.infoObj.name
      //   this.formData.name = this.infoObj.name
      //   this.formData.phone = this.infoObj.phone
      //   this.formData.type = this.infoObj.type
      //   this.formData.email = this.infoObj.email
      //   this.formData.address = this.infoObj.address
      // }
      // if (this.type === 4) {
      //   this.formData.parentId = this.infoObj.id
      //   this.formData.parentName = this.infoObj.name
      //   this.formData.type = 2
      // }
      // this.formData = JSON.parse(JSON.stringify(this.formData))
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
