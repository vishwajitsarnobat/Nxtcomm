// forntend/src/components/AdminHomepage/AdminHomepage.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { UserIcon, WarehouseIcon, TrendingUpIcon } from 'lucide-react';

const AdminHomepage = () => {
  const [employees, setEmployees] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, warehousesRes, analyticsRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin-home/employees'),
          fetch('http://localhost:5000/api/admin-home/warehouses'),
          fetch('http://localhost:5000/api/admin-home/analytics')
        ]);
        
        const [employeesData, warehousesData, analyticsData] = await Promise.all([
          employeesRes.json(),
          warehousesRes.json(),
          analyticsRes.json()
        ]);

        setEmployees(employeesData);
        setWarehouses(warehousesData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <UserIcon className="w-8 h-8 text-blue-600" />
            <h3 className="ml-2 text-lg font-bold">Total Employees</h3>
          </div>
          <p className="text-2xl font-bold">{employees.length}</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
          <WarehouseIcon className="w-8 h-8 text-green-600" />
            <h3 className="ml-2 text-lg font-bold">Warehouses</h3>
          </div>
          <p className="text-2xl font-bold">{warehouses.length}</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <TrendingUpIcon className="w-8 h-8 text-purple-600" />
            <h3 className="ml-2 text-lg font-bold">Monthly Revenue</h3>
          </div>
          <p className="text-2xl font-bold">
            ${analytics?.sales?.total_revenue?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Sales Analytics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Top Products</h3>
            <BarChart width={500} height={300} data={analytics?.topProducts || []}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="order_count" fill="#4F46E5" />
            </BarChart>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Low Stock Alert</h3>
            <div className="space-y-4">
              {analytics?.lowStock?.map((product) => (
                <div key={product.product_id} className="flex justify-between items-center">
                  <span>{product.name}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {product.stock_quantity} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Employee Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Hire Date</th>
                <th className="px-6 py-3 text-left">Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id} className="border-b">
                  <td className="px-6 py-4">{employee.employee_id}</td>
                  <td className="px-6 py-4">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="px-6 py-4">{employee.role}</td>
                  <td className="px-6 py-4">{employee.email}</td>
                  <td className="px-6 py-4">
                    {new Date(employee.hire_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">${employee.salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Warehouse Management */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Warehouse Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((warehouse) => (
            <div key={warehouse.warehouse_id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4">Warehouse #{warehouse.warehouse_id}</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Capacity:</span>{' '}
                  {warehouse.capacity.toLocaleString()} units
                </p>
                <p>
                  <span className="text-gray-600">Monthly Rent:</span>{' '}
                  ${warehouse.rent.toLocaleString()}
                </p>
                <p>
                  <span className="text-gray-600">Manager:</span>{' '}
                  {warehouse.manager_first_name} {warehouse.manager_last_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminHomepage;