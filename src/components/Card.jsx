import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({
  title,
  description,
  image,
  id,
  tags,
}) => {
  return (
    <div
      className='mt-10'
    >
      <Link to={`/disciplinas/${id}`}>
        <div className="max-w-md rounded overflow-hidden shadow-lg transition-shadow duration-300 ease-in-out transform hover:shadow-2xl">
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
        </div>
      </Link>
    </div>
  )
}

export default Card;