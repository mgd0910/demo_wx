// pages/goods_detail/goods_detail.js
/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式 
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail:{},
    isCollect:false
  },
   /**
   * 商品对象
   */
  GoodsInfo:{

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const {goods_id}=options;
    // this.getGoodsDetail(goods_id);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options = currentPage.options
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 获取商品详情数据
   */
  async getGoodsDetail(goods_id){
    const goodsDetail = await request({
      url:'/goods/detail',
      data:{goods_id}
    })
    this.GoodsInfo=goodsDetail;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsDetail:{
        goods_price:goodsDetail.goods_price,
        goods_name:goodsDetail.goods_name,
        /* 部分iphone手机不支持webp图片格式，需要替换为jpg，
        但是确保数据库内有这个jpg的图片 
        此方法不适合正常开发，正常开发时让后端改图片格式
        */
        goods_introduce:goodsDetail.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsDetail.pics
      },
      isCollect:isCollect
    })
  },
  /**
   * 点击轮播图片放大预览
   */
  handelPrevewImage(e){
    // 1.构造预览图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 2.接受点击传递过来的图片的url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls  // 需要预览的图片http链接列表
    })
  },
  /**
   * 点击加入购物车
   */
  addCart(){
    // 1.获取缓存中的购物车数据u
    let cart = wx.getStorageSync('cart')||[];
    // 2.判断商品对象是否存在在购物车
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 不存在 首次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }else{
      // 存在 数量++
      cart[index].num++;
    }
    // 3.购物车添加到缓存中
    wx.setStorageSync("cart",cart);
    // 4.弹窗提示
    wx.showToast({
      title: '成功加入购物车',
      icon: 'success',
      duration: 1500,
      mask: true
    });
  },
  /**
   * 点击加入收藏
   */
  handleCollect(){
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 判断商品是否被收藏
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 当index！=-1表示收藏了
    if(index!==-1){
      // 收藏了  在收藏数组中删除这一个
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'sunccess',
        mask: true
      });
    }else{
      // 没有收藏过，添加到收藏
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'sunccess',
        mask: true
      });
    }
    // 把数组存到缓存中
    wx.setStorageSync("collect", collect);
    // 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  }
})