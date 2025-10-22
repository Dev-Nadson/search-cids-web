// searchCids.tsx
import { useEffect, useState, useMemo } from 'react';
import { Search, X, AlertCircle, RefreshCw } from 'lucide-react';
import { connection } from '../services/api';

type Cid = {
    SUBCAT: string;
    DESCRICAO: string;
}

function SearchCids() {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState<Cid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function getCids() {
        try {
            setLoading(true);
            setError(null);
            const response = await connection.get('/cids');

            // Espera array direto do backend
            if (Array.isArray(response.data)) {
                setItems(response.data);
                console.log('✅ CIDs carregados:', response.data.length);
            } else {
                throw new Error('Formato de resposta inválido');
            }
        } catch (error: any) {
            console.error('❌ Erro ao buscar CIDs:', error);
            setError(
                error.code === 'ERR_NETWORK'
                    ? 'Não foi possível conectar ao servidor. Verifique se a API está rodando em http://localhost:3333'
                    : error.response?.data?.message || 'Erro ao carregar dados. Tente novamente.'
            );
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCids();
    }, []);

    // Busca otimizada com useMemo
    const filteredItems = useMemo(() => {
        if (!searchTerm) return items;

        const term = searchTerm.toLowerCase().trim();
        return items.filter(item =>
            item.SUBCAT.toLowerCase().includes(term) ||
            item.DESCRICAO.toLowerCase().includes(term)
        );
    }, [items, searchTerm]);

    // Skeleton de carregamento
    const LoadingSkeleton = () => (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-5 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-200 rounded-lg w-24 h-10"></div>
                        <div className="flex-1">
                            <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Pesquisar CIDs</h1>
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-center gap-3 text-indigo-600">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="text-lg font-medium">Carregando CIDs...</p>
                        </div>
                    </div>
                    <LoadingSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Pesquisar CIDs</h1>
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center">
                            <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Erro ao carregar dados
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {error}
                            </p>
                            <button
                                onClick={getCids}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                            >
                                <RefreshCw size={20} />
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                        Pesquisar CIDs
                    </h1>
                    <p className="text-gray-600">
                        Base de dados CID-10 com {items.length.toLocaleString('pt-BR')} códigos
                    </p>
                </div>

                {/* Barra de Pesquisa */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sticky top-4 z-10">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Digite o código (ex: A00) ou nome da doença..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-800 placeholder:text-gray-400"
                            autoFocus
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
                                aria-label="Limpar pesquisa"
                                title="Limpar pesquisa"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-indigo-600">
                                {filteredItems.length.toLocaleString('pt-BR')}
                            </span>
                            {' '}{filteredItems.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                        </p>
                        {searchTerm && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                                🔍 Filtrando
                            </span>
                        )}
                    </div>
                </div>

                {/* Lista de Resultados */}
                <div className="space-y-3">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div
                                key={`${item.SUBCAT}-${index}`}
                                className="bg-white rounded-lg shadow-md p-4 sm:p-5 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-indigo-500 group cursor-pointer"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                    <div className="bg-indigo-100 px-4 py-2 rounded-lg group-hover:bg-indigo-600 transition-colors min-w-[80px] text-center">
                                        <span className="text-indigo-700 group-hover:text-white font-bold text-sm transition-colors">
                                            {item.SUBCAT}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {item.DESCRICAO}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Search size={64} className="mx-auto opacity-50" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Nenhum resultado encontrado
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Não encontramos CIDs com o termo "{searchTerm}"
                            </p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2 hover:underline"
                            >
                                <X size={16} />
                                Limpar pesquisa
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer com informações */}
                {filteredItems.length > 0 && (
                    <div className="mt-8 text-center text-sm text-gray-500">
                        Mostrando {filteredItems.length} de {items.length} CIDs disponíveis
                    </div>
                )}
            </div>
        </div>
    );
}

export { SearchCids };