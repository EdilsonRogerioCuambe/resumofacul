import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoc, getDocs, doc, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';

const Disciplina = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const { id } = useParams();
    const [disciplina, setDisciplina] = useState(null);

    const [topico, setTopico] = useState('');
    const [topicos, setTopicos] = useState([]);

    const handleAddTopico = async (e) => {
        e.preventDefault();

        if (!topico) {
            toast.error('Digite um tópico');
            return;
        }

        await addDoc(collection(db, 'disciplinas', id, 'topicos'), {
            nome: topico,
        });

        toast.success('Tópico adicionado com sucesso');

        setTopico('');
        navigate(`/disciplinas/${id}`);
    };

    const deleteTopico = async (idTopico) => {
        await deleteDoc(doc(db, 'disciplinas', id, 'topicos', idTopico));
        toast.success('Tópico excluído com sucesso');
        navigate(`/disciplinas/${id}`);
    };

    const deteleDisciplina = async () => {
        await deleteDoc(doc(db, 'disciplinas', id));
        toast.success('Disciplina excluída com sucesso');
        navigate('/');
    };

    useEffect(() => {
        const getDisciplina = async () => {
            const disciplinaDoc = await getDoc(doc(db, "disciplinas", id));
            setDisciplina(disciplinaDoc.data());
        };
        const getTopicos = async () => {
            const topicosCollection = collection(db, 'disciplinas', id, 'topicos');
            const topicosSnapshot = await getDocs(topicosCollection);
            const topicosList = topicosSnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            setTopicos(topicosList);
        };

        getDisciplina();
        getTopicos();
    }, [id]);

    console.log(user.isAdmin);

    if (!disciplina) {
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
            <div div className="flex flex-col mt-10" >
                <div>
                    <button></button>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">{disciplina.nome}</h1>
                        <p className="text-gray-700 text-lg">{disciplina.descricao}</p>
                    </div>
                    <div className="flex-1">
                        <img
                            className="w-full h-48 object-contain mt-2"
                            src={disciplina.imagem}
                            alt="Sunset in the mountains"
                        />
                    </div>
                </div>
                {
                    user.isAdmin &&
                    (
                        <>
                            <div
                                className="flex-1 max-w-5xl mt-10"
                            >
                                <form
                                    className="flex flex-col"
                                    onSubmit={handleAddTopico}
                                >
                                    <label
                                        htmlFor="topico"
                                        className="text-lg font-bold"
                                    >Adicionar tópico</label>
                                    <input
                                        type="text"
                                        id="topico"
                                        name="topico"
                                        value={topico}
                                        className='border border-gray-300 rounded-md p-2'
                                        onChange={(e) => setTopico(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="border border-gray-300 rounded-md p-2 mt-2 hover:bg-gray-200"
                                    >Adicionar</button>
                                </form>
                            </div>
                        </>
                    )
                }
                <div
                    className="flex-1 max-w-5xl mt-10"
                >
                    <h2 className="text-2xl font-bold">Tópicos</h2>
                    <ul
                        className="flex flex-col"
                    >
                        {topicos.map((topico) => (
                            <li
                                className="mt-2"
                                key={topico.id}
                                id={topico.id}
                            >
                                <div
                                    className="flex flex-row justify-between"
                                >
                                    <Link
                                        className='border border-gray-300 rounded-md p-2 mb-3 hover:bg-gray-200'
                                        to={`/topicos/${topico.id}`}>
                                        {topico.nome}
                                    </Link>
                                    {
                                        user.isAdmin &&
                                        <button
                                            className="text-white font-bold py-2 px-4 rounded mb-2 bg-red-500 hover:bg-red-700"
                                            onClick={() => deleteTopico(topico.id)}
                                        >
                                            Excluir
                                        </button>
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {
                    user.isAdmin &&
                    (
                        <>
                            <div
                                className="flex flex-row justify-between"
                            >
                                <Link
                                    to={`/disciplinas/${id}/editar`}
                                    className="text-white font-bold py-2 px-4 rounded mb-2 bg-blue-500 hover:bg-blue-700"
                                >
                                    Editar {disciplina.nome}
                                </Link>
                            </div>
                            <div
                                className="flex flex-row justify-between mt-2"
                            >
                                <button
                                    className="text-white font-bold px-4 py-2 rounded mb-4 bg-red-500 hover:bg-red-700"
                                    onClick={deteleDisciplina}
                                >
                                    Excluir {disciplina.nome}
                                </button>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Disciplina;