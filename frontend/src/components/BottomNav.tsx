import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Dumbbell, Settings } from 'lucide-react';

const navItems = [
  { name: 'Hjem', icon: Home, path: '/' },
  { name: 'Statistikk', icon: BarChart2, path: '/statistikk' },
  { name: 'Trening', icon: Dumbbell, path: '/trening' },
  { name: 'Innstillinger', icon: Settings, path: '/innstillinger' },
];

const BottomNav = () => (
  <nav className="flex justify-around border-t border-gray-300 bg-white p-2">
    {navItems.map(({ name, icon: Icon, path }) => (
      <NavLink
        key={path}
        to={path}
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? 'text-blue-500' : 'text-gray-500'}`
        }
      >
        <Icon className="h-6 w-6" />
        {name}
      </NavLink>
    ))}
  </nav>
);

export default BottomNav;
