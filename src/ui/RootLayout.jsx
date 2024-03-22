import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import supabase from '../services/supabase';
import { setCurrentUser, setSessionUserId } from '../userSlice';
import { useCurrentUser } from '../features/user/useCurrentUser';
import FullPage from './FullPage';
import Loader from './Loader';

function RootLayout() {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getCurrentUser, currentUser, isPending } = useCurrentUser();
  const { pathname } = useLocation();

  const navigateToAuth = useCallback(
    function () {
      navigate(pathname.startsWith('/signup') ? '/signup' : '/signin');
    },
    [navigate, pathname]
  );

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setLoaded(() => true);
      if (data.session) {
        navigate('/');
      }
      if (!data.session) {
        navigateToAuth();
      }
    }
    checkSession();
  }, [navigate, pathname, navigateToAuth]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' && session) {
        dispatch(setSessionUserId(session.user.id));
        getCurrentUser(null, {});
        navigate('/');
      }
      if (event === 'SIGNED_OUT') {
        dispatch(setSessionUserId(null));
        dispatch(setCurrentUser(null));
        navigateToAuth();
      }
    });
  }, [navigate, dispatch, getCurrentUser, navigateToAuth]);

  useEffect(() => {
    if (currentUser) {
      dispatch(setCurrentUser(currentUser));
    }
  }, [currentUser, dispatch]);

  const isReady = loaded && !isPending;

  return (
    <section className='flex h-screen flex-1 flex-col items-center justify-center bg-slate-950 py-10'>
      {isReady ? (
        <Outlet />
      ) : (
        <FullPage>
          <Loader />
        </FullPage>
      )}
    </section>
  );
}

export default RootLayout;
