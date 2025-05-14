import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

const App = () => (
  <Router>
    <div className="flex flex-col h-screen">
      <Header title="August's søvndagbok 💤" iconSrc="/logo.png" />
      <div className="flex-1 overflow-auto">
        <AppRoutes />
      </div>
      <BottomNav />
    </div>
  </Router>
);

export default App;

