import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import About from './pages/About';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import Join from './pages/Join';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/join" element={<Join />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;