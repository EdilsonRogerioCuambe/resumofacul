import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  auth,
  db,
  storage,
} from '../firebase/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection } from "firebase/firestore";
import { toast } from 'react-toastify';



const Disciplina = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [disciplina, setDisciplina] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    tags: '',
  });

  const [progress, setProgress] = useState(0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDisciplina({ ...disciplina, [name]: value });
  };

  const handleTagsChange = (event) => {
    const { name, value } = event.target;
    setDisciplina({ ...disciplina, [name]: value.split(',') });
  };

  const handleImageChange = (event) => {
    const { name, files } = event.target;
    setDisciplina({ ...disciplina, [name]: files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disciplina.nome.trim() === '') {
      return toast.error('O nome da disciplina é obrigatório');
    }
    if (disciplina.descricao.trim() === '') {
      return toast.error('A descrição da disciplina é obrigatória');
    }
    if (disciplina.tags.length === 0) {
      return toast.error('A disciplina deve ter pelo menos uma tag');
    }
    if (disciplina.imagem === '') {
      return toast.error('A disciplina deve ter uma imagem');
    }
    const storageRef = ref(storage, `disciplinas/${disciplina.imagem.name}`);
    const uploadTask = uploadBytesResumable(storageRef, disciplina.imagem);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const disciplinaData = {
            nome: disciplina.nome,
            descricao: disciplina.descricao,
            imagem: downloadURL,
            tags: disciplina.tags,
            criadoPor: user.uid,
            criadoEm: new Date(),
          };
          addDoc(collection(db, 'disciplinas'), disciplinaData)
            .then(() => {
              toast.success('Disciplina criada com sucesso!');
              navigate('/');
            })
            .catch((error) => {
              toast.error(error.message);
            });
        });
      }
    );
  };

  return (
    <div
      className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-center items-center'
    >
      <div className='mt-10'>
        <div className='max-w-sm rounded overflow-hidden shadow-lg transition-shadow duration-300 ease-in-out transform hover:shadow-2xl'>
          <form
            onSubmit={handleSubmit}
            className=''
            >
            <div className='px-6 py-4'>
              <div className='font-bold text-xl mb-2'>Nova Disciplina</div>
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='nome'
                >
                  Nome
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='nome'
                  type='text'
                  name='nome'
                  value={disciplina.nome}
                  onChange={handleInputChange}
                  placeholder='Nome da disciplina'
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='descricao'
                >
                  Descrição
                </label>
                <textarea
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
                  id='descricao'
                  type='text'
                  name='descricao'
                  value={disciplina.descricao}
                  onChange={handleInputChange}
                  placeholder='Descrição da disciplina'
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='imagem'
                >
                  Imagem
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='imagem'
                  type='file'
                  name='imagem'
                  onChange={handleImageChange}
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='tags'
                >
                  Tags
                </label>
                <select
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='tags'
                  type='text'
                  name='tags'
                  value={disciplina.tags}
                  onChange={handleTagsChange}
                >
                  <option value=''>Selecione uma tag</option>
                  <option value='ciencia'>Ciência</option>
                  <option value='tecnologia'>Tecnologia</option>
                  <option value='engenharia'>Engenharia</option>
                  <option value='matematica'>Matemática</option>
                </select>
              </div>
            </div>
            <div
              className='w-full bg-gray-200'
            >
              <progress value={progress} max='100' />
            </div>
            <div className='px-6 py-4'>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                type='submit'
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Disciplina;