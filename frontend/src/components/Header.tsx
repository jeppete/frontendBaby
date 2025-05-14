interface HeaderProps {
  title: string;
  iconSrc: string;
}

const Header = ({ title, iconSrc }: HeaderProps) => {
  return (
    <header className="flex items-center justify-left px-4 py-2 border-b border-gray-200 bg-white shadow-sm">
      <img src={iconSrc} alt="App icon" className="h-8 w-8 rounded-full" />
      <h1 className="text-xl font-semibold ml-3">{title}</h1>

    </header>
  );
};

export default Header;
