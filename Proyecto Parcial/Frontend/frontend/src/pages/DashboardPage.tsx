import { useSocios } from '../features/socios/hooks/useSocios';
import { useMembresias } from '../features/membresias/hooks/useMembresias';

function DashboardPage() {
    const socios = useSocios();
    const membresias = useMembresias();

    const loading = socios.loading || membresias.loading;
    const error = socios.error || membresias.error;

    const metrics = {
        totalSocios: socios.data.length,
        totalMembresias: membresias.data.length,
        membresiasMensuales: membresias.data.filter((m) => m.tipo === 'MENSUAL').length,
        precioPromedio: membresias.data.length
            ? membresias.data.reduce((suma, m) => suma + m.precio, 0) / membresias.data.length
            : 0,
    };

    if (loading) return <p>Cargando dashboard...</p>;
    if (error) return <p role="alert">{error}</p>;

    return (
        <div>
            <h1>Inicio</h1>
            <p>Bienvenido al panel de administración de FitClub.</p>
            <div className="metrics-grid">
                <article className="metric-card">
                    <span>Socios totales</span>
                    <strong>{metrics.totalSocios}</strong>
                </article>
                <article className="metric-card">
                    <span>Membresías totales</span>
                    <strong>{metrics.totalMembresias}</strong>
                </article>
                <article className="metric-card">
                    <span>Membresías mensuales</span>
                    <strong>{metrics.membresiasMensuales}</strong>
                </article>
                <article className="metric-card">
                    <span>Precio promedio</span>
                    <strong>{metrics.precioPromedio.toFixed(2)}</strong>
                </article>
            </div>
        </div>
    );
}

export default DashboardPage;