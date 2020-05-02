<template>
  <div>
    <!-- 顶部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡包 -->
    <el-card class="box-card">
      <el-table :data="rightlist" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="authName" label="商品名字"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级权限">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">标签二</el-tag>
            <el-tag type="danger" v-else-if="scope.row.level==='2'">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightlist: []
    }
  },
  created() {
    this.getright()
  },
  methods: {
    async getright() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.$message.error('数据请求错误')
      }
      this.rightlist = res.data
      console.log(res.data)
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  margin-top: 10px;
}
</style>
