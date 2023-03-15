import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {
  Header,
  Card,
  CardMateria,
} from './components';

import {
  Home,
  NotFound,
  Login,
  Materia,
  Topicos,
  Registro,
  AddMateria,
  AddDisciplina,
  Disciplina,
  EditarMateria,
} from './pages';

describe("Home", () => {
  test("exibe mensagem de carregamento", () => {
    const { getByText } = render(<Home />);
    const mensagem = getByText('Carregando...');
    expect(mensagem).toBeInTheDocument();
  })
});

describe("NotFound", () => {
  test("exibe mensagem de erro", () => {
    const { getByText } = render(<NotFound />);
    const mensagem = getByText('NotFound');
    expect(mensagem).toBeInTheDocument();
  })
});

describe("Materia", () => {
  test("exibe Editar Materia", () => {
    const { getByText } = render(<Materia />);
    const mensagem = getByText('Editar Materia');
    expect(mensagem).toBeInTheDocument();
  })
});