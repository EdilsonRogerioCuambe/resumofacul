import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthState} from 'react-firebase-hooks/auth';
import { 
  auth,
  loginWithEmailAndPassword,
  signInWithGoogle,
} from '../firebase/firebase';

const Login = () => {

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="mt-10">
      <h3 className="text-center text-3xl font-bold text-gray-700">Login</h3>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
          >
            {
              error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )
            }
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <input
              className="bg-blue-500 hover:bg-blue-700 w-full p-2 text-white uppercase font-bold cursor-pointer"
              type="submit"
              value="Iniciar"
              disabled={loading}
              onClick={e => {
                e.preventDefault();
                setLoading(true);
                loginWithEmailAndPassword(email, password)
                  .catch(error => {
                    setError(error.message);
                    setLoading(false);
                  });
              }}
            />
            <input
              className="bg-red-500 hover:bg-red-700 w-full p-2 text-white uppercase font-bold mt-2 cursor-pointer"
              type="submit"
              value="Iniciar com Google"
              disabled={loading}
              onClick={e => {
                e.preventDefault();
                setLoading(true);
                signInWithGoogle()
                  .catch(error => {
                    setError(error.message);
                    setLoading(false);
                  });
              }}
            />
          </form>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="/registro"
          >
            Ainda não tem uma conta? Registre-se
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login