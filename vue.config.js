/*
 * @Description:
 * @Version:
 * @Author: ji.yaning
 * @Date: 2024-04-10 16:05:30
 * @LastEditors: ji.yaning
 * @LastEditTime: 2024-04-10 16:28:34
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭ESLINT校验工具
  lintOnSave: false,
})
