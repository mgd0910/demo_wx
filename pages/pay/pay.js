/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token???
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */
import { requestPayment, showToast } from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("cc");
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
    // 1.获取缓存中的收获地址
    const address = wx.getStorageSync("address");
    // 2.给data赋值
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
   this.setData({address})
    // 总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
    // 重新设置购物车数据在data和缓存中
    wx.setStorageSync("cart", cart);
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
   * 支付函数
   */
  async handleOrderPay(){
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 判断 如果没有token，跳转到token页面获取token
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return;
      }
      // 创建订单
      // 1.准备请求头参数
      // const header = {Authorization:token};
      // 2.请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr= this.data.address.all;
      const cart=this.data.cart;
      let goods = [];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams = {order_price,consignee_addr,goods}
      // 准备发送请求，创建订单 获取订单编号
      const {order_number} =await request({
        url:'/my/orders/create',
        method:"POST",
        data:orderParams
      });
      // 发起预支付接口
      const {pay} = await request({
        url:'/my/orders/req_unifiedorder',
        method:'POST',
        data:{order_number}
      });
      // 发起微信支付
      await requestPayment(pay);
      // 查询后台订单是否支付成功
      const res = await request({
        url:'/my/orders/chkOrder',
        method:'POST',
        order_number
      })
      await showToast({title:'支付成功'})
      // 手动删除缓存中已经完成支付的商品
      let newCart = wx.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
      // 支付成功跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order ',
      })
    } catch (error) {
      await showToast({title:'支付失败'})
      console.log(error);
    }
  }
})