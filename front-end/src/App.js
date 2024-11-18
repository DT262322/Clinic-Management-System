

//LTN
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { PrimeReactProvider } from 'primereact/api';
import axios from 'axios';

axios.defaults.baseURL = 'https://localhost:7291/api/';

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <div>
          <UserRoutes />  {/* Routes dành cho người dùng */}
          <AdminRoutes /> {/* Routes dành cho admin */}
        </div>
      </Router>
    </PrimeReactProvider>
  );

}

export default App;
