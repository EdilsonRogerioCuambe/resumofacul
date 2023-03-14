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
        className='flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-wrap'
      >
        <div className='flex flex-col mt-10'>
          <div className='flex flex-col md:flex-row'>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold'>Carregando...</h1>
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