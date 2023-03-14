import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoc, getDocs, doc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { toast } from 'react-toastify';

const Disciplina = () => {
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

    if (!disciplina) {
        return (
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                <div div className="flex flex-col mt-10" >
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">Carregando...</h1>
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
                <div className="flex flex-col md:flex-row">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">{disciplina.nome}</h1>
                        <p className="text-gray-500">{disciplina.descricao}</p>
                    </div>
                    <div className="flex-1">
                        <img
                            className="w-full h-48 object-contain mt-2"
                            src={disciplina.imagem}
                            alt="Sunset in the mountains"
                        />
                    </div>
                </div>
                <div
                    className="flex-1 max-w-5xl mt-10"
                >
                    <form
                        className="flex flex-col"
                        onSubmit={handleAddTopico}
                    >
                        <label htmlFor="topico">Adicionar tópico</label>
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
                <div
                    className="flex-1 max-w-5xl mt-10"
                >
                    <h2 className="text-2xl font-bold">Tópicos</h2>
                    <ul
                        className="flex flex-col"
                    >
                        {topicos.map((topico) => (
                            <li
                                className="mt-5"
                                key={topico.id}
                            >
                                <Link
                                    className='border-2 border-gray-300 rounded-md mt-10 p-2 hover:bg-gray-200'
                                    to={`/topicos/${topico.id}`}>
                                    {topico.nome}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Disciplina;