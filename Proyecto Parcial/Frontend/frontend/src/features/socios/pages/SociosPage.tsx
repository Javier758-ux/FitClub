import { useState, useEffect } from 'react';
import { useSocios } from '../hooks/useSocios';
import SocioTable from '../components/SocioTable';
import SocioForm from '../components/SocioForm';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Pagination } from '../../../components/ui/Pagination';
import { EmptyState } from '../../../components/ui/EmptyState';

const PAGE_SIZE = 5;

function SociosPage() {
    const { data: socios, loading, error, reload } = useSocios();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filteredSocios = socios.filter((socio) => {
        const term = search.trim().toLowerCase();
        return (
            !term ||
            socio.nombre.toLowerCase().includes(term) ||
            socio.email.toLowerCase().includes(term)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredSocios.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const visibleSocios = filteredSocios.slice(start, start + PAGE_SIZE);

    useEffect(() => {
        setPage(1);
    }, [search]);

    return (
        <div>
            <h1>Socios</h1>
            <SocioForm onSocioCreado={reload} />
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o email..." />
            {loading && <p>Cargando socios...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && filteredSocios.length === 0 && (
                <EmptyState title="No se encontraron socios" description="Prueba con otro término de búsqueda." />
            )}
            {!loading && !error && filteredSocios.length > 0 && (
                <>
                    <SocioTable socios={visibleSocios} />
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}

export default SociosPage;