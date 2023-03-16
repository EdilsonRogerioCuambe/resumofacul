import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { toast } from 'react-toastify';

const EditarDisciplina = () => {
  const { id } = useParams();
  const [disciplina, setDisciplina] = useState({
    nome: '',
    descricao: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setDisciplina({
      ...disciplina,
      [e.target.name]: e.target.value,
    });
  };

  const editarDisciplina = async (e) => {
    e.preventDefault();

    if (disciplina.nome.trim() === '') {
      return toast.error('O nome da disciplina é obrigatório');
    }
    if (disciplina.descricao.trim() === '') {
      return toast.error('A descrição da disciplina é obrigatória');
    }

    try {
      await updateDoc(doc(db, 'disciplinas', id), {
        nome: disciplina.nome,
        descricao: disciplina.descricao,
      });
      toast.success('Disciplina editada com sucesso');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getDisciplina = async () => {
      try {
        const docRef = doc(db, 'disciplinas', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDisciplina({
            ...docSnap.data(),
          });
        } else {
          toast.error('Disciplina não encontrada');
          navigate('/');
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    getDisciplina();
  }, [id, navigate]);

  return (
    <div
      className="flex justify-center items-center h-screen"
    >
      <div className="w-1/2">
        <form
          onSubmit={editarDisciplina}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="nome"
            >
              Nome
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nome"
              type="text"
              placeholder="Nome da disciplina"
              name="nome"
              value={disciplina.nome}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="descricao"
            >
              Descrição
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="descricao"
              placeholder="Descrição da disciplina"
              name="descricao"
              value={disciplina.descricao}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Editar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarDisciplina;