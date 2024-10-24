Page({
  data: {
    totalAmount: 0
  },

  onLoad: function() {
    this.calculateTotalAmount();
  },

  // 计算总金额
  calculateTotalAmount: function() {
    const cart = wx.getStorageSync('cart') || [];
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    this.setData({ totalAmount });
  },

  // 确认订单
  confirmOrder: function() {
    wx.showToast({
      title: '订单已确认',
      icon: 'success'
    });

    // 清空购物车
    wx.removeStorageSync('cart');
  }
});
