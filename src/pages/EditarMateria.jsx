import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from '../firebase/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

const EditarMateria = () => {

  const { topicoId, materiaId } = useParams();
  const [materia, setMateria] = useState({
    titulo: '',
    descricao: '',
    imagem: '',
    tags: '',
    code: '',
  });

  const navigate = useNavigate();

  const editarMateria = async (e) => {
    e.preventDefault();

    if (materia.titulo.trim() === '') {
      return toast.error('O título da matéria é obrigatório');
    }
    if (materia.descricao.trim() === '') {
      return toast.error('A descrição da matéria é obrigatória');
    }
    if (materia.tags.length === 0) {
      return toast.error('A matéria deve ter pelo menos uma tag');
    }
    if (materia.imagem === '') {
      return toast.error('A matéria deve ter uma imagem');
    }
    if (materia.code.length === 0) {
      return toast.error('A matéria deve ter pelo menos um código');
    }

    try {
      let imagemUrl = materia.imagem;
      const storageRef = ref(storage, `materias/${materia.imagem.name}`);
      const uploadTask = uploadBytesResumable(storageRef, materia.imagem);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            imagemUrl = downloadURL;
          });
        }
      );

      await updateDoc(doc(db, "topicos", topicoId, "materias", materiaId), {
        titulo: materia.titulo,
        descricao: materia.descricao,
        imagem: imagemUrl,
        tags: materia.tags,
        code: materia.code,
      });

      toast.success('Matéria editada com sucesso');
      navigate(`/topicos/${topicoId}`);

    } catch (error) {
      toast.error('Erro ao editar matéria');
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

  if (!materiaId) {
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
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Editar Matéria
              </h3>
            </div>
            <div className="mt-5">
              <form onSubmit={editarMateria}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div
                      className="col-span-6 sm:col-span-3"
                    >
                      {
                        materia.imagem && (
                          <img
                            src={materia.imagem}
                            alt="Imagem da matéria"
                            className="object-contain h-48 w-full"
                          />
                        )
                      }
                    </div>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="titulo" className="block text-lg font-medium text-gray-700">
                          Título
                        </label>
                        <input
                          type="text"
                          name="titulo"
                          id="titulo"
                          value={materia.titulo}
                          onChange={(e) => setMateria({ ...materia, titulo: e.target.value })}
                          autoComplete="given-name"
                          className="mt-1 p-2 border-2 block w-full shadow-sm sm:text-lg border-gray-700 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="descricao" className="block text-lg font-medium text-gray-700">
                          Descrição
                        </label>
                        <ReactQuill
                          className=""
                          value={materia.descricao}
                          onChange={(value) => setMateria({ ...materia, descricao: value })}
                        ></ReactQuill>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="tags" className="block text-lg font-medium text-gray-700">
                          Tags
                        </label>
                        <input
                          type="text"
                          name="tags"
                          id="tags"
                          value={materia.tags}
                          onChange={(e) => setMateria({ ...materia, tags: e.target.value })}
                          autoComplete="family-name"
                          className="mt-1 p-2 w-full border-2 shadow-sm sm:text-lg border-gray-700 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="code" className="block text-lg font-medium text-gray-700">
                          Código
                        </label>
                        <textarea
                          name="code"
                          id="code"
                          rows={10}
                          value={materia.code}
                          onChange={(e) => setMateria({ ...materia, code: e.target.value })}
                          autoComplete="family-name"
                          className="mt-1 p-2 border-gray-700 border-2 block w-full shadow-sm sm:text-lg rounded-md"
                        >
                          {materia.code}
                        </textarea>
                      </div>
                      <button
                        type="submit"
                        className="border-2 border-gray-700 bg-gray-700 text-white px-4 py-2 rounded-md text-lg font-medium hover:bg-gray-500"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarMateria;