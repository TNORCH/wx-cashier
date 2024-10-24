Page({
  data: {
    username: '用户名',
    avatarUrl: '/assets/images/user-avatar.png', // 默认头像
  },

  onLoad: function () {
    // 假设从后台获取用户信息
    const userInfo = getApp().globalData.userInfo;
    if (userInfo) {
      this.setData({
        username: userInfo.username,
        avatarUrl: userInfo.avatarUrl,
      });
    }
  }
});
