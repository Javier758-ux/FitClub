import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import {
    useAuth
} from "../auth/AuthContext";

import ProtectedRoute
    from "../auth/ProtectedRoute";

import {
    PERMISOS_RUTA
} from "../auth/permissions";

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

import ForbiddenPage
    from "../pages/ForbiddenPage";

function LoginRoute() {

    const {
        usuario,
        cargandoSesion
    } = useAuth();

    if (cargandoSesion) {

        return (
            <main
                style={{
                    padding: 32
                }}
            >
                Verificando sesión...
            </main>
        );
    }

    if (usuario) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <LoginPage />;
}

export default function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={
                        <LoginRoute />
                    }
                />

                <Route
                    element={
                        <ProtectedRoute />
                    }
                >

                    <Route
                        element={
                            <MainLayout />
                        }
                    >

                        <Route
                            index
                            element={
                                <DashboardPage />
                            }
                        />

                        <Route
                            path="sin-permiso"
                            element={
                                <ForbiddenPage />
                            }
                        />

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.socios
                                    }
                                />
                            }
                        >
                            <Route
                                path="socios"
                                element={
                                    <SociosPage />
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.planes
                                    }
                                />
                            }
                        >
                            <Route
                                path="planes"
                                element={
                                    <PlanesPage />
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.membresias
                                    }
                                />
                            }
                        >
                            <Route
                                path="membresias"
                                element={
                                    <MembresiasPage />
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.instructores
                                    }
                                />
                            }
                        >
                            <Route
                                path="instructores"
                                element={
                                    <InstructoresPage />
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.clases
                                    }
                                />
                            }
                        >
                            <Route
                                path="clases"
                                element={
                                    <ClasesPage />
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.horarios
                                    }
                                />
                            }
                        >
                            <Route
                                path="horarios"
                                element={
                                    <HorariosPage />
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.reservas
                                    }
                                />
                            }
                        >
                            <Route
                                path="reservas"
                                element={
                                    <ReservasPage />
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.asistencias
                                    }
                                />
                            }
                        >
                            <Route
                                path="asistencias"
                                element={
                                    <AsistenciasPage />
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.notificaciones
                                    }
                                />
                            }
                        >
                            <Route
                                path="notificaciones"
                                element={
                                    <NotificacionesPage />
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    roles={
                                        PERMISOS_RUTA.reportes
                                    }
                                />
                            }
                        >
                            <Route
                                path="reportes"
                                element={
                                    <ReportesPage />
                                }
                            />
                        </Route>

                        <Route
                            path="*"
                            element={
                                <h1>
                                    Página no encontrada
                                </h1>
                            }
                        />

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}