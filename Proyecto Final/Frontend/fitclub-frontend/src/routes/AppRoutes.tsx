import {
    useState
} from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import MainLayout
    from "../layouts/MainLayout";

import LoginPage
    from "../pages/LoginPage";

import DashboardPage
    from "../pages/DashboardPage";

import SociosPage
    from "../pages/SociosPage";

import PlanesPage
    from "../pages/PlanesPage";

import MembresiasPage
    from "../pages/MembresiasPage";

import InstructoresPage
    from "../pages/InstructoresPage";

import ClasesPage
    from "../pages/ClasesPage";

import HorariosPage
    from "../pages/HorariosPage";

import ReservasPage
    from "../pages/ReservasPage";

import AsistenciasPage
    from "../pages/AsistenciasPage";

import NotificacionesPage
    from "../pages/NotificacionesPage";

import ReportesPage
    from "../pages/ReportesPage";

import {
    authService
} from "../services/authService";

export default function AppRoutes() {

    const [
        autenticado,
        setAutenticado
    ] =
        useState(
            () =>
                authService
                    .haySesion()
        );

    function cerrarSesion() {

        authService
            .cerrarSesion();

        setAutenticado(
            false
        );
    }

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={
                        autenticado
                            ? (
                                <Navigate
                                    to="/"
                                    replace
                                />
                            )
                            : (
                                <LoginPage
                                    onLogin={() =>
                                        setAutenticado(
                                            true
                                        )
                                    }
                                />
                            )
                    }
                />

                <Route
                    element={
                        autenticado
                            ? (
                                <MainLayout
                                    onLogout={
                                        cerrarSesion
                                    }
                                />
                            )
                            : (
                                <Navigate
                                    to="/login"
                                    replace
                                />
                            )
                    }
                >

                    <Route
                        index
                        element={
                            <DashboardPage />
                        }
                    />

                    <Route
                        path="socios"
                        element={
                            <SociosPage />
                        }
                    />

                    <Route
                        path="planes"
                        element={
                            <PlanesPage />
                        }
                    />

                    <Route
                        path="membresias"
                        element={
                            <MembresiasPage />
                        }
                    />

                    <Route
                        path="instructores"
                        element={
                            <InstructoresPage />
                        }
                    />

                    <Route
                        path="clases"
                        element={
                            <ClasesPage />
                        }
                    />

                    <Route
                        path="horarios"
                        element={
                            <HorariosPage />
                        }
                    />

                    <Route
                        path="reservas"
                        element={
                            <ReservasPage />
                        }
                    />

                    <Route
                        path="asistencias"
                        element={
                            <AsistenciasPage />
                        }
                    />

                    <Route
                        path="notificaciones"
                        element={
                            <NotificacionesPage />
                        }
                    />

                    <Route
                        path="reportes"
                        element={
                            <ReportesPage />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <h1>
                                Página no encontrada
                            </h1>
                        }
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}