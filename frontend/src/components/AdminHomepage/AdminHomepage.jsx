// frontend/src/components/AdminHomepage/AdminHomepage.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { UserIcon, WarehouseIcon, TrendingUpIcon } from 'lucide-react';
import Modal from 'react-modal'; // Make sure to install react-modal

const AdminHomepage = () => {
  const [employees, setEmployees] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);

  // Employee form state
  const [newEmployee, setNewEmployee] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    role: '',
    email: '',
    phone_number: '',
    hire_date: '',
    salary: ''
  });

  // Warehouse form state
  const [newWarehouse, setNewWarehouse] = useState({
    capacity: '',
    rent: '',
    managerId: ''
  });

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

  const handleAddEmployee = async () => {
    try {
      await fetch('http://localhost:5000/api/admin-home/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });
      setIsEmployeeModalOpen(false);
      setNewEmployee({
        employee_id: '',
        first_name: '',
        last_name: '',
        role: '',
        email: '',
        phone_number: '',
        hire_date: '',
        salary: ''
      });
      // Re-fetch the employees to update the list
      const res = await fetch('http://localhost:5000/api/admin-home/employees');
      setEmployees(await res.json());
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleAddWarehouse = async () => {
    try {
      await fetch('http://localhost:5000/api/admin-home/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWarehouse)
      });
      setIsWarehouseModalOpen(false);
      setNewWarehouse({ capacity: '', rent: '', managerId: '' });
      // Re-fetch the warehouses to update the list
      const res = await fetch('http://localhost:5000/api/admin-home/warehouses');
      setWarehouses(await res.json());
    } catch (error) {
      console.error('Error adding warehouse:', error);
    }
  };

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
      
      {/* Employee Modal */}
      {isEmployeeModalOpen && (
        <div className="modal">
          <h2>Add New Employee</h2>
          <input
            type="number"
            placeholder="Employee ID"
            value={newEmployee.employee_id}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, employee_id: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="First Name"
            value={newEmployee.firstName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newEmployee.lastName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, lastName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Role"
            value={newEmployee.role}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, role: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newEmployee.phoneNumber}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="Hire Date"
            value={newEmployee.hireDate}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, hireDate: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Salary"
            value={newEmployee.salary}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, salary: e.target.value })
            }
          />
          <button onClick={handleAddEmployee}>Add Employee</button>
          <button onClick={() => setIsEmployeeModalOpen(false)}>Close</button>
        </div>
      )}

      {/* Warehouse Modal */}
      {isWarehouseModalOpen && (
        <div className="modal">
          <h2>Add New Warehouse</h2>
          <input
            type="number"
            placeholder="Capacity"
            value={newWarehouse.capacity}
            onChange={(e) =>
              setNewWarehouse({ ...newWarehouse, capacity: parseInt(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Rent"
            value={newWarehouse.rent}
            onChange={(e) =>
              setNewWarehouse({ ...newWarehouse, rent: parseFloat(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Manager ID"
            value={newWarehouse.managerId}
            onChange={(e) =>
              setNewWarehouse({ ...newWarehouse, managerId: parseInt(e.target.value) })
            }
          />
          <button onClick={handleAddWarehouse}>Add Warehouse</button>
          <button onClick={() => setIsWarehouseModalOpen(false)}>Close</button>
        </div>
      )}

      {/* Add buttons */}
      <button onClick={() => setIsEmployeeModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
        Add Employee
      </button>
      <button onClick={() => setIsWarehouseModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded">
        Add Warehouse
      </button>
    </div>
  );
};

export default AdminHomepage;