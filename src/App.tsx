import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing/Landing';
import Forms from './pages/Forms/Forms';
import RBAC from './pages/RBAC/RBAC';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="forms" element={<Forms />} />
          <Route path="rbac" element={<RBAC />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;