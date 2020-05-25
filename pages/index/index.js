// 
import { request } from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],//轮播图数据
    catesList:[],//导航数据
    floorList:[]//楼层数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
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
  //获取轮播图数据
  getSwiperList(){
    request({
      url: '/home/swiperdata'
    }).then((res) => {
      this.setData({
        swiperList: res
      })
    })
  },
  // 获取导航分类数据
  getCatesList() {
    request({
      url: '/home/catitems'
    }).then((res) => {
      this.setData({
        catesList: res
      })
    })
  },
  // 获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata'
    }).then((res) => {
      res=JSON.parse(JSON.stringify(res).replace(/goods_list/g,'goods_list/goods_list'));
      this.setData({
        floorList: res
      })
    })
  },
  
})