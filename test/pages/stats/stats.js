Page({
  data: {
    categories: ['全部', '电子产品', '服饰', '家具'],
    selectedIndex: 0,
    salesAmount: 0,
    grossProfit: 0,
    orderCount: 0,
    allData: [
      { category: '电子产品', sales: 10000, profit: 3000, orders: 150 },
      { category: '服饰', sales: 8000, profit: 2000, orders: 120 },
      { category: '家具', sales: 5000, profit: 1500, orders: 80 },
    ]
  },

  onCategoryChange: function(e) {
    const selectedIndex = e.detail.value;
    const selectedCategory = this.data.categories[selectedIndex];
    this.setData({ selectedIndex });
    this.updateStats(selectedCategory);
  },

  updateStats: function(category) {
    let filteredData = this.data.allData;
    if (category !== '全部') {
      filteredData = filteredData.filter(item => item.category === category);
    }

    const salesAmount = filteredData.reduce((sum, item) => sum + item.sales, 0);
    const grossProfit = filteredData.reduce((sum, item) => sum + item.profit, 0);
    const orderCount = filteredData.reduce((sum, item) => sum + item.orders, 0);

    this.setData({
      salesAmount,
      grossProfit,
      orderCount
    });
  }
});
