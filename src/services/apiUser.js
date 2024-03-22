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
