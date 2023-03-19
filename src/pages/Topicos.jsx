import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  db,
  auth,
} from '../firebase/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import { CardMateria } from '../components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

const Topicos = () => {
  const [materias, setMaterias] = useState([]);
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const getMaterias = async () => {
      const materiasCollection = collection(db, 'topicos', id, 'materias');
      const materiasSnapshot = await getDocs(materiasCollection);
      const materiasList = materiasSnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setMaterias(materiasList);
    }

    const fetchUser = async () => {
      try {
        const q = query(collection(db, 'usuarios'), where('isAdmin', '==', true));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (doc.data().uid === user.uid) {
            setIsAdmin(true);
          }
        });
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (id) {
      getMaterias();
    }

    fetchUser();
  }, [id, user]);

  console.log(isAdmin);

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >

      <div className="flex flex-col mt-10">
        {
          isAdmin && (
            <Link
              to={`/topicos/${id}/adicionar-materia`}
              className="text-white font-bold py-2 px-4 rounded mb-4 bg-blue-500 hover:bg-blue-700"
            >
              Adicionar Materia
            </Link>
          )
        }
        {/* {
          isAdmin && (
            <Link
              to={`/topicos/${id}/quiz`}
              className="text-white font-bold py-2 px-4 rounded mb-4 bg-blue-500 hover:bg-blue-700"
            >
              Adicionar Quiz
            </Link>
          )
        } */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {materias.map(materia => {
            return (
              <CardMateria
                topicoId={id}
                id={materia.id}
                key={materia.id}
                title={materia.titulo}
                description={materia.descricao}
                image={materia.imagem}
                tags={materia.tags}
              />
            )
          })}
        </div>
      </div>
    </div >
  )
}

export default Topicos