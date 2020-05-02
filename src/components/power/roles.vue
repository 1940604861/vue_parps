<template>
  <div>
    <!-- 顶部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡包 -->
    <el-card class="box-card">
      <el-row>
        <el-button type="primary" @click="dialogVisible=true">添加按钮</el-button>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleslist" border stripe>
        <!-- 展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['dibu',i1===0 ? 'toubu':'']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级 -->
              <el-col :span="5">
                <el-tag closable @close="shanchu(scope.row, item1.id)">{{ item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级 -->
              <el-col :span="19">
                <!-- 这里是二级 -->
                <el-row
                  :class="['toubu',i2===0 ? 'dibu':'']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="shanchu(scope.row, item2.id)"
                    >{{ item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      :class="['sanji']"
                      closable
                      @close="shanchu(scope.row, item3.id)"
                    >{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 主体 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="addedit(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="open(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-settingS"
              @click="showright(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 点击事件添加用户 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="resetForm">
        <el-form :model="rolesFrom" ref="ruleFormRed" label-width="100px" class="demo-ruleForm">
          <!--  -->
          <el-form-item label="角色名称：" prop="roleName">
            <el-input v-model="rolesFrom.roleName"></el-input>
          </el-form-item>

          <!--  -->
          <el-form-item label="角色描述：" prop="roleDesc ">
            <el-input v-model="rolesFrom.roleDesc "></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 点击事件修改用户 -->
      <el-dialog title="修改用户" :visible.sync="dialogVisible2" width="30%" @close="resetForm2">
        <el-form :model="rolesFrom2" ref="ruleFormRed2" label-width="100px" class="demo-ruleForm">
          <!--  -->
          <el-form-item label="角色名称：" prop="roleName">
            <el-input v-model="rolesFrom2.roleName"></el-input>
          </el-form-item>

          <!--  -->
          <el-form-item label="角色描述：" prop="roleDesc">
            <el-input v-model="rolesFrom2.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="editapp">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 角色分配 -->
      <el-dialog title="角色分配" :visible.sync="dialogVisible3" width="60%" @close="chongzhi">
        <!-- 树形控件 -->
        <el-tree
          :data="rightinfo"
          :props="rightProps"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="listkey"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible3 = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleslist: [],
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      rolesFrom: {
        roleName: '',
        roleDesc: ''
      },
      rolesFrom2: [],
      rightinfo: [],
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      listkey: []
    }
  },
  created() {
    this.getroles()
  },
  methods: {
    async getroles() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('on')
      }
      this.roleslist = res.data
    },
    // 关闭时重置表单内容
    resetForm() {
      this.$refs.ruleFormRed.resetFields()
    },
    // 关闭时重置表单内容2
    resetForm2() {
      this.$refs.ruleFormRed2.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.ruleFormRed.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('reles', this.ruleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加错误')
        }
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getroles()
      })
    },
    // 展示修改对话框
    async addedit(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return
      this.rolesFrom2 = res.data
      this.dialogVisible2 = true
      console.log(res.data)
    },
    // 提交修改按钮
    editapp() {
      this.$refs.ruleFormRed2.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.rolesFrom2.roleId,
          { roleName: this.rolesFrom2.roleName },
          { roleDesc: this.rolesFrom2.roleDesc }
        )
        if (res.meta.status !== 200) {
          this.$message.error('添加错误')
        }
        this.$message.success('修改成功')
        this.dialogVisible2 = false
        this.getroles()
      })
    },
    // 删除
    async open(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('roles/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      this.getroles()
    },
    // 三级点击删除
    async shanchu(role, rightid) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('失败')
      }
      this.$message.success('删除成功')
      //   this.getroles()
      role.children = res.data
    },
    async showright(role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.rightinfo = res.data
      // 递归三级节点id
      this.getleafkey(role, this.listkey)
      console.log(this.rightinfo)

      this.dialogVisible3 = true
    },
    // 通过递归形式获取所有三级权限的id 并保存在listkey数组中
    getleafkey(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getleafkey(item, arr)
      })
    },
    chongzhi() {
      this.listkey = []
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  margin-top: 10px;
}
.el-row {
  margin: 7px;
}
.dibu {
  border-bottom: 1px solid #eee;
  padding: 7px;
}
.toubu {
  border-top: 1px solid #eee;
  padding: 7px;
}
.sanji {
  margin: 5px;
}
</style>
