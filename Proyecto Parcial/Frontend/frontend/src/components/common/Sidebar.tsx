import { NavLink } from 'react-router';

function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <NavLink to="/" end>
                    Inicio
                </NavLink>
                <NavLink to="/socios">
                    Socios
                </NavLink>
                <NavLink to="/membresias">
                    Membresías
                </NavLink>
                <NavLink to="/acerca">
                    Acerca
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;