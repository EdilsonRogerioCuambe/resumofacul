import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  Home,
  NotFound,
  Login,
  Materia,
  Topicos,
  EditarDisciplina,
  AddMateria,
  Perfil,
  AddDisciplina,
  Disciplina,
  EditarMateria,
} from './pages';
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
        <Route path="/disciplinas/:id/editar" element={<EditarDisciplina />} />
        <Route path="/perfil/*" element={<Perfil />} />
        <Route path="/add_disciplina/" element={<AddDisciplina />} />
        <Route path="/disciplinas/:id" element={<Disciplina />} />
        <Route path="/topicos/:topicoId/materias/:materiaId/" element={<Materia />} />
        <Route path="/topicos/:topicoId/materias/:materiaId/editar" element={<EditarMateria />} />
        <Route path="/topicos/:id/adicionar-materia" element={<AddMateria />} />
        <Route path="/topicos/:id/" element={<Topicos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
