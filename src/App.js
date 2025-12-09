import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Calendar,
  ChevronRight,
  Plus,
  Search,
  Menu,
  LogOut,
  MapPin,
  FileText,
  TrendingUp,
  AlertCircle,
  Trash2,
  Edit,
  X,
  Save,
  DollarSign,
} from "lucide-react";

// --- Mock Data & Initial State (模拟数据库与初始状态) ---

// 1. 基础商品库
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "法式羊角包",
    category: "起酥类",
    basePrice: 5.0,
    image: "🥐",
    leadTime: 2,
    description: "经典法式风味，层层酥脆，黄油香气浓郁。",
  },
  {
    id: 2,
    name: "全麦切片吐司",
    category: "吐司类",
    basePrice: 8.0,
    image: "🍞",
    leadTime: 1,
    description: "健康首选，富含膳食纤维，口感柔软扎实。",
  },
  {
    id: 3,
    name: "草莓奶油蛋糕",
    category: "冷链甜点",
    basePrice: 15.0,
    image: "🍰",
    leadTime: 3,
    description: "新鲜草莓搭配顺滑奶油，甜蜜的幸福滋味。",
  },
  {
    id: 4,
    name: "肉松小贝",
    category: "常温蛋糕",
    basePrice: 4.0,
    image: "🥯",
    leadTime: 1,
    description: "满满肉松包裹绵软蛋糕，咸甜适中，回味无穷。",
  },
  {
    id: 5,
    name: "手撕包",
    category: "面包",
    basePrice: 6.0,
    image: "🥖",
    leadTime: 2,
    description: "奶香浓郁，纹理清晰，手撕着吃更有趣。",
  },
];

// 2. 客户数据 (现在作为 App 级别的 state)
const INITIAL_CUSTOMERS = [
  {
    id: 101,
    name: "7-Eleven 连锁便利",
    type: "连锁便利店",
    billing: "月结30天",
    address: "高新区天府大道1号配送中心",
  },
  {
    id: 102,
    name: "沃尔玛超市",
    type: "超市",
    billing: "月结60天",
    address: "成华区建设路旗舰店收货部",
  },
];

// 3. 价格策略 (现在作为 App 级别的 state)
const INITIAL_PRICE_STRATEGIES = {
  // key: customerId, value: { productId: price }
  101: { 1: 4.5, 2: 7.2, 3: 13.5, 4: 3.8 },
  102: { 1: 4.0, 2: 6.8, 3: 12.0, 4: 3.5, 5: 5.0 },
};

// 4. 初始订单
const INITIAL_ORDERS = [
  {
    id: "订单号-20231024-01",
    customerId: 101,
    customerName: "7-Eleven 连锁便利",
    total: 450.0,
    status: "生产中",
    deliveryDate: "2023-10-26",
    items: { 1: 50, 2: 25, 4: 50 },
  },
  {
    id: "订单号-20231024-02",
    customerId: 102,
    customerName: "沃尔玛超市",
    total: 1200.0,
    status: "已完成",
    deliveryDate: "2023-10-27",
    items: { 1: 100, 3: 50, 5: 100 },
  },
  {
    id: "订单号-20231023-03",
    customerId: 101,
    customerName: "7-Eleven 连锁便利",
    total: 80.5,
    status: "已完成",
    deliveryDate: "2023-10-25",
    items: { 4: 20 },
  },
  {
    id: "订单号-20231022-04",
    customerId: 102,
    customerName: "沃尔玛超市",
    total: 2500.0,
    status: "已完成",
    deliveryDate: "2023-10-24",
    items: { 2: 200, 3: 150 },
  },
  {
    id: "订单号-20231029-05",
    customerId: 101,
    customerName: "7-Eleven 连锁便利",
    total: 300.0,
    status: "确认中",
    deliveryDate: "2023-10-31",
    items: { 1: 60 },
  },
];

