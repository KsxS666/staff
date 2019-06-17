# admin-page

> 爱家物联管理后台

## 运行编译

``` bash
npm install
npm run dev
npm run build
```

## 项目搭建


- 项目采用 `eslint` 规范，有提示警告等，必须处理
  > 采用单引号，严格比较模式（===）
  
  
- 命名规范
  > 采用 `驼峰式 或者 以“-”连接 命名`，命名要与内容有关，`不可自造命名`，在不影响语义的情况下，
  可适当使用缩写 ，缩写只用来表示结构，如col、nav、btn等，`不可自造缩写`  <br/> <br/>
  > 公共的统一要求项：
  > 1. 表单请求的（包括搜索条件）用 "formData" 名称 <br/>
  > 2. 页面的主表格数组 用 "dataList" 名称 <br/>
  > 3. 其他数组的对象 用 "xxxList" 格式名称 <br/>
  > 4. 如果拆分组件，命名要语义化，比如弹窗组件 用 "xxxDialog" 名称 <br/>
  > 5. 如果页面有几个字段是用来处理同一个功能的，建议这些字段用一个主对象包起来 <br/>
      
    ``` vue
    // 例如：
    data () {
      return {
        mainLoading: false,
        dataList: [],
        editInfo: { // 编辑弹窗的信息
          visible: false,
          type: 1, // 1 是 新建  2是修改  4 是添加下级
          infoObj: {}
        },
        permissionInfo: { // 权限的信息
          visible: false,
          infoObj: {}
        }
      }
    }
    ```
    
- 组件化
  > 页面有单独的部分或者功能点，建议组件化，减少页面的复杂度 <br/>
  例如：页面的弹窗之类，拆出来封装组件
    
- 公用组件

  ``` vue
  /src/components 目录下
  v-dialog  是el-dialog组件的二次封装， 增加 全屏 缩放 按钮
  areaSearch 是封装省市区街道的地区搜索条件
  areaForm 是封装省市区街道的地区的表单数据
    
  ```
   
    
- 样式：

  ``` 
  公共样式 /src/styles/common.scss 文件，命名以 "v-" 开头， 如
  .v-button 主按钮的样式
  .v-form 表单的样式
  .v-form-search 搜索条件的表单的样式
  ... ...
  ```
  > 1. 所有涉及到样式的 采用 `/src/styles/module/config.scss` 变量 统一样式
  > 2. 如果样式没有在 `scoped` 里面的，必须外包一个独有的class类名，以防影响其他页面
  > 3. 表单默认是用 medium 大小的， 在弹窗里面的表单用 `small` 大小
  
  
- 公用工具类

  > 常用的方法写在 /src/utils/utils.js 文件<br/>
  已在全局引入， 只需要 `this.$utils[方法名]` 可使用<br/>
  
- 页面模板

``` vue
<template>
  <div  class="v-wrap"> </div>
</template>

<script>
export default {
  name: [name],
  components: {},
  props: {},
  data () {
    return {}
  },
  created () {
    this.getList()
  },
  mounted () {},
  computed: {},
  methods: {
    // 获得主列表
    getList () {},
    // 查询
    toSearch () {},
    // 清空
    toClearForm () {},
    // 切换页面 - 页码
    handleCurrentChange (val) {},
    // 切换页面 - 页size
    handleSizeChange (val) {},
    //// --- 下面是其他的自定义的方法
  },
  beforeDestroy () {},
  watch: {}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
</style>

```

