// pages/order/order.js
/* 
1 页面被打开的时候 onShow 
  0 onShow 不同于onLoad 无法在形参上接收 options参数 
  0.5 判断缓存中有没有token 
    1 没有 直接跳转到授权页面
    2 有 直接往下进行 
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中 
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据 
 */

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"全部订单",
        isActive:true
      },
      {
        id:1,
        value:"待发货",
        isActive:false
      },
      {
        id:2,
        value:"待收货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
    orders:[],
    order:[
      {
        order_number:'01001',
        order_price:666,
        create_time:"2020-04-24"
      },
      {
        order_number:'01002',
        order_price:777,
        create_time:"2020-04-24"
      },
      {
        order_number:'01003',
        order_price:888,
        create_time:"2020-04-24"
      },
      {
        order_number:'01004',
        order_price:999,
        create_time:"2020-04-24"
      }
    ]
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
    // const token = wx.getStorageSync('token');
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/auth'
    //   });
    //   return;
    // }
    // 获取小程序当前页面栈-数组 长度最大为10
    let pages=getCurrentPages();
    // 数组中索引最大的页面就是当前页面
    let currentPage=pages[pages.length-1];
    // 获取url上的参数type
    const {type} = currentPage.options
    // 激活选中页面标题
    this.changeTitleByIndex(type-1);
    this.getOrder(type);
  },
  /**
   * 标题点击事件，从子组件传递过来的
   */
  handelTabsItemChange(e){
    // 1.获取被点击的标题下标
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求type=1 index=0
    this.getOrder(index+1);
  },
  /**
   * 根据标题索引来激活选中的标题数组
   */
  changeTitleByIndex(index){
    // 2.修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },
  /**
   * 获取订单列表的方法
   */
  async getOrder(type){
    const res = await request({
      url:'/my/orders/all',
      data:{type}
    });
    
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:new Date(v.create_time*1000).toLocaleString()})),
    })
  }
})