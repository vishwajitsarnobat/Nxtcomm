// forntend/src/components/EmployeeHomepage/EmployeeHomepage.jsx
import React, { useState, useEffect } from 'react';
import { PackageIcon, TruckIcon, DollarSignIcon } from 'lucide-react';

const EmployeeHomepage = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, inventoryRes, transactionsRes] = await Promise.all([
          fetch('http://localhost:5000/api/employee-home/orders'),
          fetch('http://localhost:5000/api/employee-home/inventory'),
          fetch('http://localhost:5000/api/employee-home/daily-transactions')
        ]);
        
        const [ordersData, inventoryData, transactionsData] = await Promise.all([
          ordersRes.json(),
          inventoryRes.json(),
          transactionsRes.json()
        ]);

        setOrders(ordersData);
        setInventory(inventoryData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:5000/api/employee-home/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      setOrders(orders.map(order => 
        order.order_id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <PackageIcon className="w-8 h-8 text-blue-600" />
            <h3 className="ml-2 text-lg font-bold">Pending Orders</h3>
          </div>
          <p className="text-2xl font-bold">
            {orders.filter(order => order.status === 'pending').length}
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <TruckIcon className="w-8 h-8 text-green-600" />
            <h3 className="ml-2 text-lg font-bold">In Delivery</h3>
          </div>
          <p className="text-2xl font-bold">
            {orders.filter(order => order.status === 'in_delivery').length}
          </p>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <DollarSignIcon className="w-8 h-8 text-yellow-600" />
            <h3 className="ml-2 text-lg font-bold">Daily Transactions</h3>
          </div>
          <p className="text-2xl font-bold">
            ${transactions.reduce((acc, curr) => acc + curr.total_amount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id} className="border-b">
                  <td className="px-6 py-4">{order.order_id}</td>
                  <td className="px-6 py-4">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">${order.total_amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="in_delivery">In Delivery</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inventory Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Inventory Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <div key={item.product_id} className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Stock: <span className={item.stock_quantity < 10 ? 'text-red-600 font-bold' : ''}>
                  {item.stock_quantity}
                </span>
              </p>
              <p className="text-sm">
                Supplier: {item.supplier_first_name} {item.supplier_last_name}
              </p>
              <p className="text-sm">Phone: {item.supplier_phone}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EmployeeHomepage;