let startX = 0; // 触摸开始时的 X 坐标
let isSwiping = false; // 判断是否正在滑动
let currentIndex = null; // 当前正在滑动的商品索引

Page({
  data: {
    showForm: false,
    name: '',
    price: '',
    image: '',
    productList: [],
    editingProductId: null,
    showActions: null,
  },

  onLoad() {
    const app = getApp();
    wx.getStorage({
      key: 'availableProducts',
      success: (res) => {
        app.globalData.availableProducts = res.data;
        this.setData({
          productList: res.data
        });
      },
      fail: () => {
        this.setData({
          productList: app.globalData.availableProducts
        });
      }
    });
  },

  // 触摸开始事件
  onTouchStart(event) {
    startX = event.touches[0].clientX; // 记录起始位置
    currentIndex = event.currentTarget.dataset.index; // 获取当前商品索引
    isSwiping = true; // 设置为正在滑动
  },

  // 触摸移动事件
  onTouchMove(event) {
    if (!isSwiping) return;
    const moveX = event.touches[0].clientX;
    const deltaX = startX - moveX;

    // 判断滑动距离，控制显示操作按钮
    if (deltaX > 50) { // 向左滑动超过50px
      this.setData({
        showActions: currentIndex // 显示对应商品的操作按钮
      });
    } else if (deltaX < -50) { // 向右滑动
      this.setData({
        showActions: null // 隐藏操作按钮
      });
    }
  },

  // 触摸结束事件
  onTouchEnd() {
    isSwiping = false; // 重置滑动状态
  },

  toggleForm() {
    this.setData({
      showForm: !this.data.showForm,
      editingProductId: null, // 关闭表单时重置编辑ID
      name: '',
      price: '',
      image: ''
    });
  },

  onNameInput(event) {
    this.setData({
      name: event.detail.value
    });
  },

  onPriceInput(event) {
    this.setData({
      price: event.detail.value
    });
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          image: res.tempFilePaths[0]
        });
      },
      fail: () => {
        wx.showToast({
          title: '图片选择失败',
          icon: 'none'
        });
      }
    });
  },

  addProduct() {
    const app = getApp();
    const { name, price, image, editingProductId } = this.data;

    if (!name || !price) {
      wx.showToast({
        title: '请填写商品名称和价格',
        icon: 'none'
      });
      return;
    }

    const parsedPrice = parseFloat(price);
    if (parsedPrice <= 0) {
      wx.showToast({
        title: '价格必须为正数',
        icon: 'none'
      });
      return;
    }

    if (editingProductId) {
      // 修改商品
      const index = app.globalData.availableProducts.findIndex(product => product.id === editingProductId);
      if (index !== -1) {
        app.globalData.availableProducts[index].name = name;
        app.globalData.availableProducts[index].price = parsedPrice;
        app.globalData.availableProducts[index].image = image || app.globalData.availableProducts[index].image;

        wx.showToast({
          title: '商品修改成功',
          icon: 'success'
        });
      }
    } else {
      // 添加新商品
      const newProduct = {
        id: (app.globalData.availableProducts.length + 1).toString(),
        name,
        price: parsedPrice,
        image: image || '/images/product/defult.jpg'
      };
      app.globalData.availableProducts.push(newProduct);
      wx.showToast({
        title: '商品添加成功',
        icon: 'success'
      });
    }

    // 保存到本地存储
    wx.setStorage({
      key: 'availableProducts',
      data: app.globalData.availableProducts,
    });

    // 更新本地数据
    this.setData({
      productList: app.globalData.availableProducts,
      showForm: false,
      name: '',
      price: '',
      image: '',
      editingProductId: null // 重置编辑ID
    });
  },

  // 左滑显示删除和修改按钮
  showActions(event) {
    const productId = event.currentTarget.dataset.id;
    const product = this.data.productList.find(p => p.id === productId);
    this.setData({
      editingProductId: productId,
      name: product.name,
      price: product.price,
      image: product.image
    });
    this.toggleForm();
  },

  deleteProduct(event) {
    const productId = event.currentTarget.dataset.id;
    const app = getApp();
    const updatedList = app.globalData.availableProducts.filter(product => product.id !== productId);
    
    app.globalData.availableProducts = updatedList;

    wx.setStorage({
      key: 'availableProducts',
      data: updatedList,
    });

    this.setData({
      productList: updatedList
    });

    wx.showToast({
      title: '商品删除成功',
      icon: 'success'
    });
  }
});
