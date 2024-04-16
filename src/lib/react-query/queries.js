import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  supabaseGetUser,
  supabaseGetCurrentUser,
  supabaseGetSavedPosts,
  supabaseUpdateSavedPosts,
  supabaseSavePost,
  supabaseGetAllUsers,
  supabaseGetFollowedPosts,
  supabaseFollowUser,
  supabaseUpdateProfileSettings,
} from '@/services/apiUser';
import {
  supabaseCreatePost,
  supabaseDeletePost,
  supabaseGetPostById,
  supabaseGetPosts,
  supabaseGetRecentPosts,
  supabaseSearchPosts,
  supabaseUpdateLikes,
  supabaseUpdatePost,
} from '@/services/apiPosts';
import {
  supabaseGetAuthenticatedUser,
  supabaseLoginUser,
  supabaseLogoutUser,
  supabaseSignupUser,
} from '@/services/apiAuth';
import supabase from '@/services/supabase';

/* USERS */

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ['profile-settings'],
    mutationFn: supabaseUpdateProfileSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['current-user']);

      toast.success('Profile settings updated successfully');
    },
  });
  return { updateProfileSettings: mutate, isPending, error };
}

export function useCurrentUser() {
  const sessionUserId = useSelector((state) => state.user.sessionUserId);

  const { mutate, data, error, isPending } = useMutation({
    mutationKey: ['current-user'],
    mutationFn: async () => await supabaseGetCurrentUser(sessionUserId),
  });

  return { getCurrentUser: mutate, currentUser: data, error, isPending };
}

export function useUserEmail() {
  const { data, isPending } = useQuery({
    queryKey: ['currentUser-email'],
    queryFn: async () => {
      const {
        data: {
          user: { email },
        },
      } = await supabase.auth.getUser();
      return email;
    },
  });
  return { email: data, emailLoading: isPending };
}

export function useGetProfile(id) {
  const {
    data: profile,
    isPending,
    error,
  } = useQuery({
    queryKey: ['profile' + id],
    queryFn: () => supabaseGetUser(id),
    retry: 1,
  });

  return { profile, isPending, error };
}

export function useUserPosts(userId) {
  const {
    data,
    isPending: isPostsPending,
    error,
  } = useQuery({
    queryKey: ['posts- ' + userId],
    queryFn: () => supabaseGetPosts(userId),
    retry: 1,
  });

  return { data, isPostsPending, error };
}

export function useAuthenticatedUser() {
  const {
    data: authenticatedUser,
    isPending,
    error: authenticatedUserError,
  } = useQuery({
    queryKey: ['authenticated-user'],
    queryFn: supabaseGetAuthenticatedUser,
  });

  return {
    authenticatedUser,
    authenticatedUserError,
    isPending,
    isAuthenticated: authenticatedUser?.role === 'authenticated',
  };
}

export function useLogin() {
  const {
    mutate: login,
    error: loginError,
    data,
    isPending: isLoggingIn,
  } = useMutation({
    mutationFn: ({ email, password }) => supabaseLoginUser({ email, password }),
    mutationKey: ['authenticated-user'],
  });

  return { login, data, loginError, isLoggingIn };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logout,
    error,
    isPending: isLoggingOut,
  } = useMutation({
    mutationFn: supabaseLogoutUser,
    mutationKey: ['authenticated-user'],
    onSettled: () => {
      toast.error('You have been logged out.');
      queryClient.setQueryData(['authenticated-user'], null);
      navigate('/signin');
    },
  });

  return {
    logout,
    error,
    isLoggingOut,
  };
}

export function useSignup() {
  const {
    mutate: signup,
    error: signupError,
    isPending: isSigningUp,
  } = useMutation({
    mutationFn: ({ email, password, fullName, username }) =>
      supabaseSignupUser({ email, password, fullName, username }),
    mutationKey: ['authenticated-user'],
  });

  return { signup, signupError, isSigningUp };
}

