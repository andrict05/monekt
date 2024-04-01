import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import supabase from '../services/supabase';
import { useDispatch } from 'react-redux';
import { setCurrentUser, setFollows, setSessionUserId } from '../userSlice';
import { useCurrentUser } from '@/lib/react-query/queries';
import FullPage from './FullPage';
import Loader from './Loader';

function AuthLayout() {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getCurrentUser } = useCurrentUser();
  const { pathname } = useLocation();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setLoaded(() => true);
      if (data.session) {
        navigate('/');
      }
    }
    checkSession();
  }, [navigate, pathname]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        dispatch(setSessionUserId(session.user.id));
        getCurrentUser(null, {});
      }
      if (event === 'SIGNED_OUT') {
        dispatch(setSessionUserId(null));
        dispatch(setCurrentUser(null));
        dispatch(setFollows([]));
      }
    });
  }, [navigate, dispatch, getCurrentUser]);

  return loaded ? (
    <section className='flex h-screen flex-1 flex-col items-center justify-center bg-slate-950 py-10'>
      <Outlet />
    </section>
  ) : (
    <FullPage>
      <Loader />
    </FullPage>
  );
}

export default AuthLayout;
