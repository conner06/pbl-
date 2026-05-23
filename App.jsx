import { createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useMembers } from './hooks/useMembers';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';

export const MembersContext = createContext(null);

function App() {
  const membersState = useMembers();

  return (
    <MembersContext.Provider value={membersState}>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/lions/:id" element={<DetailPage />} />
      </Routes>
    </MembersContext.Provider>
  );
}

export default App;
