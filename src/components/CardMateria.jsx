
import { Link } from 'react-router-dom';
const CardMateria = ({
    title,
    description,
    image,
    id,
    tags,
    topicoId,
}) => {

    return (
        <div
            className='mt-10'
        >
            <Link
                to={`/topicos/${topicoId}/materias/${id}`}
            >
                <div className="max-w-sm rounded overflow-hidden shadow-lg transition-shadow duration-300 ease-in-out transform hover:shadow-2xl">
                    <img
                        className="w-full h-48 object-contain mt-2"
                        src={image}
                        alt="Sunset in the mountains"
                    />
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 uppercase">{title}</div>
                        <p className="text-gray-700 text-lg font-bold">
                            {description}
                        </p>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tags}</span>
                    </div>
                    <div
                        className="px-6 py-4"
                    >
                        <Link
                            to={`/topicos/${topicoId}/materias/${id}`}
                            className="text-white font-bold py-2 px-4 rounded mb-4 bg-blue-500 hover:bg-blue-700"
                        >
                            Ver Materia
                        </Link>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default CardMateria;