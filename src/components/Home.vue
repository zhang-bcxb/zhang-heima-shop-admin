<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>

        <!-- 页面主体区域 -->
        <el-container>
            <!-- 左侧 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!-- 折叠按钮 -->
                <div class="toggle-button" @click="toggleCollapse">
                    |||
                </div>

                <!-- 侧边栏菜单区域 -->
                <!--
                  collapse-transition：是否开启折叠动画
                  collapse：是否水平折叠菜单
                  router：是否启用index值作为路由
                  unique-opened：是否只保持一个子菜单展开
                  default-active：激活当前菜单的index
                -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
                :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true"
                :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧 主体区域 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  // 私有数据
  data() {
    return {
      // 左侧菜单数据 一级菜单
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠，默认不折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  // Vue周期函数
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出功能函数
    logout() {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
      // console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 鼠标点击二级菜单触发，保存链接的激活状态
    saveNavState(activePath) {
      // 将状态保存到window下  参数：键 值
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang = "less" scoped>
.home-container {
  height: 100%;
  width: 100%;
}

.el-header {
  background-color: #373d41;
  /* flex 布局 */
  display: flex;
  /* 左右贴边对齐 */
  justify-content: space-between;
  padding-left: 0;
  /* y轴居中对齐 */
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    /* y轴居中对齐 */
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  /* 行高：垂直居中对齐 */
  line-height: 24px;
  color: #fff;
  /* 水平居中对齐 */
  text-align: center;
  /* 文字之间的间距 */
  letter-spacing: 0.2em;
  /* 鼠标样式：变成小手 */
  cursor: pointer;
}
</style>
