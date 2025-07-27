import { Routes, Route } from 'react-router-dom'; // import only these
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout'; 
import Home from './pages/Home';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
