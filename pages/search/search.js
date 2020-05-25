// pages/search/search.js
/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断  空字符过滤
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    myTimer:-1,
    isFocus:false,// 取消按钮是否显示
    inputValue:''// 输入框的值
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
   * 搜索商品函数
   * 输入框的值改变了就触发事件
   */
  handleInput(e){
    // 获取输入框的值
    const {value} = e.detail;
    // 检查合法性
    if(!value.trim()){
      // 值不合法
      this.setData({
        goods:[],
        isFocus:false
      })
      return ;
    }
    // 显示取消按钮
    this.setData({
      isFocus:true
    })
    // 准备发送请求
    // 清除定时器
    clearTimeout(this.myTimer);
    this.myTimer=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  
  /**
   * 发送请求获取搜索值数据
   */
  async qsearch(query){
    const res = await request({
      url:'/goods/search',
      data:{query}
    })
    console.log(res);
    this.setData({
      goods:res.goods
    })
  },
  /** 
   *点击取消按钮
  */
  handleCancle(){
    this.setData({
      inputValue:'',
      isFocus:false,
      goods:[]
    })
  }
})