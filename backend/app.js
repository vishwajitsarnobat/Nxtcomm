const express = require('express');
const cors = require('cors');
const userHomeRoutes = require('./routes/userHome');
const employeeHomeRoutes = require('./routes/employeeHome');
const adminHomeRoutes = require('./routes/adminHome');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user-home', userHomeRoutes);
app.use('/api/employee-home', employeeHomeRoutes);
app.use('/api/admin-home', adminHomeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
