import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  Search, 
  LogOut,
  MapPin,
  FileText,
  TrendingUp,
  AlertCircle,
  Trash2,
  SquarePen,
  X,
  Save,
  DollarSign,
  ClipboardList,
  Home,
  Plus 
} from 'lucide-react'; 

// --- Mock Data & Initial State (模拟数据库与初始状态) ---
const INITIAL_PRODUCTS = [
  { id: 1, name: '法式羊角包', category: '起酥类', basePrice: 5.0, image: '🥐', leadTime: 2, description: '经典法式风味，层层酥脆，黄油香气浓郁。', alias: '羊角包', isVisible: true, notes: '' },
  { id: 2, name: '全麦切片吐司', category: '吐司类', basePrice: 8.0, image: '🍞', leadTime: 1, description: '健康首选，富含膳食纤维，口感柔软扎实。', alias: '全麦吐司', isVisible: true, notes: '' },
  { id: 3, name: '草莓奶油蛋糕', category: '冷链甜点', basePrice: 15.0, image: '🍰', leadTime: 3, description: '新鲜草莓搭配顺滑奶油，甜蜜的幸福滋味。', alias: '草莓蛋糕', isVisible: true, notes: '' },
  { id: 4, name: '肉松小贝', category: '常温蛋糕', basePrice: 4.0, image: '🥯', leadTime: 1, description: '满满肉松包裹绵软蛋糕，咸甜适中，回味无穷。', alias: '小贝', isVisible: true, notes: '' },
  { id: 5, name: '手撕包', category: '面包', basePrice: 6.0, image: '🥖', leadTime: 2, description: '奶香浓郁，纹理清晰，手撕着吃更有趣。', alias: '手撕面包', isVisible: true, notes: '' },
];

const INITIAL_CUSTOMERS = [
  { id: 101, name: '7-Eleven 连锁便利', type: 'Chain Store', billing: '月结30天', address: '高新区天府大道1号配送中心', mode: 'mobile' },
  { id: 102, name: '沃尔玛超市', type: 'Supermarket', billing: '月结60天', address: '成华区建设路旗舰店收货部', mode: 'desktop' },
];

const INITIAL_PRICE_STRATEGIES = {
  // key: customerId, value: { productId: { price, alias, specs, isVisible } }
  101: { 
    1: { price: 4.5, alias: '羊角包', specs: '1个装', isVisible: true }, 
    2: { price: 7.2, alias: '全麦吐司', specs: '400g/袋', isVisible: true }, 
    3: { price: 13.5, alias: '草莓蛋糕', specs: '100g/个', isVisible: true }, 
    4: { price: 3.8, alias: '肉松小贝', specs: '单个装', isVisible: true } 
  }, 
  102: { 
    1: { price: 4.0, alias: '法式羊角包', specs: '5个装', isVisible: true }, 
    2: { price: 6.8, alias: '全麦切片', specs: '800g/袋', isVisible: true }, 
    3: { price: 12.0, alias: '草莓奶油蛋糕', specs: '200g/个', isVisible: true }, 
    4: { price: 3.5, alias: '小贝', specs: '10个装', isVisible: true }, 
    5: { price: 5.0, alias: '手撕面包', specs: '300g/个', isVisible: true } 
  }, 
};

const INITIAL_ORDERS = [
  { 
    id: 'ORD-20231024-01', 
    customerId: 101, 
    customerName: '7-Eleven 连锁便利', 
    total: 450.0, 
    status: 'Production', 
    deliveryDate: '2023-10-26', 
    notes: '需要提前1小时配送', 
    items: { 
      1: { quantity: 50, notes: '无特殊要求' }, 
      2: { quantity: 25, notes: '需要新鲜一些' }, 
      4: { quantity: 50, notes: '' } 
    } 
  },
  { 
    id: 'ORD-20231024-02', 
    customerId: 102, 
    customerName: '沃尔玛超市', 
    total: 1200.0, 
    status: 'Completed', 
    deliveryDate: '2023-10-27', 
    notes: '按正常流程配送', 
    items: { 
      1: { quantity: 100, notes: '' }, 
      3: { quantity: 50, notes: '装饰需要更精美' }, 
      5: { quantity: 100, notes: '' } 
    } 
  },
  { 
    id: 'ORD-20231023-03', 
    customerId: 101, 
    customerName: '7-Eleven 连锁便利', 
    total: 80.5, 
    status: 'Completed', 
    deliveryDate: '2023-10-25', 
    notes: '', 
    items: { 
      4: { quantity: 20, notes: '少放肉松' } 
    } 
  },
  { 
    id: 'ORD-20231022-04', 
    customerId: 102, 
    customerName: '沃尔玛超市', 
    total: 2500.0, 
    status: 'Completed', 
    deliveryDate: '2023-10-24', 
    notes: '周末促销用，提前一天备货', 
    items: { 
      2: { quantity: 200, notes: '' }, 
      3: { quantity: 150, notes: '' } 
    } 
  },
  { 
    id: 'ORD-20231029-05', 
    customerId: 101, 
    customerName: '7-Eleven 连锁便利', 
    total: 300.0, 
    status: 'Pending', 
    deliveryDate: '2023-10-31', 
    notes: '', 
    items: { 
      1: { quantity: 60, notes: '多送5个作为样品' } 
    } 
  },
];

