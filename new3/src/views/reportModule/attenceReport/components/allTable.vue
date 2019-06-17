<template>
  <div class="box attenceAllTableBox" v-if="dataList.length">
    <div class="leftBox">
      <div class="titleBox itemBox">
        <span class="colItem">排序</span>
        <span class="colItem">姓名</span>
        <span class="colItem">类型</span>
      </div>
      <div class="dataItem itemBox" v-for="(item, i) in list" :key="i">
        <span class="colItem">{{(formData.page - 1) * formData.size + i + 1}}</span>
        <span class="colItem">{{ item.name }}</span>
        <span class="col-two">
          <span class="col-two-item">上午上班</span>
          <span class="col-two-item">下午下班</span>
        </span>
      </div>
    </div>
    <el-carousel class="rightBox" indicator-position="none"  :autoplay="false" :style="{height: `calc( 60px * 4 * ${list.length} + 36px )`} ">
      <el-carousel-item class="flex"  v-for="(title, dx) in titleList" :key="dx">
        <div class="titleBox itemBox">
          <span class="colItem" v-for="(titleItem, i) in title" :key="i">{{ titleItem.date }}</span>
        </div>
        <div class="dataItem itemBox" v-for="(listItem, i) in list" :key="i">
          <div class="colItem" v-for="(titleItem, i) in title" :key="i">
            <template v-if="listItem.listObj[titleItem.date]">
              <div class="colItemSpan" v-for="(objItem, objIndex) in listItem.listObj[titleItem.date]" :key="objIndex" @click="toShowDetailDialog(objItem)">
                <span>{{objItem.signTime}}</span>
                <span>{{objItem.typeName}}</span>
                <span v-if="objItem.addressType === 1">地点异常</span>
              </div>
            </template>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
  <div v-else class="empty-wrp">
    暂无数据
  </div>
</template>

<script>
export default {
  name: 'allTable',
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    list () {
      let list = []
      this.dataList.map(item => {
        let obj = Object.assign({}, item)
        obj.listObj = {}
        obj.list.map(child => {
          obj.listObj[child.date] = child.list
          // child[child.date] = child.list
        })
        // console.log('obj', obj)
        list.push(obj)
      })
      return list
    },
    titleList () {
      let list = []
      this.dataList.map(item => {
        if (list.length < item.list.length) {
          list = [...item.list]
        }
      })
      return this.toSlice(list, 7)
    }
  },
  methods: {
    toSlice (array, size) {
      let result = []
      for (let x = 0; x < Math.ceil(array.length / size); x++) {
        let start = x * size
        let end = start + size
        result.push(array.slice(start, end))
      }
      return result
    },
    toShowDetailDialog (item) {
      this.$emit('clickItem', item)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  $item-height: 60px;
.empty-wrp{
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #EBEEF5;
  color: #909399
}
.box{
  display: flex;
  align-items: flex-start;
  .itemBox{
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $border-base;
    /*border-rigth: 1px solid $border-base;*/
    .colItem{
      flex: 1;
      height: 100%;
      border-right: 1px solid $border-base;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      word-break: break-all;
      color: $text-second;
      font-size: $font-size-base;
    }
    .col-two{
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      word-break: break-all;
      color: $text-second;
      font-size: $font-size-base;
      border-right: 1px solid $border-base;
      .col-two-item{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center
      }
    }
  }
  .titleBox{
    height: 36px;
    border-top: 1px solid $border-base;
    /*border: 1px solid $border-base;*/
    /*border-left: none;*/
    /*border-right: none;*/
    .colItem{
      color: $text-third;
      font-weight: 700;
      font-size: $font-size-base;
    }
  }
  .colItemSpan{
    width: 100%;
    height: $item-height;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid $border-base;
    &:nth-of-type(4){
      border-bottom: none;
    }
  }
  .leftBox{
    width: 400px;
    .dataItem{
      height: $item-height * 4;
    }
    .itemBox {
      border-left: 1px solid $border-base;
    }
    .colItem{
      &:nth-of-type(1){
        flex: 0 0 60px !important;
      }
    }
  }
  .rightBox{
    flex: 1;
    height: $item-height * 4 * 5 + 36px;
    .itemBox {
      border-right: 1px solid $border-base;
      .colItem {
        flex: 0 0 calc(100% / 7);
        word-break: break-all;
        overflow: hidden;
      }
    }
    .dataItem{
      height: $item-height * 4;
      .colItem{
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        font-size: $font-default;
      }
    }
    .colItemSpan{
      cursor: pointer;
    }
  }
}
.col-two-item:nth-child(1){
  border-bottom: 1px solid #e5e5e5
}
</style>
<style>
  .attenceAllTableBox .el-carousel__container{
    height: 100%;
  }
</style>
