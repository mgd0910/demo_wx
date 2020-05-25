// pages/auth/auth.js
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login, showToast } from '../../utils/asyncWx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 授权回调
   * 获取用户信息
   */
  async handleGetUserInfo(e){
    try {
      // 获取用户信息
      const {encryptedData,rawData,iv,signature}=e.detail;
      // 获取小程序登录成功后的code值
      const {code} = await login();
      const loginParams={encryptedData,rawData,iv,signature,code};
      // 发送请求，获取用户token值
      const {token} = await request({
        url:'/users/wxlogin',
        data:loginParams,
        method:'POST'
      })
      // 把token存储到缓存中 同时回跳上个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
      await showToast({
        title:'token获取失败,该AppId未被授权,非企业级微信不支持获取token',
        duration: 3500
      })
    }
  }
})