// app.js
App({
  globalData: {
    productList: [],
    availableProducts: [
      { id: '1', name: '可口可乐', price: 3.5, image:'/images/product/coca.jpg'},
      { id: '2', name: '百事可乐', price: 3.5,image:'/images/product/pepsi.jpg' },
    ],
  },
  //App.js
 
onLaunch: function() {
  wx.getSystemInfo({
    success: e => {
      this.globalData.StatusBar = e.statusBarHeight;
      let custom = wx.getMenuButtonBoundingClientRect();
      this.globalData.Custom = custom;  
      this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
    }
  })
wx.cloud.init({
        env:'test-cashier-9g6kziz3892b46b6',
        traceUser:true
})


},
});

