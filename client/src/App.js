import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/dash/DashLayout';
import Welcome from './features/auth/Welcome';
import NotesList from './features/notes/NotesList';
import UsersList from './features/users/UsersList';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Everything else goes here */}
                {/* Public Routes */}
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />

                {/* Private Routes */}
                <Route path="dash" element={<DashLayout />}>
                    <Route index element={<Welcome />} />

                    <Route path="notes">
                        <Route index element={<NotesList />} />
                    </Route>

                    <Route path="users">
                        <Route index element={<UsersList />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
