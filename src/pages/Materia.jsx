import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { toast } from 'react-toastify';

const Materia = () => {

  const [materia, setMateria] = useState(null);

  const { topicoId, materiaId } = useParams();
  const navigate = useNavigate();

  const deletarMateria = async () => {
    try {
      await deleteDoc(doc(db, "topicos", topicoId, "materias", materiaId));
      toast.success('Materia deletada com sucesso');
      navigate(`/topicos/${topicoId}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    const getMateria = async () => {
      const materiaDoc = await getDoc(doc(db, "topicos", topicoId, "materias", materiaId));
      setMateria(materiaDoc.data());
    }

    if (topicoId && materiaId) {
      getMateria();
    }
  }, [topicoId, materiaId]);

  console.log(materia);

  if (!materia) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div div className="flex flex-col mt-10" >
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 bg-white rounded-lg shadow px-5 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Carregando...
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div
        className="flex flex-col mt-10"
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div
              className="flex items-center justify-between"
            >
              <Link
                to={`/topicos/${topicoId}/materias/${materiaId}/editar`}
                className="text-white font-bold py-2 px-4 rounded mb-4 bg-blue-500 hover:bg-blue-700"
              >
                Editar Materia
              </Link>
            </div>
            <div
              className="flex items-center justify-between"
            >
              <button
                onClick={deletarMateria}
                className="text-white font-bold py-2 px-4 rounded mb-4 bg-red-500 hover:bg-red-700"
              >
                Deletar Materia
              </button>
            </div>
            <div
              className="flex items-center justify-between"
            >
              <img
                className="w-full object-contain rounded-lg h-80"
                src={materia.imagem}
                alt={materia.titulo}
              />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 uppercase">
                {materia.titulo}
              </h3>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {materia.descricao}
              </p>
            </div>
            <code
              className="text-sm text-gray-500"
            >
              {materia.code}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Materia;

