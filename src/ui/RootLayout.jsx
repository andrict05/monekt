import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import supabase from '../services/supabase';
import { setCurrentUser, setFollows, setSessionUserId } from '../userSlice';
import { useCurrentUser } from '@/lib/react-query/queries';
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
      }
      if (event === 'SIGNED_OUT') {
        navigateToAuth();
        dispatch(setSessionUserId(null));
        dispatch(setCurrentUser(null));
      }
    });
  }, [navigate, dispatch, getCurrentUser, navigateToAuth]);

  useEffect(() => {
    if (currentUser) {
      dispatch(setCurrentUser(currentUser));
      dispatch(setFollows(currentUser.following || []));
    }
  }, [currentUser, dispatch]);

  return <Outlet />;
}

export default RootLayout;
