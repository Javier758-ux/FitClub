import {
    NavLink,
    Outlet
} from "react-router-dom";

import {
    useAuth
} from "../auth/AuthContext";

import {
    MENU_ITEMS,
    tienePermiso
} from "../auth/permissions";

import {
    Button
} from "../components/ui/Button";

import "./MainLayout.css";

export default function MainLayout() {

    const {
        usuario,
        cerrarSesion
    } = useAuth();

    if (!usuario) {
        return null;
    }

    const menuVisible =
        MENU_ITEMS.filter(
            (item) =>
                tienePermiso(
                    usuario.rol,
                    item.roles
                )
        );

    return (
        <div className="layout">

            <aside className="sidebar">

                <h2>
                    FitClub
                </h2>

                <div className="sidebar-user">

                    <strong>
                        {usuario.nombre}
                    </strong>

                    <span>
                        {usuario.rol}
                    </span>

                </div>

                <nav>

                    {menuVisible.map(
                        (item) => (

                            <NavLink
                                key={
                                    item.path
                                }
                                to={
                                    item.path
                                }
                                end={
                                    item.path ===
                                    "/"
                                }
                                className={({
                                                isActive
                                            }) =>
                                    isActive
                                        ? "menu-link active"
                                        : "menu-link"
                                }
                            >
                                {
                                    item.label
                                }
                            </NavLink>

                        )
                    )}

                </nav>

            </aside>

            <div className="main-area">

                <header className="topbar">

                    <div>

                        <h3>
                            Sistema de Gestión FitClub
                        </h3>

                        <span className="topbar-session">
                            {usuario.email}
                        </span>

                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={
                            cerrarSesion
                        }
                    >
                        Cerrar sesión
                    </Button>

                </header>

                <main className="content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}