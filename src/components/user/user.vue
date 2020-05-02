<template>
  <div>
    <!-- 顶部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--
      搜素栏
      clear="getUserList()"在点击由 clearable 属性生成的清空按钮时触发
      change仅在输入框失去焦点或用户按下回车时触发

     -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输查询的名字" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList()" @change="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

    <!-- 表格 -->
    <el-table :data="userlist" stripe border>
      <el-table-column type="index" label="ID"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px" >
        <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="addedit(scope.row.id)"></el-button>
        </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row.id)"></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="角色分配" placement="top" :enterable="false" >
          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
        </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
          <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      <!-- 点击事件添加用户谈边框 -->
  <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="resetForm">
  <!-- 内容区 -->
  <el-form :model="ruleForm" :rules="rules" ref="ruleFormRed" label-width="100px" class="demo-ruleForm">
    <!-- 账号 -->
  <el-form-item label="用户：" prop="name">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
<!-- 密码 -->
    <el-form-item label="密码：" prop="pass">
    <el-input v-model="ruleForm.pass"></el-input>
  </el-form-item>
  <!-- 邮箱 -->
      <el-form-item label="邮箱：" prop="email">
    <el-input v-model="ruleForm.email"></el-input>
  </el-form-item>
  <!-- 手机 -->
      <el-form-item label="手机：" prop="ipone">
    <el-input v-model="ruleForm.ipone"></el-input>
  </el-form-item>
  </el-form>
    <!-- 事件 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
   <!-- 修改 -->
<el-dialog
  title="修改用户"
  :visible.sync="editlog"
  width="30%"
  @close="resetForm2"
  >
  <!-- 内容区 -->
    <el-form :model="editFrom" :rules="rules" ref="ruleFormRed2" label-width="100px" class="demo-ruleForm">
    <!-- 账号 -->
  <el-form-item label="用户：" prop="username" >
    <el-input v-model="editFrom.username" disabled></el-input>
  </el-form-item>

  <!-- 邮箱 -->
      <el-form-item label="邮箱：" prop="email">
    <el-input v-model="editFrom.email"></el-input>
  </el-form-item>
  <!-- 手机 -->
      <el-form-item label="手机：" prop="mobile">
    <el-input v-model="editFrom.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button  @click="editlog = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 3
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      editlog: false,
      ruleForm: {
        name: '12345',
        pass: '123456',
        email: 'sddsds@qq.com',
        ipone: '12121212121'
      },
      editFrom: [],
      rules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '密码', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        ipone: [
          { required: true, message: '手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位的手机号码', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      // this.$message.success('ok！')
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
      // this.queryInfo.query = ''
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值 改变的事假
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 关闭时重置表单内容
    resetForm() {
      this.$refs.ruleFormRed.resetFields()
    },
    // 修改重置
    resetForm2() {
      this.$refs.ruleFormRed2.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.ruleFormRed.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.ruleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加错误')
        }
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async addedit(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return
      this.editFrom = res.data
      this.editlog = true
    },
    // 发起修改用户信息的数据请求
    editUser() {
      this.$refs.ruleFormRed2.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editFrom.id,
          { email: this.editFrom.email },
          { mobile: this.editFrom.mobile })
        if (res.meta.status !== 200) {
          this.$message.error('添加错误')
        }
        this.$message.success('修改成功')
        this.editlog = false
      })
    },
    // 删除用户
    open(id) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { data: res } = this.$http.delete('users/' + id)
        if (res.meta.status !== 200) { return }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.getUserList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 10px;
  font-size: 14px;
}
</style>
