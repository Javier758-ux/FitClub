import { NavLink, Outlet } from "react-router-dom";
import "./MainLayout.css";

const menuItems = [
    { path: "/", label: "Dashboard" },
    { path: "/socios", label: "Socios" },
    { path: "/planes", label: "Planes" },
    { path: "/membresias", label: "Membresías" },
    { path: "/instructores", label: "Instructores" },
    { path: "/clases", label: "Clases" },
    { path: "/horarios", label: "Horarios" },
    { path: "/reservas", label: "Reservas" },
    { path: "/asistencias", label: "Asistencias" },
    { path: "/notificaciones", label: "Notificaciones" },
    { path: "/reportes", label: "Reportes" }
];

interface Props {
    onLogout: () => void;
}

export default function MainLayout({ onLogout }: Props) {
    return (
        <div className="layout">
            <aside className="sidebar">
                <h2>FitClub</h2>

                <nav>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            className={({ isActive }) =>
                                isActive
                                    ? "menu-link active"
                                    : "menu-link"
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className="main-area">
                <header className="topbar" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h3>Sistema de Gestión FitClub</h3>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onLogout}
                    >
                        Cerrar sesión
                    </button>
                </header>

                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
