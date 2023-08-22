// 项目发布阶段需要用到的 babel 插件
const prodPlugins = []

// 如果处于产品的发布模式
if(process.env.NODE_ENV === 'production'){
  // transform-remove-console 插件,去除项目中console的打印
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 数组展开运算符,发布产品时的插件数组
    ...prodPlugins,
    // 路由懒加载的插件
    '@babel/plugin-syntax-dynamic-import'
  ]
}
