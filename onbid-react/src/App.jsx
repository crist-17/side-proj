import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PropertyList from './pages/PropertyList';
import './App.css'

function App() {
  // 개발 중에는 항상 인증된 것처럼 설정
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/" element={<Navigate to="/properties" />} />
      </Routes>
    </Router>
  );
}

export default App;
