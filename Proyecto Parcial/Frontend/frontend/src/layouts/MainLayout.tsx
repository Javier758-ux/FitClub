import { Outlet } from 'react-router';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

function MainLayout() {
    return (
        <div className="app-shell">
            <Sidebar />
            <div className="app-content">
                <Header />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;