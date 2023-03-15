import React, { useState, useEffect } from 'react';
import { Card } from '../components';
import { getDocs, collection } from 'firebase/firestore';
import {
  db,
} from '../firebase/firebase';

const Home = () => {

  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDisciplinas = async () => {
      const disciplinasCollection = collection(db, 'disciplinas');
      const disciplinasSnapshot = await getDocs(disciplinasCollection);
      const disciplinasList = disciplinasSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setDisciplinas(disciplinasList);
      setLoading(false);
    };
    getDisciplinas();
  }, []);

  if (loading) {
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
      className='flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-wrap'
    >
      {
        disciplinas.map((disciplina) => (
          <Card
            key={disciplina.id}
            title={disciplina.nome}
            description={disciplina.descricao}
            image={disciplina.imagem}
            id={disciplina.id}
            tags={disciplina.tags}
          />
        ))
      }
    </div>
  )
}

export default Home;