// searchCids.tsx
import { useState } from 'react';
import { Search, X } from 'lucide-react';

function SearchCids() {
    const [searchTerm, setSearchTerm] = useState('');

    const items = [
        //    { code: 'A00', name: 'Cólera' },

    ];

    const filteredItems = items.filter(item =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Pesquisar CIDs</h1>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Pesquisar por código ou nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-gray-800"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {filteredItems.length} {filteredItems.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </p>
                </div>

                <div className="space-y-3">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div
                                key={item.code}
                                className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] border-l-4 border-indigo-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                                        <span className="text-indigo-700 font-bold text-sm">
                                            {item.code}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Search size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Nenhum resultado encontrado
                            </h3>
                            <p className="text-gray-500">
                                Tente pesquisar com outros termos
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export { SearchCids }