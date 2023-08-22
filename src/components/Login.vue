<template>
    <!-- 登录内容模块 -->
    <div class="login_container">
        <!-- 登录盒子 -->
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>

            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // 登录表单的数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单验证规则对象
            loginFormRules: {
                // 验证用户名是否合法
                username: [
                    // required是否必填  message：提示消息  trigger 触发时机  blur 失去焦点时触发
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮，重置登录表单
        resetLoginForm() {
            // this 指向登录组件的实例
            // console.log(this)
            this.$refs.loginFormRef.resetFields()
        },
        // 表单预验证
        login() {
            this.$refs.loginFormRef.validate(async (vaild) => {
                // console.log(vaild) 打印boolean值，true 表示成功 false表示失败
                if (!vaild) {
                    // 表单验证失败，阻止程序向下执行
                    return false
                }
                // es6 语法中的对象解构的第二种方式：res才是变量
                const { data: res } = await this.$http.post('login', this.loginForm)
                // 登录判断
                if (res.meta.status !== 200) {
                    return this.$message.error('登录失败')
                }
                this.$message.success('登录成功')
                // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
                //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                window.sessionStorage.setItem('token', res.data.token)
                // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                this.$router.push('/home')
            })
        }
    }
}
</script>

<!-- scoped控制样式生效的区间，只在当前组件中生效 -->
<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}

.login_box{
    width: 450px;
    height: 300px;
    /* 设置背景颜色 */
    background-color: #fff;
    /* 设置圆角 */
    border-radius: 3px;
    /* 绝对定位 */
    position: absolute;
    /* 水平垂直居中显示 */
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #111;
    border-radius: 50%;
    padding: 10px;
    /* 增加阴影 模糊距离10px */
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    /* 盒子水平居中 */
    left: 50%;
    transform: translate(-50%,-50%);
    /* 设置背景颜色 */
    background-color: #fff;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding:0 20px;
    /* CSS3盒子模型 */
    box-sizing: border-box;
}

.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