// --- Utility Functions ---
const getStatusColor = (status) => {
  switch (status) {
    case "确认中":
      return "bg-yellow-100 text-yellow-800";
    case "生产中":
      return "bg-blue-100 text-blue-800";
    case "已完成":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// --- Components ---

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    outline: "border border-orange-500 text-orange-500 hover:bg-orange-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-gray-500 hover:bg-gray-100",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

// 子组件：产品卡片 (用于 ClientApp 订货页)
const ProductCard = ({
  product,
  price,
  cartQty,
  onAddToCart,
  onRemoveFromCart,
}) => {
  return (
    <Card className="p-3 flex gap-3 relative">
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
        {product.image}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center justify-between">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {product.description}
          </p>
          <p className="text-xs text-orange-400 bg-orange-50 inline-block px-1.5 py-0.5 rounded mt-1">
            需提前 {product.leadTime} 天
          </p>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="text-orange-600 font-bold">
            ¥{price.toFixed(2)}
            <span className="text-xs text-gray-400 font-normal ml-1">/个</span>
          </div>

          {cartQty ? (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
              <button
                onClick={() => onRemoveFromCart(product.id)}
                className="w-6 h-6 flex items-center justify-center bg-white border rounded-full text-gray-600 shadow-sm"
              >
                -
              </button>
              <span className="text-sm font-medium w-4 text-center">
                {cartQty}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="w-6 h-6 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-sm"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="bg-orange-100 text-orange-600 p-1.5 rounded-lg hover:bg-orange-200 transition"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

// 子组件：订单详情模态框 (ClientApp 专用)
const OrderDetailsModal = ({ order, products, priceList, onClose }) => {
  if (!order) return null;

  // 根据订单中的 items (pid: qty) 查找对应的商品和价格
  const orderItems = Object.entries(order.items).map(([pid, qty]) => {
    const productId = parseInt(pid);
    const product = products.find((p) => p.id === productId);
    // 使用订单创建时的客户专属价，如果找不到则使用基准价
    const price = priceList[productId] || product?.basePrice || 0;
    return {
      productName: product?.name || "未知商品",
      image: product?.image || "❓",
      qty: qty,
      price: price,
      subtotal: price * qty,
    };
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform scale-100 opacity-100">
        <div className="p-4 border-b flex justify-between items-center bg-orange-50">
          <h3 className="font-bold text-lg text-orange-800">
            订单详情: {order.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-500">客户名称</p>
              <p className="font-medium text-gray-700">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">交付日期</p>
              <p className="font-medium text-gray-700 flex items-center gap-1">
                <Calendar size={14} /> {order.deliveryDate}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">当前状态</p>
              <span
                className={`px-2 py-0.5 rounded-full text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <h4 className="font-bold text-md text-gray-700 border-b pb-2">
            商品清单 ({orderItems.length} 项)
          </h4>
          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.image}</span>
                  <p className="text-sm font-medium">{item.productName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">
                    ¥{item.subtotal.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.qty} 件 @ ¥{item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 text-right">
            <p className="text-xl font-extrabold text-orange-600">
              总计: ¥{order.total.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="p-4 border-t">
          <Button onClick={onClose} className="w-full">
            关闭详情
          </Button>
        </div>
      </div>
    </div>
  );
};

// 子组件：客户端订单历史页面 (ClientApp 专用)
const ClientOrdersHistory = ({ user, orders, products, priceList }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const userOrders = useMemo(
    () =>
      orders
        .filter((o) => o.customerId === user.id)
        .sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate)),
    [orders, user.id]
  );

  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
  const completedOrdersCount = userOrders.filter(
    (o) => o.status === "已完成"
  ).length;

  // 查找当前选中的订单对象
  const selectedOrder = userOrders.find((o) => o.id === selectedOrderId);

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-xl text-gray-800 border-b pb-2 mb-4">
        我的订单记录
      </h2>

      {/* 订单概览卡片区域 */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-indigo-50 border-indigo-200 text-center">
          <p className="text-xs text-indigo-700 font-medium truncate">
            累计订单数
          </p>
          <p className="text-2xl font-bold text-indigo-800 mt-1">
            {totalOrders}
          </p>
        </Card>
        <Card className="p-3 bg-orange-50 border-orange-200 text-center">
          <p className="text-xs text-orange-700 font-medium truncate">
            累计消费 (¥)
          </p>
          <p className="text-2xl font-bold text-orange-800 mt-1">
            {totalSpent.toFixed(2)}
          </p>
        </Card>
        <Card className="p-3 bg-green-50 border-green-200 text-center">
          <p className="text-xs text-green-700 font-medium truncate">
            已完成订单
          </p>
          <p className="text-2xl font-bold text-green-800 mt-1">
            {completedOrdersCount}
          </p>
        </Card>
      </div>

      {/* 订单列表 */}
      {totalOrders === 0 ? (
        <div className="text-center py-10 text-gray-400 border rounded-xl mt-4 bg-white">
          <FileText size={48} className="mx-auto text-gray-300 mb-2" />
          <p>暂无订单记录，快去订货吧！</p>
        </div>
      ) : (
        <Card className="divide-y divide-gray-100 overflow-hidden mt-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 hover:bg-gray-50 transition duration-150"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-bold text-sm text-gray-800 block">
                    {order.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-mono text-lg text-orange-600 font-extrabold block">
                    ¥{order.total.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    交付: {order.deliveryDate}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderId(order.id)} // Open modal
                className="text-xs text-blue-500 hover:text-blue-700 mt-3 flex items-center gap-1 transition"
              >
                查看详情
                <ChevronRight size={12} className="inline-block" />
              </button>
            </div>
          ))}
        </Card>
      )}

      {/* 订单详情模态框 */}
      <OrderDetailsModal
        order={selectedOrder}
        products={products}
        priceList={priceList} // 确保价格列表传递给详情页
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
};

// 子组件：客户端应用 (ClientApp)
const ClientApp = ({ user, products, priceList, onPlaceOrder, orders }) => {
  const [cart, setCart] = useState({});
  const [activeTab, setActiveTab] = useState("shop"); // shop, cart, orders

  // ... (addToCart, removeFromCart, cartTotal logic remains the same)
  const availableProducts = products.filter(
    (p) => priceList[p.id] !== undefined || p.basePrice !== undefined
  );

  const addToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartTotal = Object.entries(cart).reduce((sum, [pid, qty]) => {
    // 使用客户价格或基准价
    const price =
      priceList[pid] ||
      products.find((p) => p.id === parseInt(pid))?.basePrice ||
      0;
    return sum + price * qty;
  }, 0);

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) return;

    // 模拟 alert() 的替代方案
    console.log("订单提交成功！等待工厂确认。");

    onPlaceOrder({
      customerId: user.id,
      customerName: user.name,
      items: cart, // 订单包含的具体商品和数量
      total: cartTotal,
      deliveryDate: new Date(Date.now() + 86400000 * 2)
        .toISOString()
        .split("T")[0],
    });
    setCart({});
    setActiveTab("orders");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto border-x border-gray-200 shadow-2xl overflow-hidden relative">
      {/* 模拟手机状态栏 and Header (omitted for brevity, assume they are correct) */}
      <div className="bg-gray-900 text-white px-4 py-1 text-xs flex justify-between items-center">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
          <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
        </div>
      </div>

      <div className="bg-white p-4 shadow-sm z-10">
        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🥐</span>
          {user.name}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          专属订货通道 | 账期: {user.billing}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* 订货页面 */}
        {activeTab === "shop" && (
          <div className="space-y-4">
            <div className="bg-orange-50 p-3 rounded-lg flex items-start gap-2 text-sm text-orange-800">
              <AlertCircle size={16} className="mt-0.5" />
              <p>您好，今日16:00前下单，预计最早后天发货。</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {availableProducts.map((product) => {
                // 确保显示专属价或基准价
                const price = priceList[product.id] || product.basePrice;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    price={price}
                    cartQty={cart[product.id]}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCart}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* 购物车页面 (omitted for brevity, assume they are correct) */}
        {activeTab === "cart" && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg">购物车确认</h2>
            {Object.keys(cart).length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                购物车是空的
              </div>
            ) : (
              <>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 border-b pb-2">
                    <MapPin size={16} />
                    <span>配送至：{user.address}</span>
                  </div>
                  {Object.entries(cart).map(([pid, qty]) => {
                    const p = products.find((i) => i.id === parseInt(pid));
                    const price = priceList[pid] || p?.basePrice || 0; // Use actual price
                    return (
                      <div
                        key={pid}
                        className="flex justify-between items-center mb-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{p.image}</span>
                          <div>
                            <div className="text-sm font-medium">{p.name}</div>
                            <div className="text-xs text-gray-500">
                              ¥{price.toFixed(2)} x {qty}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          ¥{(price * qty).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t pt-3 flex justify-between items-center font-bold text-lg mt-4">
                    <span>合计</span>
                    <span className="text-orange-600">
                      ¥{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </Card>
                <Button
                  onClick={handleCheckout}
                  className="w-full py-3 text-lg"
                >
                  提交订单
                </Button>
              </>
            )}
          </div>
        )}

        {/* 订单历史页面 (已完善) */}
        {activeTab === "orders" && (
          <ClientOrdersHistory
            user={user}
            orders={orders}
            products={products}
            priceList={priceList} // 传递价格列表用于详情页计算
          />
        )}
      </div>

      {/* Footer Navigation (omitted for brevity, assume they are correct) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 pb-4 z-20">
        <button
          onClick={() => setActiveTab("shop")}
          className={`flex flex-col items-center text-xs ${
            activeTab === "shop" ? "text-orange-600" : "text-gray-400"
          }`}
        >
          <Package size={24} />
          <span className="mt-1">订货</span>
        </button>
        <button
          onClick={() => setActiveTab("cart")}
          className={`flex flex-col items-center text-xs ${
            activeTab === "cart" ? "text-orange-600" : "text-gray-400"
          } relative`}
        >
          <div className="relative">
            <ShoppingCart size={24} />
            {Object.keys(cart).length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {Object.values(cart).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </div>
          <span className="mt-1">购物车</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex flex-col items-center text-xs ${
            activeTab === "orders" ? "text-orange-600" : "text-gray-400"
          }`}
        >
          <FileText size={24} />
          <span className="mt-1">订单</span>
        </button>
      </div>
    </div>
  );
};

// 子组件：新建客户模态框 (AdminDashboard 专用)
const NewCustomerModal = ({ products, onSave, onClose }) => {
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    type: "连锁便利店",
    billing: "月结30天",
    address: "",
  });
  const [prices, setPrices] = useState({});

  const handlePriceChange = (productId, price) => {
    // 仅存储有效数字
    const floatPrice = parseFloat(price);
    setPrices((prev) => {
      const newPrices = { ...prev };
      if (floatPrice > 0) {
        newPrices[productId] = floatPrice;
      } else {
        delete newPrices[productId]; // 移除无效或未填写的价格
      }
      return newPrices;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.address) {
      console.error("客户名称和地址不能为空.");
      return; // 实际应用中应显示错误提示
    }

    // 传递新客户数据和专属价格策略
    onSave(newCustomer, prices);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp"
      >
        <div className="p-4 border-b flex justify-between items-center bg-blue-50">
          <h3 className="font-bold text-lg text-blue-800">新增客户档案</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <fieldset className="p-4 border border-gray-200 rounded-lg space-y-3">
            <legend className="text-sm font-bold text-gray-600 px-2">
              基本信息
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  客户名称
                </label>
                <input
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="如: 每日生鲜超市"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  客户类型
                </label>
                <select
                  name="type"
                  value={newCustomer.type}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 text-sm outline-none"
                >
                  <option value="连锁便利店">连锁便利店</option>
                  <option value="超市">超市</option>
                  <option value="个体户">个体户</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  账期
                </label>
                <select
                  name="billing"
                  value={newCustomer.billing}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 text-sm outline-none"
                >
                  <option value="月结30天">月结30天</option>
                  <option value="月结60天">月结60天</option>
                  <option value="现结">现结</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                配送地址
              </label>
              <input
                name="address"
                value={newCustomer.address}
                onChange={handleInputChange}
                required
                className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="详细收货地址"
              />
            </div>
          </fieldset>

          <fieldset className="p-4 border border-gray-200 rounded-lg">
            <legend className="text-sm font-bold text-gray-600 px-2 flex items-center gap-1">
              <DollarSign size={14} /> 专属价格设置 (留空则使用基准价)
            </legend>
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-1/2 flex items-center gap-2">
                    <span className="text-xl">{p.image}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <div className="w-1/4 text-xs text-gray-500">
                    基准价: ¥{p.basePrice.toFixed(2)}
                  </div>
                  <div className="w-1/4">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={(e) => handlePriceChange(p.id, e.target.value)}
                      className="w-full border rounded-lg p-1.5 text-sm text-right outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="专属价"
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
          <Button type="submit" variant="primary" className="w-32">
            <Save size={16} /> 确认新增
          </Button>
        </div>
      </form>
    </div>
  );
};

// 子组件：管理后台 (AdminDashboard)
const AdminDashboard = ({
  products,
  setProducts,
  customers,
  setCustomers,
  priceStrategies,
  setPriceStrategies,
  orders,
  setOrders,
}) => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState(null);
  // 客户模块状态
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  // 计算销售数据 (omitted for brevity, assume they are correct)
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "确认中").length;
  const predictions = products.map((p) => ({
    name: p.name,
    actual: Math.floor(Math.random() * 50) + 20,
    predicted: Math.floor(Math.random() * 60) + 30,
  }));
  const totalPredictedProduction = predictions.reduce(
    (sum, p) => sum + p.predicted,
    0
  );

  const updateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // 过滤客户列表
  const filteredCustomers = useMemo(() => {
    const query = customerSearchQuery.toLowerCase();
    if (!query) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.id.toString().includes(query) ||
        c.address.toLowerCase().includes(query)
    );
  }, [customers, customerSearchQuery]);

  // 处理新增客户
  const handleAddNewCustomer = (newCustomerData, newPrices) => {
    // 简单的 ID 生成逻辑
    const maxId =
      customers.length > 0 ? Math.max(...customers.map((c) => c.id)) : 100;
    const newId = maxId + 1;
    const customerWithId = { ...newCustomerData, id: newId };

    // 更新客户列表
    setCustomers((prev) => [...prev, customerWithId]);

    // 更新价格策略
    setPriceStrategies((prev) => ({
      ...prev,
      [newId]: newPrices,
    }));

    console.log(
      `新客户 ${newCustomerData.name} (ID: ${newId}) 已添加，并设置了 ${
        Object.keys(newPrices).length
      } 个专属价格。`
    );
  };

  // ... (handleSaveProduct, handleDeleteProduct logic remains the same)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProduct = {
      id: editingProduct.id || Date.now(),
      name: formData.get("name"),
      category: formData.get("category"),
      basePrice: parseFloat(formData.get("basePrice")),
      leadTime: parseInt(formData.get("leadTime")),
      description: formData.get("description"),
      image: formData.get("image") || "📦",
    };

    if (editingProduct.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === newProduct.id ? newProduct : p))
      );
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    const isConfirmed =
      window.prompt(
        `确定要删除ID为 ${id} 的商品吗？如果确定，请输入“删除”进行确认。`
      ) === "删除";

    if (isConfirmed) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      console.log(`商品ID: ${id} 已被删除。`);
    } else {
      console.log("商品删除操作已取消。");
    }
  };

  return (
    <div className="flex h-full bg-slate-100 text-slate-800 font-sans">
      {/* Sidebar (omitted for brevity, assume they are correct) */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🏭 幸乐食品
          </h2>
          <p className="text-xs text-slate-400 mt-2">销售管理系统IMS</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveModule("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
              activeModule === "dashboard"
                ? "bg-orange-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            <BarChart3 size={18} /> 销售概览
          </button>
          <button
            onClick={() => setActiveModule("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
              activeModule === "orders"
                ? "bg-orange-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            <FileText size={18} /> 订单审核
          </button>
          <button
            onClick={() => setActiveModule("customers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
              activeModule === "customers"
                ? "bg-orange-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Users size={18} /> 客户管理
          </button>
          <button
            onClick={() => setActiveModule("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
              activeModule === "products"
                ? "bg-orange-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Package size={18} /> 商品管理
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-700">
            {activeModule === "dashboard" && "数据面板"}
            {activeModule === "orders" && "订单中心"}
            {activeModule === "customers" && "客户档案"}
            {activeModule === "products" && "商品库管理"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
              管理员模式
            </div>
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              A
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeModule === "dashboard" && (
            // ... (Dashboard content remains the same)
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4 border-l-4 border-orange-500">
                  <div className="text-gray-500 text-xs uppercase font-bold">
                    今日销售额
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    ¥{totalSales.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> +12% 环比昨日
                  </div>
                </Card>
                <Card className="p-4 border-l-4 border-blue-500">
                  <div className="text-gray-500 text-xs uppercase font-bold">
                    待处理订单
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {pendingOrdersCount}
                  </div>
                </Card>
                <Card className="p-4 border-l-4 border-purple-500">
                  <div className="text-gray-500 text-xs uppercase font-bold">
                    明日预计产能需求
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {totalPredictedProduction.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-gray-400">
                      个
                    </span>
                  </div>
                </Card>
                <Card className="p-4 border-l-4 border-gray-500">
                  <div className="text-gray-500 text-xs uppercase font-bold">
                    历史最高销量
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    4,200{" "}
                    <span className="text-sm font-normal text-gray-400">
                      个
                    </span>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar size={18} />
                  明日销量预估 (基于历史订单习惯)
                </h3>
                <div className="space-y-4">
                  {predictions.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <div className="flex gap-4">
                          <span className="text-gray-400">
                            历史均值: {item.actual}
                          </span>
                          <span className="font-bold text-orange-600">
                            预测: {item.predicted}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gray-300 h-2.5 rounded-full inline-block"
                          style={{ width: `${(item.actual / 100) * 100}%` }}
                        ></div>
                        <div
                          className="bg-orange-500 h-2.5 rounded-r-full inline-block -ml-2 opacity-80"
                          style={{
                            width: `${
                              ((item.predicted - item.actual) / 100) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeModule === "orders" && (
            // ... (Orders content remains the same)
            <Card className="overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4">订单号</th>
                    <th className="p-4">客户</th>
                    <th className="p-4">交付日期</th>
                    <th className="p-4">总额</th>
                    <th className="p-4">状态</th>
                    <th className="p-4">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono text-xs">{order.id}</td>
                      <td className="p-4">{order.customerName}</td>
                      <td className="p-4">{order.deliveryDate}</td>
                      <td className="p-4 font-bold">
                        ¥{order.total.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {order.status === "确认中" && (
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              className="py-1 px-3 text-xs"
                              onClick={() => updateStatus(order.id, "生产中")}
                            >
                              确认排产
                            </Button>
                          </div>
                        )}
                        {order.status === "生产中" && (
                          <Button
                            variant="secondary"
                            className="py-1 px-3 text-xs"
                            onClick={() => updateStatus(order.id, "已完成")}
                          >
                            发货
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {/* --- 客户管理模块 (已完善搜索和新建) --- */}
          {activeModule === "customers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">客户管理</h3>
                <div className="flex gap-3">
                  {/* 搜索栏 */}
                  <div className="relative w-72">
                    <input
                      type="text"
                      placeholder="搜索客户名称/ID/地址..."
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      className="w-full border rounded-lg p-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <Search
                      size={16}
                      className="absolute left-3 top-2.5 text-gray-400"
                    />
                  </div>
                  {/* 新建客户按钮 */}
                  <Button
                    onClick={() => setIsAddingCustomer(true)}
                    variant="primary"
                  >
                    <Plus size={16} /> 新建客户
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => (
                    <Card key={cust.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {cust.name}
                          </h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mt-1 inline-block">
                            {cust.type}
                          </span>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                            <MapPin size={12} /> {cust.address}
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <div>
                            账期:{" "}
                            <span className="font-medium text-slate-700">
                              {cust.billing}
                            </span>
                          </div>
                          <div>
                            ID:{" "}
                            <span className="font-mono text-slate-700">
                              {cust.id}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                          价格协议
                        </h4>
                        <div className="bg-gray-50 rounded p-3 text-sm space-y-2">
                          {/* 显示专属价格 */}
                          {Object.entries(priceStrategies[cust.id] || {}).map(
                            ([pid, price]) => {
                              const product = products.find(
                                (p) => p.id === parseInt(pid)
                              );
                              return product ? (
                                <div
                                  key={pid}
                                  className="flex justify-between border-b border-gray-100 last:border-0 pb-1 last:pb-0"
                                >
                                  <span>
                                    {product.image} {product.name}
                                  </span>
                                  <span className="font-mono text-orange-600 font-bold">
                                    ¥{price.toFixed(2)}
                                  </span>
                                </div>
                              ) : null;
                            }
                          )}
                          {/* 无专属价格的提示 */}
                          {Object.keys(priceStrategies[cust.id] || {})
                            .length === 0 && (
                            <div className="text-center text-gray-400 text-xs py-2">
                              无专属价格，全部按基准价结算
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-gray-400 border rounded-xl mt-4 bg-white">
                    <Search size={32} className="mx-auto text-gray-300 mb-2" />
                    <p>未找到匹配 "{customerSearchQuery}" 的客户。</p>
                  </div>
                )}
              </div>

              {/* 新建客户模态框 */}
              {isAddingCustomer && (
                <NewCustomerModal
                  products={products}
                  onSave={handleAddNewCustomer}
                  onClose={() => setIsAddingCustomer(false)}
                />
              )}
            </div>
          )}

          {activeModule === "products" && (
            // ... (Product Management content remains the same)
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">商品库管理</h3>
                <Button onClick={() => setEditingProduct({})}>
                  <Plus size={16} /> 新增商品
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 flex items-center gap-4 hover:shadow-md transition"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                      {product.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-slate-800">
                            {product.name}
                          </h4>
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded mr-2">
                            {product.category}
                          </span>
                          <span className="text-xs text-slate-400">
                            提前期: {product.leadTime}天
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-orange-600 font-bold font-mono">
                            ¥{product.basePrice.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">基准价</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-1 border-t pt-2 border-gray-50">
                        {product.description || "暂无描述"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 border-l pl-4 ml-2">
                      <Button
                        variant="ghost"
                        className="p-2 h-8 w-8"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        className="p-2 h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* --- Product Edit Modal (omitted for brevity, assume they are correct) --- */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg">
                  {editingProduct.id ? "编辑商品" : "新增商品"}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSaveProduct}
                className="p-6 overflow-y-auto space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      商品名称
                    </label>
                    <input
                      name="name"
                      defaultValue={editingProduct.name}
                      id="prod-name-input"
                      required
                      className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                      placeholder="如: 法式羊角包"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      分类
                    </label>
                    <select
                      name="category"
                      defaultValue={editingProduct.category || "面包"}
                      className="w-full border rounded-lg p-2 text-sm outline-none"
                    >
                      <option value="面包">面包</option>
                      <option value="吐司类">吐司类</option>
                      <option value="起酥类">起酥类</option>
                      <option value="冷链甜点">冷链甜点</option>
                      <option value="常温蛋糕">常温蛋糕</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      基准价格 (¥)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="basePrice"
                      defaultValue={editingProduct.basePrice}
                      required
                      className="w-full border rounded-lg p-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      提前期 (天)
                    </label>
                    <input
                      type="number"
                      name="leadTime"
                      defaultValue={editingProduct.leadTime || 1}
                      required
                      className="w-full border rounded-lg p-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      图标 (Emoji)
                    </label>
                    <input
                      name="image"
                      defaultValue={editingProduct.image || "🍞"}
                      className="w-full border rounded-lg p-2 text-sm outline-none text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    营销描述
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct.description}
                    rows={3}
                    className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="输入产品描述..."
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setEditingProduct(null)}
                  >
                    取消
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Save size={16} /> 保存
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App / Controller ---
export default function App() {
  const [viewMode, setViewMode] = useState("welcome");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // 将客户数据和价格策略提升到 App 状态
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [priceStrategies, setPriceStrategies] = useState(
    INITIAL_PRICE_STRATEGIES
  );

  const handlePlaceOrder = (newOrder) => {
    const orderData = {
      id: `订单号-${Date.now()}`,
      status: "确认中",
      ...newOrder,
    };
    // 新订单放在最前面
    setOrders([orderData, ...orders]);
  };

  // 根据 viewMode 动态获取当前客户信息
  const currentClientId =
    viewMode === "client-101" ? 101 : viewMode === "client-102" ? 102 : null;
  const currentClient = customers.find((c) => c.id === currentClientId);
  const currentClientPriceList = currentClient
    ? priceStrategies[currentClient.id]
    : {};

  if (viewMode === "welcome") {
    return (
      <div className="h-screen bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              🍞 烘焙工厂信息化销售系统
            </h1>
            <p className="text-gray-600 text-lg">
              基于 B2B 场景的 "一客一价" 与全流程订单管理解决方案
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setViewMode("client-101")}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition border-b-4 border-blue-500 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">
                🏪
              </div>
              <h3 className="font-bold text-lg">模拟客户 A</h3>
              <p className="text-sm text-gray-500">7-Eleven 连锁便利店</p>
            </button>

            <button
              onClick={() => setViewMode("client-102")}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition border-b-4 border-green-500 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">
                🏬
              </div>
              <h3 className="font-bold text-lg">模拟客户 B</h3>
              <p className="text-sm text-gray-500">沃尔玛大型超市</p>
            </button>

            <button
              onClick={() => setViewMode("admin")}
              className="bg-slate-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition border-b-4 border-slate-600 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">
                📊
              </div>
              <h3 className="font-bold text-lg">工厂管理后台</h3>
              <p className="text-sm text-slate-400">销售 / 管理人员</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center text-sm z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-orange-400">演示控制台</span>
          <span className="text-gray-500">|</span>
          <span className="opacity-80">
            当前视图:{" "}
            {viewMode === "admin"
              ? "管理后台"
              : currentClient
              ? `客户: ${currentClient.name}`
              : "加载中..."}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("welcome")}
            className="hover:text-white text-gray-400 flex items-center gap-1"
          >
            <LogOut size={14} /> 退出演示
          </button>
          <select
            className="bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-xs outline-none"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="client-101">切换至: 7-Eleven</option>
            <option value="client-102">切换至: 沃尔玛</option>
            <option value="admin">切换至: 管理后台</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-gray-200">
        {viewMode.startsWith("client-") && currentClient ? (
          <ClientApp
            user={currentClient}
            products={products}
            priceList={currentClientPriceList}
            onPlaceOrder={handlePlaceOrder}
            orders={orders}
          />
        ) : viewMode === "admin" ? (
          <AdminDashboard
            products={products}
            setProducts={setProducts}
            customers={customers}
            setCustomers={setCustomers}
            priceStrategies={priceStrategies}
            setPriceStrategies={setPriceStrategies}
            orders={orders}
            setOrders={setOrders}
          />
        ) : null}
      </div>
    </div>
  );
}
