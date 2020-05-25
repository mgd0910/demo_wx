// pages/feedback/feedback.js
/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径  数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取 data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中 
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组 
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台。。。 
  5 清空当前页面
  6 返回上一页 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品/商家投诉",
        isActive: false
      }
    ],
    chooseImgs: [], //被选中的图片路径数组
    textValue: '', //文本域的内容
  },
  /**
   * 外网图片路径数组
   */
  UpLoadImgs: [],

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

  handelTabsItemChange(e) {
    // 1.获取被点击的标题下标
    const {
      index
    } = e.detail;
    // 2.修改原数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },
  /**
   *点击加号选择图片
   */
  handleChooseImg() {
    // 调用小程序内置的api
    wx.chooseImage({
      count: 9, //同时选中图片数量
      sizeType: ['original', 'compressed'], //格式：原始 压缩
      sourceType: ['album', 'camera'], //来源： 相册 照相机
      success: (result) => {
        console.log(result);
        this.setData({
          // 图片数组 进行拼接 
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
  },
  /**
   *点击自定义图片组件
   */
  handleRemoveImg(e) {
    // 获取被点击的组件的索引
    const {
      index
    } = e.currentTarget.dataset;
    // 获取data中的图片数组 
    let {
      chooseImgs
    } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  /**
   *文本域输入事件
   */
  handleTextInput(e) {
    this.setData({
      textValue: e.detail.value
    })
  },
  /**
   * 提交按钮的点击事件
   */
  handleFromSubmit() {
    // 获取文本域的内容 图片数组
    const {
      textValue,
      chooseImgs
    } = this.data;
    // 合法性验证
    if (!textValue.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    /*
    准备上传图片到专门的图片服务器
      上传文件的api不支持多个文件上传  
        遍历数组，挨个上传
    显示正在等待的图标
    */
    wx.showLoading({
      title: '正在上传中',
      mask: true,
    });
    //  判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://images.ac.cn/Home/Index/UploadAction/', //图片要上传到哪里
          filePath: v, //上传文件路径
          name: 'file', //上传文件名称 后台要获取数据 定义名字 file
          formData: {}, //顺带的文本信息
          success: (result) => {
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url)
            console.log(this.UpLoadImgs);

            // 所有图片上传完毕触发的事件
            if (i === chooseImgs.length - 1) {
              // 关闭弹窗
              wx.hideLoading();
              // 把文本内容＆数组提交到后台中
              console.log("把文本内容＆数组提交到后台中");
              // 提交都成功了  
              // 重置页面
              this.setData({
                textValue: '',
                chooseImgs: []
              })
              // 返回上个页面
              wx.navigateBack({
                delta: 1
              });
            }
          },
          complete: () => {
            // 关闭弹窗
            wx.hideLoading();
            // 把文本内容＆数组提交
            this.setData({
              textValue: '',
              chooseImgs: []
            })
            // 返回上个页面
            wx.navigateBack({
              delta: 1
            });
          }
        });

      })
    } else {
      wx.hideLoading();
      console.log("只提交文本");
       // 返回上个页面
      wx.navigateBack({
        delta: 1
      });
     
    }
  }
})