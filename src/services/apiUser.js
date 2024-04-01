import supabase from './supabase';

export async function supabaseGetCurrentUser(sessionUserId) {
  if (!sessionUserId) throw new Error('No session user id');

  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', sessionUserId)
    .single();

  if (error) throw new Error(error.message);

  return user;
}

export async function supabaseGetUser(userId) {
  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return user;
}

export async function supabaseGetSavedPosts() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user.id;

  let {
    data: { savedPosts },
    error,
  } = await supabase
    .from('users')
    .select('savedPosts')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  savedPosts = savedPosts.map(async (post) => {
    const { data } = await supabase
      .from('posts')
      .select('*, author: users(*)')
      .eq('id', post)
      .single();
    return data;
  });
  const data = await Promise.all(savedPosts);

  return { data, error };
}

export async function supabaseSavePost({ posts }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const id = user.id;

  const { data, error } = await supabase
    .from('users')
    .update({ savedPosts: posts })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data.savedPosts;
}

export async function supabaseUpdateSavedPosts({ posts }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const id = user.id;

  const { data, error } = await supabase
    .from('users')
    .update({ savedPosts: posts })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data.savedPosts;
}

/* GET USERS */
export async function supabaseGetAllUsers() {
  const { data, error } = await supabase.from('users').select('*');

  if (error) throw new Error(error.message);

  return data;
}

/* GET FOLLOWED USERS */
export async function supabaseGetFollowedUsers() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user.id;

  const { data, error } = await supabase
    .from('users')
    .select('following')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function supabaseGetFollowedPosts() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user.id;

  const { data: followedUsers, error: followedUsersError } = await supabase
    .from('users')
    .select('following')
    .eq('id', userId)
    .single();

  if (followedUsersError) throw new Error(followedUsersError.message);

  console.log(followedUsers);
  return;

  // const { data: posts, error: postsError } = await supabase
  //   .from('posts')
  //   .select('*, author: users(*)')
  //   .in('author_id', ['id1', 'id2', 'id3']);

  // if (postsError) throw new Error(postsError.message);

  // return posts;
}

/* FOLLOW USER */
export async function supabaseFollowUser({ userId, followingArray }) {
  const { data, error } = await supabase
    .from('users')
    .update({ following: followingArray })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);

  return data.following;
}
