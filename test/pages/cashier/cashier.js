Page({
  data: {
    productList: [],           // 全部商品列表
    filteredProducts: [],      // 过滤后的商品列表
    totalAmount: 0,            // 总金额
    currentProduct: '',        // 当前输入的商品名
  },

  // 页面加载时
  onLoad() {
    this.setData({
      productList: [],
      totalAmount: 0,
    });
  },

  // 商品输入事件
  onProductInput(e) {
    const inputValue = e.detail.value;
    this.setData({
      currentProduct: inputValue,
    });
    this.filterProducts(inputValue); // 调用搜索过滤函数
  },

  // 过滤商品列表
  filterProducts(query) {
    const filtered = this.data.productList.filter(product =>
      product.name.includes(query) // 商品名称包含输入内容
    );
    this.setData({
      filteredProducts: filtered, // 更新过滤后的商品
    });
  },

  // 添加商品到购物车
  addProduct() {
    const currentProductName = this.data.currentProduct.trim();
    if (!currentProductName) {
      wx.showToast({ title: '请输入商品名称', icon: 'none' });
      return;
    }

    const app = getApp();
    const availableProducts = app.globalData.availableProducts; // 获取可添加的商品列表

    if (!availableProducts) {
      wx.showToast({ title: '商品列表未定义', icon: 'none' });
      return;
    }

    const existingProduct = availableProducts.find(item => item.name === currentProductName);

    if (!existingProduct) {
      wx.showToast({ title: '该商品不可添加', icon: 'none' });
      return;
    }

    let productList = [...this.data.productList];
    const cartProduct = productList.find(item => item.id === existingProduct.id);

    if (cartProduct) {
      // 如果商品已存在，增加数量
      cartProduct.quantity += 1;
    } else {
      // 新增商品
      const newProduct = {
        id: this.generateId(existingProduct.name),
        name: existingProduct.name,
        price: existingProduct.price,
        image: existingProduct.image,
        quantity: 1
      };
      productList.push(newProduct);
    }

    // 更新商品列表和全局数据
    this.updateProductList(productList);
  },

  // 生成唯一 ID
  generateId(name) {
    return name + '_' + Date.now();
  },

  // 更新商品列表和全局数据
  updateProductList(productList) {
    const app = getApp();
    app.globalData.productList = productList;

    //console.log('更新后的商品列表:', productList);
    //console.log('总金额:', this.calculateTotal(productList));

    this.setData({
      productList: productList,
      filteredProducts: productList,
      totalAmount: this.calculateTotal(productList),
      currentProduct: ''  // 清空输入框
    });
  },

  // 增加商品数量
  increaseQuantity(e) {
    const productId = e.currentTarget.dataset.id;
    this.modifyQuantity(productId, 1);
  },

  // 减少商品数量
  decreaseQuantity(e) {
    const productId = e.currentTarget.dataset.id;
    this.modifyQuantity(productId, -1);
  },

  // 修改商品数量
  modifyQuantity(productId, change) {
    const productList = this.data.productList.map(product => {
      if (product.id === productId) {
        product.quantity += change;
        if (product.quantity < 1) product.quantity = 1; // 确保数量最小为1
      }
      return product;
    });

    this.updateProductList(productList);
  },

  // 删除商品
  removeProduct(e) {
    const productId = e.currentTarget.dataset.id;
    const newList = this.data.productList.filter(item => item.id !== productId);
    this.updateProductList(newList);
  },

  // 计算总金额
  calculateTotal(productList) {
    return productList.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // 跳转到结算页面
  goToCheckout() {
    wx.navigateTo({
      url: '/pages/checkout/checkout',
    });
  },

});
