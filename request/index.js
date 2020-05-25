// 同时发送异步代码的次数
let ajaxTimes=0;
export const request= (paramas)=>{
  // 判断url是否带有/my/请求的是私有的路径 带上header token
  let header={...paramas.header};
  if(paramas.url.includes("/my/")){
    // 拼接header，带上token
    header["Authorization"]=wx-wx.getStorageSync('token')
  }
  ajaxTimes++;
  // 定义公共url
  const BASEURL = "https://api-hmugo-web.itheima.net/api/public/v1"
  // 显示加载中效果
  wx.showLoading({
    title: "加载中",
    mask: true,
  });
  return new Promise((resolve,reject)=>{
    wx.request({
      ...paramas,
      header:header,
      url:BASEURL+paramas.url,
      success:(res)=>{
        resolve(res.data.message);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes===0){
           // 关闭等待图标
          wx.hideLoading();
        }
      }
    })
  })
} 