/* POSTS */
export function useCreatePost() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: createPost,
    error,
    isPending,
  } = useMutation({
    mutationKey: ['new-post'],
    mutationFn: supabaseCreatePost,
    onSettled: () => {
      queryClient.invalidateQueries('posts');
      navigate('/');
    },
  });

  return { createPost, isPending, error };
}
export function useUpdatePost() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: updatePost,
    error,
    isPending,
  } = useMutation({
    mutationKey: ['edit-post'],
    mutationFn: supabaseUpdatePost,
    onSettled: () => {
      queryClient.invalidateQueries();
      navigate('/');
    },
  });

  return { updatePost, isPending, error };
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending } = useMutation({
    mutationKey: ['deleted-post'],
    mutationFn: supabaseDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      toast.success('Your post has been deleted!');
    },
  });

  return { deletePost, isDeleting: isPending };
}

export function usePosts() {
  const {
    data,
    isPending: isPostsPending,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => supabaseGetPosts(),
    retry: 1,
  });

  return { data, isPostsPending, error };
}

export function useSavedPosts() {
  const { data, isPending, error } = useQuery({
    queryKey: ['saved-posts'],
    queryFn: supabaseGetSavedPosts,
    retry: 1,
  });

  return { data, isPending, error };
}

export function useSavePost() {
  const queryClient = useQueryClient();
  const {
    mutate: savePost,
    data,
    error,
    isPending,
  } = useMutation({
    mutationKey: ['user-saved-post'],
    mutationFn: ({ posts }) => {
      return supabaseSavePost({ posts });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current-user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['saved-posts'],
      });
    },
  });

  return { savePost, data, error, isPending };
}
export function useUpdateSavedPost() {
  const queryClient = useQueryClient();

  const {
    mutate: updateSavedPost,
    data,
    error,
    isPending,
  } = useMutation({
    mutationKey: ['user-saved-post'],
    mutationFn: ({ posts }) => {
      return supabaseUpdateSavedPosts({ posts });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current-user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['saved-posts'],
      });
    },
  });

  return { updateSavedPost, data, error, isPending };
}

/* FETCH 20 RECENT POSTS */
export function useGetRecentPosts() {
  const { data, isPending, error } = useQuery({
    queryKey: ['getRecentPosts'],
    queryFn: supabaseGetRecentPosts,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isPending, error };
}

/* SEARCH POSTS */
export function useSearchPosts(searchQuery) {
  const { data, isPending } = useQuery({
    queryKey: ['search-posts', searchQuery],
    queryFn: () => supabaseSearchPosts(searchQuery),
  });

  return { data, isPending };
}

/* LIKE POST */
export function useUpdateLikes(postId) {
  const {
    mutate: updateLikes,
    isPending,
    data,
    error,
  } = useMutation({
    mutationKey: ['post-likes', postId],
    mutationFn: supabaseUpdateLikes,
  });

  return {
    updateLikes,
    isPending,
    data,
    error,
  };
}

/* GET ALL USERS */
export function useGetAllUsers() {
  const { data, isPending, error } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => supabaseGetAllUsers(),
  });

  return { data, isPending, error };
}

/*  FOLLOWED USERS POSTS */
export function useFollowedPosts() {
  const { data, isPending, error } = useQuery({
    queryKey: ['followed-posts'],
    queryFn: () => supabaseGetFollowedPosts(),
    staleTime: 1000 * 60 * 5,
  });

  return { data, isPending, error };
}

/* FOLLOW */
export function useFollowUser() {
  const queryClient = useQueryClient();

  const {
    mutate: followUser,
    data,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['following'],
    mutationFn: ({ userId, followingArray }) => {
      supabaseFollowUser({ userId, followingArray });
      queryClient.invalidateQueries(['followed-posts']);
    },
  });

  return { followUser, data, isPending, error };
}

export function useGetPostById(editId) {
  const { data, isPending, error } = useQuery({
    queryKey: ['edit-post'],
    queryFn: () => supabaseGetPostById(editId),
    retry: 1,
  });

  return { data, isPending, error };
}
