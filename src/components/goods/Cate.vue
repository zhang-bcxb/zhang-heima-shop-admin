<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!--
                表格区域
                selection-type 是否为多选类型表格
                expand-type 是否为展开行类型表格
                show-index 是否显示数据索引
                index-text 给索引列自定义标题
                border 是否显示纵向边框
                show-row-hover 鼠标悬停时，是否高亮当前行
            -->
            <tree-table
            :data="catelist"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index
            index-text="#"
            border
            :show-row-hover="false"
            class="treeTable">
                <!-- 是否有效 作用域插槽 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <!-- 排序 作用域插槽 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 作用域插槽 -->
                <template slot="opt">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="querInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed">
          <!-- 添加分类的表单 -->
          <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
              <!--
                级联选择器
                options：指定数据源
                props：用来指定配置对象
                clearable：是否支持清空选项
                change-on-select：是否允许选中任何一项
              -->
              <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable>
              </el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 指定查询条件
      querInfo: {
        type: 3, // 第三层三层分类
        pagenum: 1, // 第几页的数据
        pagesize: 5 // 每页的数据条数
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列
      columns: [
        {
          label: '分类名称', // 当前列名称
          prop: 'cat_name' // 当前列的属性
        },
        {
          label: '是否有效',
          type: 'template', // 表示将当前列定义为模板列
          template: 'isok' // 表示当前这列的模板名称
        },
        {
          label: '排序',
          type: 'template', // 表示将当前列定义为模板列
          template: 'order' // 表示当前这列的模板名称
        },
        {
          label: '操作',
          type: 'template', // 表示将当前列定义为模板列
          template: 'opt' // 表示当前这列的模板名称
        }
      ],
      // 控制分类对话框的显示
      addCateDialogVisible: false,
      // 添加表单分类的数据对象
      addCateForm: {
        // 将要添加分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认是一级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id', // 指定选中的值
        label: 'cat_name', // 指定看到的值
        children: 'children', // 指定父子嵌套的属性
        expandTrigger: 'hover',
        checkStrictly: true // 是否严格的遵守父子节点不互相关联
      },
      // 选中父级分类的id数组
      selectedKeys: []
    }
  },
  created() {
    // 发起数据请求，获取商品分类数据
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.$message.success('获取商品分类成功')
      //   console.log(res.data)
      // 把数值列表赋值给catelist
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示分类的对话框
    showAddCateDialog() {
      // 获取父级分类的数据列表
      this.getParentCateList()
      // 显示对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.$message.success('获取商品分类成功')

      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发
    parentCateChanged() {
      // console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于0，说明选中父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        // 阻止程序往下执行
        return false
      } else {
        // 重置父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定按钮，添加新的分类
    addCate() {
      // 表单预验证
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          // 预校验失败
          return false
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单的数据
    addCateDialogClosed() {
      // 重置分类名称
      this.$refs.addCateFormRef.resetFields()
      // 重置父级分类
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  // 设置外边距: 上下 左右
  margin: 15px 0;
}

.el-cascader {
  width: 100%;
}
</style>