// --- Utility Functions ---
const getStatusColor = (status) => {
  switch(status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Production': return 'bg-blue-100 text-blue-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// --- Common Components ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    outline: "border border-orange-500 text-orange-500 hover:bg-orange-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-gray-500 hover:bg-gray-100",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// --- Shared Order Components ---

/**
 * 通用数量输入组件：用于所有订货界面的数量控制。
 */
const ProductQuantityInput = ({ product, price, currentQty, onQtyChange, isMobile = false }) => {
  const handleChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) value = 0;
    onQtyChange(product.id, value);
  };

  const handleIncrement = () => onQtyChange(product.id, currentQty + 1);
  const handleDecrement = () => onQtyChange(product.id, Math.max(0, currentQty - 1));
  
  // 确保price是数字类型
  const numericPrice = typeof price === 'object' ? price.price : parseFloat(price);
  const displayPrice = isNaN(numericPrice) ? 0 : numericPrice;

  return (
    <div className="flex items-center gap-2">
      {/* 价格显示 */}
      <div className="text-orange-600 font-bold text-xl">
        ¥{displayPrice.toFixed(2)} 
        <span className="text-sm text-gray-400 font-normal ml-1">/个</span>
      </div>
      
      {/* 数量输入/控制 */}
      <div className="flex items-center gap-1 ml-auto bg-gray-50 rounded-lg p-1 border border-gray-200 shadow-sm">
        <button 
          onClick={handleDecrement} 
          disabled={currentQty === 0}
          className="w-7 h-7 flex items-center justify-center bg-white border rounded-full text-gray-600 transition disabled:opacity-50 hover:bg-gray-100"
        >
          -
        </button>
        <input
          type="number"
          min="0"
          value={currentQty}
          onChange={handleChange}
          className={`text-base font-medium text-center border-none bg-transparent outline-none p-0 ${isMobile ? 'w-10' : 'w-12'}`}
          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} // 兼容性样式
        />
        <button 
          onClick={handleIncrement} 
          className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-sm hover:bg-orange-600 transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

/**
 * 客户端产品卡片 (使用数量输入代替+/-按钮)
 */
const ProductCard = ({ product, price, cart, onCartChange, isMobile = false }) => {
  const cartItem = cart[product.id] || { quantity: 0, notes: '' };
  
  const handleQtyChange = (productId, newQty) => {
    onCartChange(productId, { ...cartItem, quantity: newQty });
  };
  
  const handleNotesChange = (e) => {
    onCartChange(product.id, { ...cartItem, notes: e.target.value });
  };
  
  return (
    <Card className={`p-4 flex gap-4 relative ${isMobile ? 'flex-col' : 'flex-row'}`}>
      <div className={`shrink-0 ${isMobile ? 'w-full h-24' : 'w-20 h-20'} bg-gray-100 rounded-lg flex items-center justify-center text-3xl`}>
        {product.image}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-800 text-lg flex items-center justify-between">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          <p className="text-xs text-orange-400 bg-orange-50 inline-block px-1.5 py-0.5 rounded mt-2">
            需提前 {product.leadTime} 天
          </p>
        </div>

        <div className={`mt-3 pt-3 border-t space-y-3`}>
          <ProductQuantityInput 
            product={product} 
            price={price} 
            currentQty={cartItem.quantity} 
            onQtyChange={handleQtyChange} 
            isMobile={isMobile} 
          />
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              商品备注
            </label>
            <textarea
              value={cartItem.notes}
              onChange={handleNotesChange}
              rows={2}
              className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="输入商品备注..."
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

const OrderDetailsModal = ({ order, products, priceList, onClose }) => {
  if (!order) return null;

  const orderItems = Object.entries(order.items).map(([pid, item]) => {
    const productId = parseInt(pid);
    const product = products.find(p => p.id === productId);
    
    // 兼容新旧价格列表格式
    const priceData = typeof priceList[productId] === 'object' ? priceList[productId] : { price: priceList[productId] };
    const price = priceData.price || product?.basePrice || 0;
    const alias = priceData.alias || product?.name || '未知商品';
    
    // 兼容新旧订单项目格式
    const quantity = typeof item === 'object' ? item.quantity : item;
    const notes = typeof item === 'object' ? item.notes || '' : '';
    
    return {
      productName: product?.name || '未知商品',
      alias: alias,
      image: product?.image || '❓',
      quantity: quantity,
      price: price,
      notes: notes,
      subtotal: price * quantity
    };
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform scale-100 opacity-100">
        <div className="p-4 border-b flex justify-between items-center bg-orange-50">
          <h3 className="font-bold text-xl text-orange-800">订单详情: {order.id}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-500">客户名称</p>
              <p className="font-medium text-gray-700 text-base">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">交付日期</p>
              <p className="font-medium text-gray-700 flex items-center gap-1 text-base"><Calendar size={16} /> {order.deliveryDate}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">当前状态</p>
              <span className={`px-3 py-1 rounded-full text-base font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
          
          {order.notes && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-bold mb-1">订单备注</p>
              <p className="text-sm text-blue-700">{order.notes}</p>
            </div>
          )}
          
          <h4 className="font-bold text-lg text-gray-700 border-b pb-2">商品清单 ({orderItems.length} 项)</h4>
          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.image}</span>
                    <div>
                      <p className="text-base font-medium">{item.productName}</p>
                      {item.alias !== item.productName && (
                        <p className="text-xs text-gray-500">{item.alias}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-800">¥{item.subtotal}</p>
                    <p className="text-sm text-gray-500">{item.quantity} 件 @ ¥{item.price}</p>
                  </div>
                </div>
                {item.notes && (
                  <div className="ml-14 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <span className="text-xs font-semibold text-gray-500">备注: </span>{item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t pt-4 text-right">
            <p className="text-2xl font-extrabold text-orange-600">总计: ¥{order.total}</p>
          </div>

        </div>
        <div className="p-4 border-t">
          <Button onClick={onClose} className="w-full">关闭详情</Button>
        </div>
      </div>
    </div>
  );
};

const ClientOrdersHistory = ({ user, orders, products, priceList }) => { 
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const userOrders = useMemo(() => 
        orders.filter(o => o.customerId === user.id)
              .sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate)), 
    [orders, user.id]);

    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    const completedOrdersCount = userOrders.filter(o => o.status === 'Completed').length;
    
    const selectedOrder = userOrders.find(o => o.id === selectedOrderId);

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <Card className="p-5 bg-indigo-50 border-indigo-200 text-center">
                     <p className="text-sm text-indigo-700 font-medium truncate">累计订单数</p>
                     <p className="text-3xl font-bold text-indigo-800 mt-1">{totalOrders}</p>
                 </Card>
                 <Card className="p-5 bg-orange-50 border-orange-200 text-center">
                     <p className="text-sm text-orange-700 font-medium truncate">累计消费 (¥)</p>
                     <p className="text-3xl font-bold text-orange-800 mt-1">{totalSpent}</p>
                 </Card>
                 <Card className="p-5 bg-green-50 border-green-200 text-center">
                     <p className="text-sm text-green-700 font-medium truncate">已完成订单</p>
                     <p className="text-3xl font-bold text-green-800 mt-1">{completedOrdersCount}</p>
                 </Card>
             </div>

             {totalOrders === 0 ? (
               <div className="text-center py-20 text-gray-400 border rounded-xl mt-4 bg-white">
                   <FileText size={48} className="mx-auto text-gray-300 mb-4"/>
                   <p className="text-lg">暂无订单记录，快去订货吧！</p>
               </div>
             ) : (
                <Card className="divide-y divide-gray-100 overflow-hidden mt-4">
                    {userOrders.map(order => (
                        <div key={order.id} className="p-5 hover:bg-gray-50 transition duration-150 flex justify-between items-center">
                            <div className="flex flex-col space-y-1">
                                <span className="font-bold text-base text-gray-800 block">{order.id}</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="font-mono text-xl text-orange-600 font-extrabold block">¥{order.total}</span>
                                <span className="text-sm text-gray-500 block">交付日期: {order.deliveryDate}</span>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedOrderId(order.id)} 
                                className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 transition font-medium p-2 bg-blue-50 rounded-lg"
                            >
                                <ChevronRight size={16} className="inline-block" />
                                查看详情 
                            </button>
                        </div>
                    ))}
                </Card>
             )}

             <OrderDetailsModal 
               order={selectedOrder} 
               products={products}
               priceList={priceList} 
               onClose={() => setSelectedOrderId(null)} 
             />
          </div>
    );
}

// --- Client App Desktop (Side Nav & Combined Shop/Cart) ---
const ClientAppDesktop = ({ user, products, priceList, onPlaceOrder, orders }) => { 
  const [cart, setCart] = useState({});
  const [activeTab, setActiveTab] = useState('shop'); 

  // 筛选可见商品，根据客户设置
  const availableProducts = products.filter(p => {
    // 兼容新旧价格列表格式
    const productSetting = typeof priceList[p.id] === 'object' ? priceList[p.id] : { price: priceList[p.id] };
    // 如果没有特定设置或设置为可见，则显示
    return (!productSetting || productSetting.isVisible !== false) && 
           (productSetting.price || p.basePrice !== undefined);
  });

  // 处理购物车变化，支持数量和备注
  const handleCartChange = (productId, cartItem) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (cartItem.quantity > 0) {
        newCart[productId] = cartItem;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  // 计算购物车总计
  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [pid, item]) => {
      const productId = parseInt(pid);
      // 兼容新旧价格列表格式
      const priceData = typeof priceList[productId] === 'object' ? priceList[productId] : { price: priceList[productId] };
      const price = priceData.price || products.find(p => p.id === productId)?.basePrice || 0;
      return sum + (price * item.quantity);
    }, 0);
  }, [cart, priceList, products]);

  // 计算购物车总数量
  const totalCartItems = Object.values(cart).reduce((a, b) => a + b.quantity, 0);
  
  // 购物车项目数组
  const cartItemsArray = useMemo(() => Object.entries(cart).map(([pid, item]) => {
      const productId = parseInt(pid);
      const product = products.find(p => p.id === productId);
      // 兼容新旧价格列表格式
      const priceData = typeof priceList[productId] === 'object' ? priceList[productId] : { price: priceList[productId] };
      const price = priceData.price || product?.basePrice || 0;
      const alias = priceData.alias || product?.name || '未知商品';
      return {
        pid: productId, 
        quantity: item.quantity,
        notes: item.notes,
        product: product,
        price: price,
        alias: alias
      };
  }).filter(item => item.quantity > 0), [cart, products, priceList]);

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) return;
    onPlaceOrder({
      customerId: user.id,
      customerName: user.name,
      items: cart,
      total: cartTotal,
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      notes: orderNotes
    });
    setCart({});
    setOrderNotes('');
    setActiveTab('orders');
  };
  
  const NavItem = ({ icon: Icon, label, tab }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-all duration-200 
                  ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
    >
      <Icon size={20} /> 
      {label}
      {tab === 'shop' && totalCartItems > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
            {totalCartItems}
          </span>
      )}
    </button>
  );

  const [orderNotes, setOrderNotes] = useState('');

  const CartSummary = useMemo(() => (
     <Card className="p-6 h-fit sticky top-20 shadow-lg border-b-4 border-orange-500">
        <h3 className="font-bold text-lg text-gray-700 border-b pb-3 mb-4">订单信息摘要 ({totalCartItems} 件)</h3>
        {cartItemsArray.length === 0 ? (
            <div className="text-center py-4 text-gray-400">购物车为空</div>
        ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-4">
                {cartItemsArray.map(item => (
                    <div key={item.pid} className="text-sm border-b pb-2 last:border-b-0">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">{item.alias}</span>
                            <span className="font-bold text-orange-600">¥{(item.price * item.quantity)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">{item.quantity}件 @ ¥{item.price}</span>
                            {item.notes && (
                                <span className="text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">备注: {item.notes}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        <div className="mt-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            订单备注
          </label>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            rows={3}
            className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            placeholder="输入订单备注..."
          />
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mt-4">
          <MapPin size={16} className="text-orange-500" />
          <span className="text-sm">配送至：{user.address}</span>
        </div>
        <div className="flex justify-between border-t pt-4 mt-4">
           <span className="font-bold text-xl">订单总计</span>
           <span className="text-orange-600 font-extrabold text-2xl">¥{cartTotal}</span>
        </div>
        <Button onClick={handleCheckout} disabled={cartTotal === 0} className="w-full py-3 text-lg mt-6">
          <ClipboardList size={20} /> 提交订单
        </Button>
      </Card>
  ), [cartItemsArray, totalCartItems, cartTotal, user.address, orderNotes, handleCheckout]);

  return (
    <div className="flex h-full bg-gray-50">
      <div className="hidden md:flex flex-col w-64 bg-slate-800 text-white h-full shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-orange-400">💻</span> 客户通道
          </h2>
          <p className="text-xs text-slate-400 mt-2 truncate">{user.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* 移除购物车 Tab，合并到 Shop */}
          <NavItem icon={Package} label="订货与购物车" tab="shop" />
          <NavItem icon={FileText} label="我的订单" tab="orders" />
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-700">
            {activeTab === 'shop' ? '订货中心' : '我的订单记录'}
          </h2>
          <div className="flex items-center gap-4">
            {activeTab === 'shop' && (
              <Button
                onClick={() => alert('导入Excel功能开发中...')}
                variant="outline"
                className="text-sm"
              >
                <FileText size={16} /> 导入Excel出货单
              </Button>
            )}
            <div className="text-sm text-gray-500 flex items-center gap-4">
              <div className="hidden sm:block">
                  <span className="font-bold text-gray-700">{user.name}</span> | <span className="ml-1 text-xs">欢迎您</span>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                账期: {user.billing}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6 flex-1">
          {activeTab === 'shop' && (
            <div className="space-y-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧：商品列表 */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-orange-50 p-4 rounded-xl flex items-start gap-3 text-base text-orange-800 border border-orange-200">
                   <AlertCircle size={20} className="mt-0.5 shrink-0" />
                   <p className="font-medium">温馨提示: 今日下单截止时间前提交，预计最早 **{new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]}** 发货。</p>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {availableProducts.map(product => {
                     // 兼容新旧价格列表格式
                     const priceData = typeof priceList[product.id] === 'object' ? priceList[product.id] : { price: priceList[product.id] };
                     const price = priceData.price || product.basePrice;
                     const displayName = priceData.alias || product.name;
                     return (
                        <ProductCard 
                          key={product.id}
                          product={{
                            ...product,
                            name: displayName
                          }}
                          price={price}
                          cart={cart}
                          onCartChange={handleCartChange}
                          isMobile={false} // Desktop mode
                        />
                     )
                  })}
                </div>
              </div>
              
              {/* 右侧：购物车/结算摘要 */}
              <div className="lg:col-span-1">
                  {CartSummary}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="max-w-6xl mx-auto">
              <ClientOrdersHistory user={user} orders={orders} products={products} priceList={priceList} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- Client App Mobile (Bottom Nav) ---
const ClientAppMobile = ({ user, products, priceList, onPlaceOrder, orders }) => { 
  const [cart, setCart] = useState({});
  const [activeTab, setActiveTab] = useState('shop');
  const [orderNotes, setOrderNotes] = useState('');

  // 筛选可见商品，根据客户设置
  const availableProducts = products.filter(p => {
    // 兼容新旧价格列表格式
    const productSetting = typeof priceList[p.id] === 'object' ? priceList[p.id] : { price: priceList[p.id] };
    // 如果没有特定设置或设置为可见，则显示
    return (!productSetting || productSetting.isVisible !== false) && 
           (productSetting.price || p.basePrice !== undefined);
  });

  // 处理购物车变化，支持数量和备注
  const handleCartChange = (productId, cartItem) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (cartItem.quantity > 0) {
        newCart[productId] = cartItem;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  // 计算购物车总计
  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [pid, item]) => {
      const productId = parseInt(pid);
      // 兼容新旧价格列表格式
      const priceData = typeof priceList[productId] === 'object' ? priceList[productId] : { price: priceList[productId] };
      const price = priceData.price || products.find(p => p.id === productId)?.basePrice || 0;
      return sum + (price * item.quantity);
    }, 0);
  }, [cart, priceList, products]);

  // 计算购物车总数量
  const totalCartItems = Object.values(cart).reduce((a, b) => a + b.quantity, 0);

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) return;
    onPlaceOrder({
      customerId: user.id,
      customerName: user.name,
      items: cart,
      total: cartTotal,
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      notes: orderNotes
    });
    setCart({});
    setOrderNotes('');
    setActiveTab('orders');
  };

  const MobileNavItem = ({ icon: Icon, label, tab }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center p-2 transition-colors duration-200 ${
        activeTab === tab ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={24} />
      <span className="text-xs mt-0.5">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-100 max-w-lg mx-auto border-x border-gray-300">
      <header className="sticky top-0 bg-white shadow-sm p-4 z-10">
        <div className="flex justify-between items-center text-sm">
          <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
             <Home size={20} /> 快速订货
          </h2>
          <div className="text-xs text-gray-500 text-right">
             <span className="font-bold text-gray-700">{user.name}</span>
             <p>账期: {user.billing}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-16"> 
        {activeTab === 'shop' && (
          <div className="space-y-4">
             <div className="bg-orange-50 p-3 rounded-xl flex items-start gap-2 text-sm text-orange-800 border border-orange-200">
                 <AlertCircle size={16} className="mt-0.5 shrink-0" />
                 <p className="font-medium">今日下单，最早 {new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]} 发货。</p>
              </div>
            <div className="grid grid-cols-1 gap-4">
              {availableProducts.map(product => {
                 // 兼容新旧价格列表格式
                 const priceData = typeof priceList[product.id] === 'object' ? priceList[product.id] : { price: priceList[product.id] };
                 const price = priceData.price || product.basePrice;
                 const displayName = priceData.alias || product.name;
                 return (
                    <ProductCard 
                      key={product.id}
                      product={{
                        ...product,
                        name: displayName
                      }}
                      price={price}
                      cart={cart}
                      onCartChange={handleCartChange}
                      isMobile={true}
                    />
                 )
              })}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
             <div className="space-y-4">
               <h3 className="text-xl font-bold text-gray-700 mb-2 border-b pb-2">购物车清单</h3>
               {Object.keys(cart).length === 0 ? (
                 <div className="text-center py-10 text-gray-400 border rounded-xl bg-white">
                    <ShoppingCart size={36} className="mx-auto text-gray-300 mb-2"/>
                    <p className="text-base">购物车是空的</p>
                 </div>
               ) : (
                 <Card className="p-4 space-y-3">
                     {Object.entries(cart).map(([pid, item]) => {
                       const productId = parseInt(pid);
                       const p = products.find(i => i.id === productId);
                       // 兼容新旧价格列表格式
                       const priceData = typeof priceList[productId] === 'object' ? priceList[productId] : { price: priceList[productId] };
                       const price = priceData.price || p?.basePrice || 0;
                       const alias = priceData.alias || p?.name || '未知商品';
                       return (
                         <div key={pid} className="border-b pb-3 last:border-b-0 last:pb-0">
                           <div className="flex justify-between items-center">
                             <div className="flex items-center gap-3">
                               <span className="text-xl">{p.image}</span>
                               <div className="flex-1">
                                 <div className="text-base font-medium text-gray-800">{alias}</div>
                                 <div className="text-sm text-gray-500">¥{price}</div>
                               </div>
                             </div>
                             <div className="flex items-center gap-3">
                               <div className="font-bold text-lg text-orange-600 w-16 text-right">¥{(price * item.quantity)}</div>
                             </div>
                           </div>
                           {item.notes && (
                             <div className="ml-14 text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">
                               <span className="text-xs font-semibold text-gray-500">备注: </span>{item.notes}
                             </div>
                           )}
                         </div>
                       );
                     })}
                     <div className='pt-3'>
                        <Button variant="secondary" onClick={() => setCart({})} className="w-full text-red-500 hover:bg-red-50"><Trash2 size={16} /> 清空购物车</Button>
                     </div>
                   </Card>
               )}
               {Object.keys(cart).length > 0 && (
                   <div className="space-y-4">
                     <Card className="p-4">
                       <label className="block text-sm font-bold text-gray-700 mb-1">
                         订单备注
                       </label>
                       <textarea
                         value={orderNotes}
                         onChange={(e) => setOrderNotes(e.target.value)}
                         rows={3}
                         className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                         placeholder="输入订单备注..."
                       />
                     </Card>
                     <Card className="p-4 border-t-4 border-orange-500">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-xl font-bold">总计金额</span>
                         <span className="text-3xl font-extrabold text-orange-600">¥{cartTotal}</span>
                      </div>
                      <Button onClick={handleCheckout} className="w-full py-3 text-lg">
                        <ClipboardList size={20} /> 确认提交订单 ({totalCartItems} 件)
                      </Button>
                   </Card>
                   </div>
               )}
            </div>
        )}

        {activeTab === 'orders' && (
          <ClientOrdersHistory user={user} orders={orders} products={products} priceList={priceList} />
        )}
      </main>
      
      <footer className="fixed bottom-0 w-full max-w-lg mx-auto bg-white border-t shadow-2xl z-20">
        <div className="flex justify-around items-center h-16">
          <MobileNavItem icon={Package} label="订货" tab="shop" />
          <div className="relative">
             <MobileNavItem icon={ShoppingCart} label="购物车" tab="cart" />
             {totalCartItems > 0 && (
                 <span className="absolute top-1 right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold transform -translate-y-1/2 translate-x-1/2">
                   {totalCartItems}
                 </span>
             )}
          </div>
          <MobileNavItem icon={FileText} label="订单" tab="orders" />
        </div>
      </footer>
    </div>
  );
};

// --- Admin Components ---

const NewCustomerModal = ({ products, onSave, onClose }) => {
  const [newCustomer, setNewCustomer] = useState({ name: '', type: 'Chain Store', billing: '月结30天', address: '' });
  const [productSettings, setProductSettings] = useState({});

  // 初始化商品设置
  useEffect(() => {
    const initialSettings = {};
    products.forEach(p => {
      initialSettings[p.id] = {
        price: '',
        alias: '',
        specs: '',
        isVisible: true
      };
    });
    setProductSettings(initialSettings);
  }, [products]);

  // 处理商品设置变化
  const handleProductSettingChange = (productId, field, value) => {
    setProductSettings(prev => {
      const newSettings = { ...prev };
      newSettings[productId] = { ...newSettings[productId], [field]: value };
      return newSettings;
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.address) return;
    
    // 转换为所需格式
    const processedSettings = {};
    Object.entries(productSettings).forEach(([productId, settings]) => {
      const price = parseFloat(settings.price);
      if (price > 0 || settings.alias || settings.specs || !settings.isVisible) {
        processedSettings[productId] = {
          price: price || null,
          alias: settings.alias || null,
          specs: settings.specs || null,
          isVisible: settings.isVisible
        };
      }
    });
    
    onSave(newCustomer, processedSettings);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
        <div className="p-4 border-b flex justify-between items-center bg-blue-50">
          <h3 className="font-bold text-lg text-blue-800">新增客户档案</h3>
          <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-900"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <fieldset className="p-4 border border-gray-200 rounded-lg space-y-3">
            <legend className="text-sm font-bold text-gray-600 px-2">基本信息</legend>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">客户名称</label>
                 <input name="name" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} required className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200" placeholder="如: 每日生鲜超市" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">客户类型</label>
                 <select name="type" value={newCustomer.type} onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none">
                   <option value="Chain Store">连锁店</option>
                   <option value="Supermarket">超市</option>
                   <option value="Individual">个体户</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">账期</label>
                 <select name="billing" value={newCustomer.billing} onChange={(e) => setNewCustomer({...newCustomer, billing: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none">
                   <option value="月结30天">月结30天</option>
                   <option value="月结60天">月结60天</option>
                   <option value="现结">现结</option>
                 </select>
               </div>
            </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 mb-1">配送地址</label>
               <input name="address" value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} required className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200" placeholder="详细收货地址" />
             </div>
          </fieldset>
          
          <fieldset className="p-4 border border-gray-200 rounded-lg">
             <legend className="text-sm font-bold text-gray-600 px-2 flex items-center gap-1"><DollarSign size={14}/> 商品个性化设置</legend>
             <div className="space-y-4">
               {products.map(p => (
                 <div key={p.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                   <div className="flex items-center gap-3 mb-3">
                     <span className="text-2xl">{p.image}</span>
                     <div>
                       <h4 className="font-medium text-sm">{p.name}</h4>
                       <p className="text-xs text-gray-500">基准价: ¥{p.basePrice}</p>
                     </div>
                     <div className="ml-auto">
                       <label className="flex items-center gap-2 text-xs font-bold text-gray-500">
                         <input
                           type="checkbox"
                           checked={productSettings[p.id]?.isVisible}
                           onChange={(e) => handleProductSettingChange(p.id, 'isVisible', e.target.checked)}
                           className="rounded text-orange-500 focus:ring-orange-200"
                         />
                         展示该商品
                       </label>
                     </div>
                   </div>
                   <div className="grid grid-cols-3 gap-3">
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">专属价格</label>
                       <input 
                         type="number" 
                         step="0.01" 
                         min="0" 
                         value={productSettings[p.id]?.price}
                         onChange={(e) => handleProductSettingChange(p.id, 'price', e.target.value)} 
                         className="w-full border rounded-lg p-1.5 text-sm text-right outline-none focus:ring-2 focus:ring-orange-200" 
                         placeholder="专属价" 
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">商品别名</label>
                       <input 
                         type="text" 
                         value={productSettings[p.id]?.alias}
                         onChange={(e) => handleProductSettingChange(p.id, 'alias', e.target.value)} 
                         className="w-full border rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-200" 
                         placeholder="如: 羊角包" 
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">规格</label>
                       <input 
                         type="text" 
                         value={productSettings[p.id]?.specs}
                         onChange={(e) => handleProductSettingChange(p.id, 'specs', e.target.value)} 
                         className="w-full border rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-200" 
                         placeholder="如: 1个装" 
                       />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </fieldset>
        </div>
        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
          <Button type="submit" variant="primary" className="w-32"><Save size={16}/> 确认新增</Button>
        </div>
      </form>
    </div>
  );
};

const OrderCreationModule = ({ products, customers, priceStrategies, onPlaceOrder }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [salesCart, setSalesCart] = useState({});
  const [message, setMessage] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const selectedCustomer = customers.find(c => c.id === parseInt(selectedCustomerId));
  const priceList = selectedCustomer ? priceStrategies[selectedCustomer.id] || {} : {};

  // 获取商品价格，兼容新旧价格列表格式
  const getProductPrice = (productId) => {
    const priceData = typeof priceList[productId] === 'object' ? priceList[productId] : { price: priceList[productId] };
    return priceData.price || products.find(p => p.id === productId)?.basePrice || 0;
  };
  
  // 获取商品别名，兼容新旧价格列表格式
  const getProductAlias = (productId) => {
    const product = products.find(p => p.id === productId);
    const priceData = typeof priceList[productId] === 'object' ? priceList[productId] : {};
    return priceData.alias || product?.name || '未知商品';
  };

  // 处理购物车数量变化
  const handleQtyChange = (productId, qty) => {
    setSalesCart(prev => {
      const newCart = { ...prev };
      const currentItem = newCart[productId] || { quantity: 0, notes: '' };
      if (qty > 0) {
        newCart[productId] = { ...currentItem, quantity: qty };
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
    setMessage('');
  };
  
  // 处理商品备注变化
  const handleProductNotesChange = (productId, notes) => {
    setSalesCart(prev => {
      const newCart = { ...prev };
      const currentItem = newCart[productId] || { quantity: 0, notes: '' };
      newCart[productId] = { ...currentItem, notes: notes };
      return newCart;
    });
  };

  // 计算购物车总计
  const salesCartTotal = useMemo(() => {
    return Object.entries(salesCart).reduce((sum, [pid, item]) => {
      const price = getProductPrice(parseInt(pid));
      return sum + (price * item.quantity);
    }, 0);
  }, [salesCart, priceList, products]);

  const handleSubmitOrder = () => {
    if (!selectedCustomer) { setMessage('❗ 请选择一个客户进行下单。'); return; }
    if (Object.keys(salesCart).length === 0) { setMessage('❗ 购物车为空，请添加商品。'); return; }
    
    onPlaceOrder({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: salesCart,
      total: salesCartTotal,
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      notes: orderNotes
    });

    setMessage(`✅ 已成功为 ${selectedCustomer.name} 创建订单，总额 ¥${salesCartTotal}。`);
    setSalesCart({});
    setSelectedCustomerId('');
    setOrderNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">销售代客下单</h3>
        <Button
          onClick={() => alert('导入Excel功能开发中...')}
          variant="outline"
          className="text-sm"
        >
          <FileText size={16} /> 导入Excel出货单
        </Button>
      </div>
      <Card className="p-4 space-y-4">
        <label className="block text-sm font-bold text-gray-700">选择客户</label>
        <select className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-200" value={selectedCustomerId} onChange={(e) => { setSelectedCustomerId(e.target.value); setSalesCart({}); setMessage(''); }}>
          <option value="">-- 请选择客户 --</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>)}
        </select>
        {selectedCustomer && (
          <div className="text-xs text-gray-600 bg-orange-50 p-2 rounded">
            <p><strong>地址:</strong> {selectedCustomer.address}</p>
            <p><strong>账期:</strong> {selectedCustomer.billing}</p>
          </div>
        )}
      </Card>
      {message && <div className={`p-3 rounded-lg text-sm font-medium ${message.startsWith('❗') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{message}</div>}
      <Card className="overflow-hidden">
        <div className="p-4 bg-gray-50 border-b font-bold text-gray-700 grid grid-cols-4"><span className="col-span-2">商品名称 (¥ 基准价)</span><span>专属价</span><span className="text-right">数量</span></div>
        <div className="p-4 space-y-3">
          {products.map(p => {
            const price = getProductPrice(p.id);
            const alias = getProductAlias(p.id);
            const cartItem = salesCart[p.id] || { quantity: 0, notes: '' };
            return (
              <div key={p.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="grid grid-cols-4 items-center">
                  <div className="col-span-2 flex items-center gap-2">
                      <span className="text-xl">{p.image}</span>
                      <div>
                        <span className="text-sm font-medium">{alias} 
                            <span className="text-xs text-gray-400 font-normal"> (¥{p.basePrice})</span>
                        </span>
                        {alias !== p.name && (
                          <p className="text-xs text-gray-500">原名: {p.name}</p>
                        )}
                      </div>
                  </div>
                  <span className={`text-sm font-bold ${price !== p.basePrice ? 'text-orange-600' : 'text-gray-700'}`}>¥{price.toFixed(2)}</span>
                  <div className="flex justify-end">
                     <ProductQuantityInput 
                        product={p} 
                        price={price} 
                        currentQty={cartItem.quantity} 
                        onQtyChange={handleQtyChange} 
                        isMobile={false} // 后台使用桌面样式
                     />
                  </div>
                </div>
                <div className="mt-2 ml-12">
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    商品备注
                  </label>
                  <textarea
                    value={cartItem.notes}
                    onChange={(e) => handleProductNotesChange(p.id, e.target.value)}
                    rows={2}
                    className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="输入商品备注..."
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card className="p-4">
        <label className="block text-sm font-bold text-gray-700 mb-1">
          订单备注
        </label>
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          rows={3}
          className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
          placeholder="输入订单备注..."
        />
      </Card>
      <Card className="p-6 flex justify-between items-center bg-blue-50 border-blue-200">
        <div className="text-xl font-bold text-gray-800">总计金额: <span className="text-orange-600 font-extrabold ml-2">¥{salesCartTotal}</span></div>
        <Button onClick={handleSubmitOrder} disabled={!selectedCustomer || salesCartTotal === 0} className="py-3 px-8 text-lg"><Save size={20}/> 确认创建订单</Button>
      </Card>
    </div>
  );
};

const AdminDashboard = ({ products, setProducts, customers, setCustomers, priceStrategies, setPriceStrategies, orders, setOrders, onPlaceOrder }) => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null); 
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
    const predictions = products.map((p) => ({
    name: p.name,
    actual: Math.floor(Math.random() * 50) + 20,
    predicted: Math.floor(Math.random() * 60) + 30,
  }));
  const totalPredictedProduction = predictions.reduce(
    (sum, p) => sum + p.predicted,
    0
  );
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  
  const updateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };
  
  const filteredCustomers = useMemo(() => {
    const query = customerSearchQuery.toLowerCase();
    if (!query) return customers;
    return customers.filter(c => c.name.toLowerCase().includes(query) || c.id.toString().includes(query));
  }, [customers, customerSearchQuery]);

  const handleAddNewCustomer = (newCustomerData, newProductSettings) => {
    const maxId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) : 100;
    const newId = maxId + 1;
    // 默认给新客户一个模式，例如 desktop
    setCustomers(prev => [...prev, { ...newCustomerData, id: newId, mode: 'desktop' }]);
    
    // 转换产品设置格式，移除空值
    const processedSettings = {};
    Object.entries(newProductSettings).forEach(([productId, settings]) => {
      const cleanedSettings = {};
      if (settings.price !== null && settings.price !== '') cleanedSettings.price = settings.price;
      if (settings.alias) cleanedSettings.alias = settings.alias;
      if (settings.specs) cleanedSettings.specs = settings.specs;
      if (settings.isVisible !== undefined) cleanedSettings.isVisible = settings.isVisible;
      
      if (Object.keys(cleanedSettings).length > 0) {
        processedSettings[productId] = cleanedSettings;
      }
    });
    
    setPriceStrategies(prev => ({ ...prev, [newId]: processedSettings }));
  };
  
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProduct = {
      id: editingProduct.id || Date.now(), 
      name: formData.get('name'),
      category: formData.get('category'),
      basePrice: parseFloat(formData.get('basePrice')),
      leadTime: parseInt(formData.get('leadTime')),
      description: formData.get('description'),
      image: formData.get('image') || '📦',
      alias: formData.get('alias'),
      isVisible: formData.get('isVisible') === 'on',
      notes: formData.get('notes'),
    };
    if (editingProduct.id) setProducts(prev => prev.map(p => p.id === newProduct.id ? newProduct : p));
    else setProducts(prev => [...prev, newProduct]);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm(`确定要删除ID为 ${id} 的商品吗？这将是不可逆的操作。`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex h-full bg-slate-100 text-slate-800 font-sans">
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2">🏭 烘焙智造</h2>
          <p className="text-xs text-slate-400 mt-2">SaaS 销售管理系统</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveModule('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${activeModule === 'dashboard' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}><BarChart3 size={18} /> 销售概览</button>
          <button onClick={() => setActiveModule('createOrder')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${activeModule === 'createOrder' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}><ClipboardList size={18} /> 创建订单</button>
          <button onClick={() => setActiveModule('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${activeModule === 'orders' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}><FileText size={18} /> 订单审核</button>
          <button onClick={() => setActiveModule('customers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${activeModule === 'customers' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}><Users size={18} /> 客户与价格</button>
          <button onClick={() => setActiveModule('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${activeModule === 'products' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}><Package size={18} /> 商品管理</button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-700">管理员模式</h2>
          <div className="flex items-center gap-4"><div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">A</div></div>
        </header>

        <main className="p-6">
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              {/* 数据卡片区域 - 8个卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 今日销售额 */}
                <Card className="p-4 border-l-4 border-orange-500 hover:shadow-md transition-shadow">
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
                {/* 待处理订单 */}
                <Card className="p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                  <div className="text-gray-500 text-xs uppercase font-bold">
                    待处理订单
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {pendingOrdersCount}
                  </div>
                </Card>
                {/* 明日预计产能需求 */}
                <Card className="p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
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
                {/* 历史最高销量 */}
                <Card className="p-4 border-l-4 border-gray-500 hover:shadow-md transition-shadow">
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
                {/* 本月销售额 */}
                <Card className="p-4 border-l-4 border-red-500 hover:shadow-md transition-shadow">
                  <div className="text-gray-500 text-xs uppercase font-bold">
                    本月销售额
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    ¥{(totalSales * 30).toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> +8% 环比上月
                  </div>
                </Card>
                {/* 累计订单数 */}
                <Card className="p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                  <div className="text-gray-500 text-xs uppercase font-bold">
                    累计订单数
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {orders.length}
                  </div>
                </Card>
                {/* 平均客单价 */}
                <Card className="p-4 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                  <div className="text-gray-500 text-xs uppercase font-bold">
                    平均客单价
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    ¥{(orders.reduce((sum, order) => sum + order.total, 0) / orders.length)}
                  </div>
                </Card>
                {/* 热销产品数 */}
                <Card className="p-4 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                  <div className="text-gray-500 text-xs uppercase font-bold">
                    热销产品数
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {products.length}
                  </div>
                </Card>
              </div>

              {/* 销售趋势分析 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} />
                    销售趋势分析
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold">日</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">周</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">月</button>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-around">
                      {/* 模拟折线图数据 */}
                      {[1200, 1500, 1300, 1800, 1600, 2000, 1900].map((value, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div 
                            className="w-8 bg-orange-500 rounded-t-lg transition-all duration-300 hover:bg-orange-600"
                            style={{ height: `${value / 20}px` }}
                          ></div>
                          <div className="text-xs text-gray-500">{index + 1}日</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* 产品类别分析 */}
                <Card className="p-6">
                  <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Package size={18} />
                    产品类别分析
                  </h3>
                  <div className="flex items-center justify-around">
                    {/* 模拟饼图 */}
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)' }}></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)' }}></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-green-600" style={{ clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)' }}></div>
                      <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">¥{totalSales.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">总销售额</div>
                        </div>
                      </div>
                    </div>
                    {/* 类别图例 */}
                    <div className="space-y-3">
                      {[
                        { name: '起酥类', color: 'bg-orange-500', value: '35%' },
                        { name: '吐司类', color: 'bg-blue-500', value: '25%' },
                        { name: '冷链甜点', color: 'bg-purple-500', value: '20%' },
                        { name: '常温蛋糕', color: 'bg-green-500', value: '20%' }
                      ].map((category, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                          <div className="text-sm flex justify-between w-28">
                            <span>{category.name}</span>
                            <span className="font-bold">{category.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* 客户分析 */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Users size={18} />
                  客户分析
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 客户订单排名 */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 mb-3">客户订单排名</h4>
                    <div className="space-y-3">
                      {customers.map((customer, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.type}</div>
                          </div>
                          <div className="text-sm font-bold">{Math.floor(Math.random() * 20) + 5}单</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* 客户类型分布 */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 mb-3">客户类型分布</h4>
                    <div className="space-y-3">
                      {[
                        { type: '连锁便利', count: 12, percentage: '60%', color: 'bg-blue-500' },
                        { type: '超市', count: 5, percentage: '25%', color: 'bg-green-500' },
                        { type: '餐饮', count: 3, percentage: '15%', color: 'bg-orange-500' }
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.type}</span>
                            <span className="font-bold">{item.count}家 ({item.percentage})</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.percentage }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* 产品表现排行榜 */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} />
                  产品表现排行榜
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-sm font-bold text-gray-600">排名</th>
                        <th className="py-3 px-4 text-sm font-bold text-gray-600">产品</th>
                        <th className="py-3 px-4 text-sm font-bold text-gray-600">类别</th>
                        <th className="py-3 px-4 text-sm font-bold text-gray-600">销售数量</th>
                        <th className="py-3 px-4 text-sm font-bold text-gray-600">销售额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{product.image}</span>
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                          <td className="py-3 px-4 text-sm font-bold">{Math.floor(Math.random() * 500) + 100}个</td>
                          <td className="py-3 px-4 text-sm font-bold text-orange-600">¥{Math.floor(Math.random() * 5000) + 1000}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* 产能分析 */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar size={18} />
                  产能分析
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 明日销量预估 */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 mb-3">明日销量预估 (基于历史订单习惯)</h4>
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
                  </div>
                  {/* 产能利用率 */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 mb-3">产能利用率</h4>
                    <div className="space-y-4">
                      {[
                        { name: '今日', value: 85 },
                        { name: '昨日', value: 78 },
                        { name: '前日', value: 92 },
                        { name: '上周同期', value: 88 }
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.name}</span>
                            <span className="font-bold text-orange-600">{item.value}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          {activeModule === 'createOrder' && <OrderCreationModule products={products} customers={customers} priceStrategies={priceStrategies} onPlaceOrder={onPlaceOrder} />}
          {activeModule === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">订单管理</h3>
                <Button
                  onClick={() => {
                    // 实现导出到安仕达Excel的逻辑
                    const exportToAnShiDaExcel = (orders, products) => {
                      // 生成Excel文件的逻辑，这里使用简单的CSV格式模拟
                      let csvContent = "订单号,客户名称,订单金额,订单状态,商品名称,数量,单价,商品备注\n";
                      
                      orders.forEach(order => {
                        Object.entries(order.items).forEach(([pid, item]) => {
                          const productId = parseInt(pid);
                          const product = products.find(p => p.id === productId);
                          const quantity = typeof item === 'object' ? item.quantity : item;
                          const notes = typeof item === 'object' ? item.notes || '' : '';
                          const price = product ? order.total / quantity : 0;
                          
                          csvContent += `${order.id},${order.customerName},${order.total},${order.status},${product?.name || '未知商品'},${quantity},${price},${notes}\n`;
                        });
                      });
                      
                      // 创建并下载文件
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement('a');
                      const url = URL.createObjectURL(blob);
                      link.setAttribute('href', url);
                      link.setAttribute('download', `安仕达订单导出_${new Date().toISOString().split('T')[0]}.csv`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    };
                    
                    exportToAnShiDaExcel(orders, products);
                  }}
                  variant="primary"
                  className="text-sm"
                >
                  <FileText size={16} /> 导出到安仕达Excel
                </Button>
              </div>
              <Card className="overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b"><tr><th className="p-4">订单号</th><th className="p-4">客户</th><th className="p-4">总额</th><th className="p-4">状态</th><th className="p-4">操作</th><th className="p-4">详情</th></tr></thead>
                  <tbody className="divide-y">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono text-xs">{order.id}</td>
                        <td className="p-4">{order.customerName}</td>
                        <td className="p-4 font-bold">¥{order.total}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>{order.status}</span></td>
                        {order.status === 'Pending' && <td className="p-4"> <Button variant="primary" className="py-1 px-3 text-xs" onClick={() => updateStatus(order.id, 'Production')}>确认排产</Button></td>}
                        {order.status === 'Production' && <td className="p-4"> <Button variant="danger" className="py-1 px-3 text-xs" onClick={() => updateStatus(order.id, 'Completed')}>发货完成</Button></td>}
                        {order.status === 'Completed' && <td className="p-4"> - </td>}
                        <td className="p-4">
                          <Button variant="outline" className="py-1 px-3 text-xs" onClick={() => {
                            const selectedOrder = orders.find(o => o.id === order.id);
                            // 显示订单详情
                            alert(`订单详情: ${order.id}\n客户: ${order.customerName}\n总额: ¥${order.total}\n状态: ${order.status}`);
                          }}>查看详情</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}
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
                                      {product.alias && (
                                        <span className="text-xs text-gray-500 ml-1">
                                          ({product.alias})
                                        </span>
                                      )}
                                      {!product.isVisible && (
                                        <span className="text-xs bg-gray-100 text-gray-500 px-1 rounded ml-1">
                                          已隐藏
                                        </span>
                                      )}
                                    </span>
                                    <span className="font-mono text-orange-600 font-bold">
                                      ¥{(typeof price === 'object' ? price.price : parseFloat(price))?.toFixed(2) || '0.00'}
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
                            ¥{product.basePrice}
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
                        onClick={() => setEditingProduct(product)}
                      >
                        <SquarePen size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      商品别名
                    </label>
                    <input
                      name="alias"
                      defaultValue={editingProduct.alias}
                      className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                      placeholder="如: 羊角包"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <input
                        type="checkbox"
                        name="isVisible"
                        defaultChecked={editingProduct.isVisible !== false}
                        className="rounded text-orange-500 focus:ring-orange-200"
                      />
                      展示该商品
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    商品备注
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={editingProduct.notes}
                    rows={2}
                    className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="输入商品备注..."
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

// --- Main App ---
export default function App() {
  const [viewMode, setViewMode] = useState('welcome'); 
  const [products, setProducts] = useState(INITIAL_PRODUCTS); 
  const [orders, setOrders] = useState(INITIAL_ORDERS); 
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS); 
  const [priceStrategies, setPriceStrategies] = useState(INITIAL_PRICE_STRATEGIES); 

  const handlePlaceOrder = (newOrder) => {
    const orderData = { id: `ORD-${Date.now()}`, status: 'Pending', ...newOrder };
    setOrders([orderData, ...orders]);
  };
  
  const currentClientId = viewMode === 'client-101' ? 101 : viewMode === 'client-102' ? 102 : null;
  const currentClient = customers.find(c => c.id === currentClientId);
  const currentClientPriceList = currentClient ? priceStrategies[currentClient.id] : {};

  if (viewMode === 'welcome') {
    return (
      <div className="h-screen bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center space-y-10">
          <div><h1 className="text-4xl font-extrabold text-gray-900 mb-2">🍞 烘焙工厂信息化销售系统</h1></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button onClick={() => setViewMode('client-101')} className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-red-500 hover:scale-105 transition"><div className="text-4xl mb-3">📱</div><h3 className="font-bold text-xl">客户 A (移动端)</h3><p className="text-sm text-gray-500">7-Eleven</p></button>
            <button onClick={() => setViewMode('client-102')} className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-blue-500 hover:scale-105 transition"><div className="text-4xl mb-3">🖥️</div><h3 className="font-bold text-xl">客户 B (电脑端)</h3><p className="text-sm text-gray-500">沃尔玛</p></button>
            <button onClick={() => setViewMode('admin')} className="bg-slate-800 text-white p-8 rounded-xl shadow-lg border-b-4 border-slate-600 hover:scale-105 transition"><div className="text-4xl mb-3">📊</div><h3 className="font-bold text-xl">工厂管理后台</h3><p className="text-sm text-slate-400">全权限</p></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center text-sm z-50 shadow-md">
        <div className="flex items-center gap-2"><span className="font-bold text-orange-400">演示控制台</span><span className="opacity-80">当前: {viewMode === 'admin' ? '后台' : `客户: ${currentClient?.name}`}</span></div>
        <div className="flex gap-2">
           <button onClick={() => setViewMode('welcome')} className="hover:text-white text-gray-400 flex items-center gap-1"><LogOut size={14} /> 退出</button>
           <select className="bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-xs outline-none" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
             <option value="client-101">7-Eleven (移动端)</option><option value="client-102">沃尔玛 (电脑端)</option><option value="admin">管理后台</option>
           </select>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative bg-gray-200">
        {viewMode === 'client-101' && currentClient ? <ClientAppMobile user={currentClient} products={products} priceList={currentClientPriceList} onPlaceOrder={handlePlaceOrder} orders={orders} /> :
         viewMode === 'client-102' && currentClient ? <ClientAppDesktop user={currentClient} products={products} priceList={currentClientPriceList} onPlaceOrder={handlePlaceOrder} orders={orders} /> : 
         viewMode === 'admin' ? <AdminDashboard products={products} setProducts={setProducts} customers={customers} setCustomers={setCustomers} priceStrategies={priceStrategies} setPriceStrategies={setPriceStrategies} orders={orders} setOrders={setOrders} onPlaceOrder={handlePlaceOrder} /> : null}
      </div>
    </div>
  );
}