import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useCurrentUser } from '@/lib/react-query/queries';
import supabase from '@/services/supabase';
import { setCurrentUser, setFollows, setSessionUserId } from '@/userSlice';
import { useQueryClient } from '@tanstack/react-query';
import { supabaseGetFollowedPosts } from '@/services/apiUser';

function RootLayout() {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getCurrentUser, currentUser } = useCurrentUser();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const navigateToAuth = useCallback(
    function () {
      const allowedPaths = ['/signin', '/signup', '/forgot', '/recovery'];
      navigate(allowedPaths.includes(pathname) ? pathname : '/signin');
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
        getCurrentUser(null, {
          onSuccess: () => {
            queryClient.prefetchQuery({
              queryKey: ['followed-posts'],
              queryFn: () => supabaseGetFollowedPosts(),
            });
          },
        });
      }
      if (event === 'SIGNED_OUT') {
        navigateToAuth();
        dispatch(setSessionUserId(null));
        dispatch(setCurrentUser(null));
      }
    });
  }, [navigate, dispatch, getCurrentUser, navigateToAuth, queryClient]);

  useEffect(() => {
    if (currentUser) {
      dispatch(setCurrentUser(currentUser));
      dispatch(setFollows(currentUser.following || []));
    }
  }, [currentUser, dispatch]);

  return <Outlet />;
}

export default RootLayout;
