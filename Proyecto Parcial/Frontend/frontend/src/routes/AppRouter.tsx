import { Routes, Route } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import AcercaPage from '../pages/AcercaPage';
import NotFoundPage from '../pages/NotFoundPage';
import SociosPage from '../features/socios/pages/SociosPage';
import MembresiasPage from '../features/membresias/pages/MembresiasPage';

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/socios" element={<SociosPage />} />
                <Route path="/membresias" element={<MembresiasPage />} />
                <Route path="/acerca" element={<AcercaPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;