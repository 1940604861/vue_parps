<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商管理后台</span>
      </div>
      <el-button @click="loginto">退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧边 -->
      <el-aside :width="msg ? '56px':'200px'">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="msg"
          :collapse-transition="false"
          :router="true"
          :default-active="active"
        >
        <div class="toggle_button" @click="togglecllop">|||</div>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in homelist" :key="item.id">
            <!-- 一级菜单模块 -->
            <template slot="title">
              <!-- 图片 -->
              <i :class="homeimg[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"

              @click="activeName('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图片 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main> <router-view></router-view> </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      homelist: [],
      homeimg: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      msg: false,
      active: ''
    }
  },
  created() {
    this.gethomtlist()
    this.active = window.sessionStorage.getItem('active')
  },
  methods: {
    // 点击退出的
    loginto() {
      window.sessionStorage.clear()
      this.$router.push('./login')
    },
    // 获取导航栏数据
    async gethomtlist() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.homelist = res.data
      console.log(res)
    },
    // 收缩功能
    togglecllop() {
      this.msg = !this.msg
    },
    activeName(active) {
      window.sessionStorage.setItem('active', active)
      // 给在数组return{ active:''}赋值
      this.active = active
    }

  }// methods
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: -webkit-flex;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
    span {
      font-size: 25px;
      color: white;
      padding-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    width: 100%;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle_button{
  font-size: 12px;
  color: white;
  background-color: slategrey;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>
