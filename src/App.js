import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, NotFound, Login, Materia, Topicos, Registro, AddMateria, Perfil, AddDisciplina, Disciplina } from './pages';
import { ToastContainer } from 'react-toastify';
import { Header } from './components';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro/*" element={<Registro />} />
        <Route path="/perfil/*" element={<Perfil />} />
        <Route path="/add_disciplina/" element={<AddDisciplina />} />
        <Route path="/disciplinas/:id" element={<Disciplina />} />
        <Route path="/materia/:id/" element={<Materia />} />
        <Route path="/topicos/:id/adicionar-materia" element={<AddMateria />} />
        <Route path="/topicos/:id/" element={<Topicos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
