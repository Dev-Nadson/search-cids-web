// searchCids.tsx - VERSÃO COM PAGINAÇÃO OTIMIZADA
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { Search, X, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { connection } from '../services/api';

type Cid = {
    SUBCAT: string;
    DESCRICAO: string;
}

// ✅ Hook de debounce otimizado
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// ✅ Componente de item memoizado para evitar re-renders
const CidItem = memo(({ item }: { item: Cid }) => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 hover:shadow-xl transition-shadow border-l-4 border-indigo-500 group cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="bg-indigo-100 px-4 py-2 rounded-lg min-w-[80px] text-center">
                <span className="text-indigo-700 font-bold text-sm">
                    {item.SUBCAT}
                </span>
            </div>
            <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
                    {item.DESCRICAO}
                </h3>
            </div>
        </div>
    </div>
));

CidItem.displayName = 'CidItem';

// ✅ Skeleton otimizado (menos animações)
const LoadingSkeleton = memo(() => (
    <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-5">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-200 rounded-lg w-24 h-10 animate-pulse"></div>
                    <div className="flex-1">
                        <div className="bg-gray-200 h-6 rounded w-3/4 animate-pulse"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

function SearchCids() {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState<Cid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displayCount, setDisplayCount] = useState(50); // Mostra 50 inicialmente

    // ✅ Debounce de 300ms para não filtrar a cada tecla
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // ✅ Função de fetch memoizada
    const getCids = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await connection.get('/cids');

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
    }, []);

    useEffect(() => {
        getCids();
    }, [getCids]);

    // ✅ Filtro otimizado com normalização de strings
    const filteredItems = useMemo(() => {
        if (!debouncedSearchTerm) return items;

        const term = debouncedSearchTerm
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Remove acentos

        return items.filter(item => {
            const subcat = item.SUBCAT.toLowerCase();
            const descricao = item.DESCRICAO
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

            return subcat.includes(term) || descricao.includes(term);
        });
    }, [items, debouncedSearchTerm]);

    // ✅ Itens paginados - só mostra os primeiros X
    const displayedItems = useMemo(() => {
        return filteredItems.slice(0, displayCount);
    }, [filteredItems, displayCount]);

    // ✅ Reseta paginação quando busca muda
    useEffect(() => {
        setDisplayCount(50);
    }, [debouncedSearchTerm]);

    // ✅ Carregar mais itens
    const loadMore = useCallback(() => {
        setDisplayCount(prev => prev + 50);
    }, []);

    // ✅ Clear handler memoizado
    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);

    const hasMore = displayedItems.length < filteredItems.length;

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
                                onClick={handleClearSearch}
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
                        {debouncedSearchTerm && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                                🔍 Filtrando
                            </span>
                        )}
                    </div>
                </div>

                {/* Lista de Resultados */}
                <div className="space-y-3">
                    {displayedItems.length > 0 ? (
                        <>
                            {displayedItems.map((item) => (
                                <CidItem key={item.SUBCAT} item={item} />
                            ))}

                            {/* Botão Carregar Mais */}
                            {hasMore && (
                                <div className="flex justify-center pt-6">
                                    <button
                                        onClick={loadMore}
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        <span>Carregar mais</span>
                                        <ChevronDown size={20} />
                                        <span className="text-xs bg-indigo-500 px-2 py-1 rounded-full">
                                            +50
                                        </span>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Search size={64} className="mx-auto opacity-50" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Nenhum resultado encontrado
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Não encontramos CIDs com o termo "{debouncedSearchTerm}"
                            </p>
                            <button
                                onClick={handleClearSearch}
                                className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2 hover:underline"
                            >
                                <X size={16} />
                                Limpar pesquisa
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer com informações */}
                {displayedItems.length > 0 && (
                    <div className="mt-8 text-center text-sm text-gray-500">
                        Mostrando {displayedItems.length.toLocaleString('pt-BR')} de {filteredItems.length.toLocaleString('pt-BR')} CIDs
                        {filteredItems.length !== items.length && ` (filtrados de ${items.length.toLocaleString('pt-BR')} totais)`}
                    </div>
                )}
            </div>
        </div>
    );
}

export { SearchCids };