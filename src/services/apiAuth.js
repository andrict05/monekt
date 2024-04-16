import supabase from './supabase';

export async function supabaseSignupUser({
  email,
  password,
  fullName,
  username,
}) {
  const { data: user, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log(`user db`, user);

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .insert([
      {
        id: user.user.id,
        fullName,
        username,
      },
    ])
    .select();

  profileError && console.log(profileError);

  if (signupError) {
    throw new Error(signupError.message);
  }

  return user;
}

export async function supabaseLoginUser({ email, password }) {
  let {
    data: { user },
    error: loginError,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    throw new Error(loginError.message);
  }
  return user;
}

export async function supabaseGetAuthenticatedUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function supabaseLogoutUser() {
  const { error: signoutError } = await supabase.auth.signOut();

  if (signoutError) throw new Error(signoutError.message);

  return null;
}
