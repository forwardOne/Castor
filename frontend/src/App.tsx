// frontend/src/App.tsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import DashboardLayout from './app/dashboard/layout'; 
import ChatArea from './components/ChatArea'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout><ChatArea /></DashboardLayout>} />
    </Routes>
  );
}

export default App;
