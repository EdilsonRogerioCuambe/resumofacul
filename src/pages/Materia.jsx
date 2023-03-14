import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, getDocs, doc, collection, addDoc, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Materia = () => {

  const [materia, setMateria] = useState();

  const { id } = useParams();

  useEffect(() => {
    const getMateria = async () => {
      const materiaDoc = collection(db, 'materias');
      const materiaSnapshot = await getDocs(materiaDoc);
      const materiaList = materiaSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      const materia = materiaList.find((materia) => materia.id === id);
      console.log(materia);
      setMateria(materia);
    }
    if (id) {
      getMateria();
    }
  }, [id]);

  if (!id) {
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                
              </h3>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Materia;

