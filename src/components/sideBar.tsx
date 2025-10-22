// sideBar.tsx
import { Syringe, ClipboardPlus } from 'lucide-react';

interface SidebarProps {
    activeItem: string;
    setActiveItem: (item: string) => void;
}

function Sidebar({ activeItem, setActiveItem }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'CIDs', icon: Syringe },
        { id: 'procedimentos', label: 'Procedimentos', icon: ClipboardPlus },
    ];

    return (
        <div className="w-64 bg-indigo-600 text-white flex-col h-screen">
            <div className="p-4 flex items-center justify-between border-b border-indigo-500">
                <div className="flex items-center gap-2 pl-4">
                    <span className="font-bold text-2xl">CID-10</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveItem(item.id)}
                            className={`w-56 flex items-center gap-3 px-4 py-3 rounded-lg ${isActive
                                ? 'bg-white text-indigo-600 shadow-lg'
                                : 'hover:bg-indigo-700 text-white'
                                }`}
                            title={item.label}
                        >
                            <Icon size={20} />
                            <span className="font-medium flex-1 text-left">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

export { Sidebar }