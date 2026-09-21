import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // --- DUMMYJSON REGISTER LOGIC ---
      if (!isLogin) {
        const registerResponse = await fetch('https://dummyjson.com/users/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
            email: form.email,
            firstName: form.username, 
            lastName: 'User'
          }),
        });

        if (!registerResponse.ok) {
          throw new Error('Registration failed');
        }

        setIsLogin(true);
        // warning message to user to use default passwrod.
        setMessage('Mock registration successful! Please login using DummyJSON default credentials (e.g., emilys / emilyspass).');
        return;
      }

      // --- DUMMYJSON LOGIN LOGIC (With JWT Token) ---
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          expiresInMins: 60,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      
      // Send DummyJSON token into accesstoken key
      if (!data.accessToken) {
        throw new Error('Login token was not received');
      }

      // Store token and user data in Redux 
      dispatch(setCredentials({ 
        token: data.accessToken, // JWT token
        user: { 
          username: data.username,
          email: data.email,
          image: data.image 
        } 
      }));

      navigate(location.state?.from || '/checkout', { replace: true });
      
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-indigo-600">ShopX DummyJSON Auth</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>

        {message && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        <div className="mt-6 space-y-4">
          {!isLogin && (
            <input required name="email" type="email" placeholder="Email address" value={form.email} onChange={updateField} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          )}
          <input required name="username" placeholder="Username" value={form.username} onChange={updateField} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          <input required name="password" type="password" placeholder="Password" value={form.password} onChange={updateField} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
        </div>

        <button disabled={isLoading} type="submit" className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
          {isLoading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>

        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="mt-4 w-full text-sm text-indigo-600 hover:text-indigo-700">
          {isLogin ? 'Need an account? Register' : 'Already registered? Login'}
        </button>
      </form>
    </main>
  );
}
