// pages/category/category.js
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList:[],// 左侧菜单数据
    rightGoodsList:[],//右侧商品数据
    currentsIndex:0,//被点击的左侧菜单
    scrollTop:0//右侧内容的滚动条距离顶部的距离
  },
  Cates:[],//接口返回数据

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    1.判断本地存储中是否有旧的数据
    2.没有旧数据 直接发送新请求
    3.有旧的数据 同时旧的数据没有过期，就用本地存储的旧数据
    */

    //1.获取本地存储数据
    const Cates=wx.getStorageSync('cates')
    //2.判断
    if(!Cates){
      //不存在
      this.getCates();
    }else{
      // 有旧的数据 定义过期时间5min
      if(Date.now()-Cates.time>1000*60*5){
        //重新发送请求
        this.getCates();
      }else{
        //使用旧数据
        this.Cates=Cates.data;
        //构造左侧菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name)
        // console.log(leftMenuList);
        //构造右侧商品数据
        let rightGoodsList=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightGoodsList
        })
      }
    }
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
   * 获取分类数据
   */
  async getCates(){
    // request({
    //   url: '/categories'
    // }).then((res) => {
    //   console.log(res);
    //   this.Cates=res.data.message;

    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})


    //   //构造左侧菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name)
    //   // console.log(leftMenuList);
    //    //构造右侧商品数据
    //   let rightGoodsList=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightGoodsList
    //   })
    // })
    const res = await request({url:'/categories'})
    this.Cates=res;
      // 把接口的数据存入到本地存储中
      wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
      //构造左侧菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name)
      // console.log(leftMenuList);
       //构造右侧商品数据
      let rightGoodsList=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightGoodsList
      })
  },
   /**
   * 左侧菜单点击事件
   */
  handleItemTap(e){
    /* *
    1. 获取被点击的索引值 
    2. 赋值给data中的currentsIndex 
    3. 根据不同的索引值来渲染右侧的商品内容
    */
    const {index} = e.currentTarget.dataset;
    let rightGoodsList=this.Cates[index].children;
    this.setData({
      currentsIndex:index,
      rightGoodsList,
      //重新设置右侧scrollTop的值
      scrollTop:0
    })
  }
})