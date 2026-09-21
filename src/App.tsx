import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorialPage from './pages/EditorialPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/why-us" element={<EditorialPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;