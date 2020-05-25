// pages/cart/cart.js
/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress

  2 获取 用户 对小程序 所授予 获取地址的  权限 状态 scope
    1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
      scope 值 true 直接调用 获取收货地址
    2 假设 用户 从来没有调用过 收货地址的api 
      scope undefined 直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框 取消   
      scope 值 false 
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
      2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中 
2 页面加载完毕
  0 onLoad  onShow 
  1 获取本地存储中的地址数据
  2 把数据 设置给data中的一个变量
3 onShow 
  0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
    1 num=1;
    2 checked=true;
  1 获取缓存中的购物车数组
  2 把购物车数据 填充到data中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
  6 总数量 +=商品的数量
  7 把计算后的价格和数量 设置回data中即可
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选。总价格 总数量
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取 data中的全选变量 allChecked
  3 直接取反 allChecked=!allChecked
  4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
  5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
8 商品数量的编辑
  1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性 
    1 “+” "+1"
    2 "-" "-1"
  2 传递被点击的商品id goods_id
  3 获取data中的购物车数组 来获取需要被修改的商品对象
  4 当 购物车的数量 =1 同时 用户 点击 "-"
    弹窗提示(showModal) 询问用户 是否要删除
    1 确定 直接执行删除
    2 取消  什么都不做 
  4 直接修改商品对象的数量 num
  5 把cart数组 重新设置回 缓存中 和data中 this.setCart
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到 支付页面！ 
 */
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    })
    this.setCart(cart);
    // 计算全选
    /* 
    every() 数组方法 ，会遍历，会接受一个回调函数  
    每个回调函数都返回true，every的方法的返回值为true
    只要一个回调返回false，代码不执行，直接返回fasle
    如果空数组调用every方法，返回值为true
    */
    /* // const allChecked = cart.length?cart.every(v=>v.checked):false;
    let allChecked = true;
    // 总价格和总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false
      }
    })
    // 判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      address,
      cart,
      allChecked,
      totalPrice,
      totalNum
    }) */

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
   * 选择收获地址函数
   */
  // async chooseAddress() {
  //   /* // 1.获取权限状态
  //   wx.getSetting({
  //     success: (result)=>{
  //       // 2. 获取权限状态  主要发现一些属性名很怪异的时候 使用[]形式获取属性值
  //       const scopeAddress = result.authSetting["scope.address"];
  //       if(scopeAddress === true||scopeAddress ===undefined){
  //         wx.chooseAddress({
  //           success: (result1)=>{
  //             console.log(result1);
  //           }
  //         });
  //       }else{
  //         // 3.用户拒绝了授权 先诱导用户打开授权
  //         wx.openSetting({
  //           success: (result2)=>{
  //             // console.log(result2);
  //             // 调用获取收货地址
  //             wx.chooseAddress({
  //               success: (result3)=>{
  //                 console.log(result3);
  //               }
  //             });
  //           }
  //         });
  //       }
  //     }
  //   }); */
  //   // 1.获取权限状态
  //   const res1 = await getSetting();
  //   const scopeAddress = res1.authSetting["scope.address"];
  //   // 2.判断权限状态
  //   /* if(scopeAddress === true||scopeAddress ===undefined){

  //   }else{
  //     // 用户拒绝了授权 先诱导用户打开授权
  //     await openSetting();
  //   } */
  //   if (scopeAddress === false) {
  //     // 用户拒绝了授权 先诱导用户打开授权
  //     await openSetting();
  //   }
  //   // 3. 调用获取收货地址
  //   const res2 = await chooseAddress();
  //   console.log(res2);
  // },
  async chooseAddress() {
    try {
      // 1.获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2.判断权限状态
      if (scopeAddress === false) {
        // 用户拒绝了授权 先诱导用户打开授权
        await openSetting();
      }
      // 3. 调用获取收货地址
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 4.本地存储数据
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 商品的选中
   */
  handeItemChange(e) {
    // 获取修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // console.log(goods_id);
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //选中状态取反
    cart[index].checked = !cart[index].checked
    this.setCart(cart);
  },
  /**
   * 设置购物车状态
   * 重新计算工具栏数据
   * 全选 价格 数量
   */
  setCart(cart) {
    let allChecked = true;
    // 总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    // 重新设置购物车数据在data和缓存中
    wx.setStorageSync("cart", cart);
  },
  /**
   * 商品的全选功能
   * 
   *  1 全选复选框绑定事件 change
      2 获取 data中的全选变量 allChecked
      3 直接取反 allChecked=!allChecked
      4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
      5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
   */
  handleItemAllChange() {
    // 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart中的商品选中状态 
    cart.forEach(v => v.checked = allChecked);
    // 修改后的值填充到data中，或者缓存中
    this.setCart(cart);
  },
  /**
   * 商品数量的编辑功能
   */
  async handleItemNumEdit(e) {
    // 获取事件传递过来的参数
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 找到商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      // wx.showModal({
      //   title: '提示',
      //   content: '确定删除商品吗？',
      //   success: (result) => {
      //     if (result.confirm) {
      //       cart.splice(index, 1);
      //       this.setCart(cart);
      //     }
      //   }
      // });
      const result= await showModal({content:'确定删除商品吗？'});
      if (result.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 修改数量
      cart[index].num += operation;
      // 设置回缓存和data
      this.setCart(cart);
    }
  },
  /**
   * 结算函数
   */
  async handlePay(){
    // 1.判断收货地址
    const {address} =this.data;
    if(!address.userName){
      await showToast({title:'您还没有选择收货地址'});
      return;
    }
    // 判断用户有没有选购商品
    if(this.totalNum===0){
      await showToast({title:'您还没有选购商品'});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  }
})