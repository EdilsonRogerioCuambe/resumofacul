import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db, storage } from '../firebase/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';



const AddMateria = () => {

    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [materia, setMateria] = useState({
        titulo: '',
        descricao: '',
        imagem: '',
        tags: '',
        code: '',
    });
    const [progress, setProgress] = useState(0);
    const { id } = useParams();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMateria({ ...materia, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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

        const storageRef = ref(storage, `materias/${materia.imagem.name}`);
        const uploadTask = uploadBytesResumable(storageRef, materia.imagem);
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
                    addDoc(collection(db, "topicos", id, "materias"), {
                        titulo: materia.titulo,
                        descricao: materia.descricao,
                        imagem: downloadURL,
                        tags: materia.tags,
                        code: materia.code,
                        userId: user.uid,
                    })
                        .then((docRef) => {
                            toast.success('Matéria adicionada com sucesso');
                            navigate('/');
                        })
                        .catch((error) => {
                            toast.error(error.message);
                        });
                });
            }
        );
    };

    if (progress > 0 && progress < 100) {
        return toast.info(`Carregando imagem: ${progress}%`);
    }

    const handleTagsChange = (event) => {
        const { name, value } = event.target;
        setMateria({ ...materia, [name]: value.split(',') });
    };

    const handleCodeChange = (event) => {
        const { name, value } = event.target;
        setMateria({ ...materia, [name]: value.split(',') });
    };

    const handleImageChange = (event) => {
        const { name, files } = event.target;
        setMateria({ ...materia, [name]: files[0] });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col mt-10">
                <h1 className="text-3xl font-bold mb-4">Adicionar Matéria</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="title"
                        >
                            Título
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="title"
                            type="text"
                            placeholder="Digite o título da matéria"
                            value={materia.titulo}
                            onChange={handleInputChange}
                            name='titulo'
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="description"
                        >
                            Descrição
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            rows="5"
                            placeholder="Digite a descrição da matéria"
                            value={materia.descricao}
                            onChange={handleInputChange}
                            name='descricao'
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="tags"
                        >
                            Tags
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="tags"
                            type="text"
                            placeholder="Digite as tags da matéria (separadas por vírgulas)"
                            value={materia.tags}
                            onChange={handleTagsChange}
                            name='tags'
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="image"
                        >
                            Imagem (opcional)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                            name='imagem'
                        />
                        {materia.imagem && (
                            <div className="mt-4">
                                <img
                                    className="w-1/2"
                                    src={URL.createObjectURL(materia.imagem)}
                                    alt={materia.titulo}
                                />
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="code"
                        >
                            Código (opcional)
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="code"
                            rows="5"
                            placeholder="Digite o código da matéria"
                            value={materia.code}
                            onChange={handleCodeChange}
                            name='code'
                        ></textarea>

                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Adicionar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMateria;