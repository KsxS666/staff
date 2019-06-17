<!-- 权限管理 菜单权限 -->
<template>
  <div class="box">
    <el-tree ref="tree" :data="menuList" show-checkbox node-key="href" :render-after-expand="false" class="menuPermissionTreeWrap" v-loading="mainLoading" @check-change="checkChange">
      <div class="v-tree-item" slot-scope="{ node, data }">
        <span v-if="node.level === 1">{{data.name}}</span>
        <div v-else>
          <span>{{data.name}}</span>
          <ul class="btnListBox">
            <li class="v-hidden" v-for="(item, i) in data.btnList" :key="i" @click="checkSingle(item, data, i)">
              <!--<el-checkbox v-model="item.checked"></el-checkbox>-->
              <!--<span aria-checked="mixed" class="el-checkbox__input" :class="{'is-checked': item.checked}">-->
              <span aria-checked="mixed" class="el-checkbox__input" :class="{'is-checked': isChecked(item.id)}">
                <span class="el-checkbox__inner"></span>
              </span>
              <span style="margin-left: 6px">{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'menuPermission',
  props: {
    value: Boolean,
    formData: { // 表单数据
      type: Object,
      default: () => {}
    },
    menuIdArr: null
  },
  data () {
    return {
      mainLoading: false,
      saveLoading: false,
      menuList: [], // 菜单列表
      checkedBtnList: new Set() // 选中的按钮的项
    }
  },
  computed: {
    showMenuList () {
      return this.$store.getters.showMenuList
    }
  },
  mounted () {
    this.menuList = JSON.parse(JSON.stringify(this.showMenuList))
  },
  methods: {
    // 回显之前的选中状态
    async getOldCheck () {
      this.$refs.tree.setCheckedKeys(this.formData.menuIdArr || [])
      this.$nextTick(() => {
        this.checkedBtnList.clear()
        if (this.formData.buttonIdArr && this.formData.buttonIdArr.length) {
          this.checkedBtnList = new Set([...this.formData.buttonIdArr])
        }
      })

      // if (this.infoObj.permissionObj) { // 之前已缓存的数据
      //   this.$refs.tree.setCheckedKeys(this.infoObj.permissionObj.menuList)
      //   this.checkedBtnList = new Set([...this.infoObj.permissionObj.btnList])
      //   return true
      // }
      // // 下面是请求接口 获取
      // let res = await this.$post('system/menu/findByOrganization', {organizationId: this.$store.getters.userInfo.orgId})
      // if (res.code === 0) {
      //   this.infoObj.permissionObj = res.data
      //   this.$refs.tree.setCheckedKeys(this.infoObj.permissionObj.menuList)
      //   this.checkedBtnList = new Set([...this.infoObj.permissionObj.btnList])
      // }
    },
    // 单个"按钮"选项的选中与取消
    checkSingle (item, data, i) {
      if (this.checkedBtnList.has(item.id)) {
        this.checkedBtnList.delete(item.id)
      } else {
        this.checkedBtnList.add(item.id)
        // 选中对应的二级的菜单
        let menuList = this.$refs.tree.getCheckedKeys()
        menuList.push(data.href)
        this.$refs.tree.setCheckedKeys(menuList)
      }
      data.btnList.splice(i, 1, item)
      // this.$set(item, 'checked', this.checkedBtnList.has(item.id))
    },
    // "菜单"选项 的 选中 变化 -- > 处理 子菜单中的 "按钮" 选项 是否选中
    checkChange (item, bool) {
      if (item.level === 1) { // 一级菜单变化 不做处理
        return false
      }
      // 二级 菜单变化 -- > 影响 该级的按钮的显示
      if (!item.btnList || !item.btnList.length) {
        return false
      }
      // 如果是选中 第三级引发的第二级选中 就不处理第三级的
      let changeChild = false
      bool && item.btnList.map((btnItem, i) => {
        if (this.checkedBtnList.has(btnItem.id)) {
          changeChild = true
        }
      })
      if (changeChild) return
      // 下面是 处理 子菜单中的 "按钮" 选项 是否选中
      item.btnList.map((btnItem, i) => {
        if (bool) {
          this.checkedBtnList.add(btnItem.id)
        } else {
          this.checkedBtnList.delete(btnItem.id)
        }
        item.btnList.splice(i, 1, btnItem)
        // this.$set(item, 'checked', bool)
      })
    },
    // 判断该项是否选中
    isChecked (id) {
      return this.checkedBtnList.has(id)
    },
    // 获得全部选中的状态
    getAllCheck () {
      let menuList = this.$refs.tree.getCheckedKeys()
      let btnList = Array.from(this.checkedBtnList)
      return {
        menuList,
        btnList
      }
    }
  },
  watch: {
    // 监听是否显示弹窗--> 进行表单数据处理
    value (newValue) {
      if (!newValue) return false
      // this.getOldCheck()
    },
    menuIdArr (newValue) {
      if (!this.value) return
      this.getOldCheck()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .box {
    border: 1px solid $border-base;
    border-radius: 4px;
    padding: 10px;
    height: 400px;
    width: 100%;
    overflow: auto;
  }
  .menuPermissionTreeWrap{
    .itemTitle{
      display: flex;
      align-items: center;
      .divideLine{
        margin: 0 20px;
      }
      .checkedAll{
        font-size: $font-size-small;
      }
    }
    .btnListBox{
      width: 100%;
      padding-left: 10px;
      display: flex;
      align-items: flex-start;
      /*justify-content: space-between;*/
      flex-wrap: wrap;
      cursor: default;
      li{
        width: 132px;
        overflow: hidden;
        font-size: $font-default;
        cursor: pointer;
      }
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss">
  .menuPermissionTreeWrap{
    .el-tree-node__content{
      height: auto;
      align-items: flex-start;
    }
    .el-tree-node__content>.el-tree-node__expand-icon{
      padding: 10px 6px;
    }
  }
</style>
