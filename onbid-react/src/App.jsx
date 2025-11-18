




import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookmarkProvider } from './context/BookmarkContext';
import AppLayout from './components/AppLayout';
import PropertyList from './pages/PropertyList';
import BookmarkList from './pages/BookmarkList';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Router>
      <BookmarkProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<PropertyList />} />
            <Route path="/bookmarks" element={<BookmarkList />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BookmarkProvider>
    </Router>
  );
}

export default App;
