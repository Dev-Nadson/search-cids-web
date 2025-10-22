import { useState } from 'react';
import { Sidebar } from './components/sideBar';
import { SearchCids } from './components/searchCids';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 overflow-y-auto">
        {activeItem === 'dashboard' && <SearchCids />}
        {activeItem === 'procedimentos' && <div className="p-8">Implementação futura👍</div>}
      </div>
    </div>
  );
}

export default App;