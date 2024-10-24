// pages/login/index.js
Page({

  data: {
    stuId: '', // 学号
    password: '' // 密码
  },
  login:function() {

    const { stuId, password } = this.data;//提取数据

    // 简单的字段验证
    if (!stuId || !password) {
      wx.showToast({
        title: '请输入学号和密码',
        icon: 'none'
      });
      return;
    }

    // 登录成功提示
    wx.showToast({
      title: '登录成功',
      icon: 'none'
    });
    wx.switchTab({
      url: '/pages/cashier/cashier',
    });
    // 跳转到 cashier 页面
    
  },
});

