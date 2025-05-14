import { Routes, Route } from 'react-router-dom';
import Hjem from '../pages/Hjem';
import Statistikk from '../pages/Statistikk';
import Trening from '../pages/Trening';
import Innstillinger from '../pages/Innstillinger';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Hjem />} />
    <Route path="/statistikk" element={<Statistikk />} />
    <Route path="/trening" element={<Trening />} />
    <Route path="/innstillinger" element={<Innstillinger />} />
  </Routes>
);

export default AppRoutes;
