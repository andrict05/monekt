import toast from 'react-hot-toast';
import supabase from './supabase';

export async function supabaseCreatePost({ image, tags, body }) {
  const {
    data: {
      user: { id: authorid },
    },
  } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from('posts')
    .insert([{ tags, body, author_id: authorid }])
    .select()
    .single();
  if (error) throw new Error(error.message);

  // Upload image if there is one
  if (!image) return post;

  const extension = image.name.split('.').at(-1);
  const filename = `${post.id}.${extension}`;

  const { data: postImage, error: imageUploadError } = await supabase.storage
    .from('post-images')
    .upload(filename, image);

  if (imageUploadError) throw new Error(imageUploadError.message);

  // Fetch the uploaded image public URL
  const {
    data: { publicUrl },
  } = await supabase.storage.from('post-images').getPublicUrl(filename);

  // Update post with uploaded image URL
  const { data: updatedPost, error: updatedPostError } = await supabase
    .from('posts')
    .update({ image: publicUrl })
    .eq('id', post.id)
    .select('*');

  if (updatedPostError) throw new Error(updatedPostError.message);

  return updatedPost;
}

export async function supabaseUpdatePost({ image, tags, body, postId }) {
  const { data: post, error } = await supabase
    .from('posts')
    .update({ tags, body })
    .eq('id', postId)
    .select()
    .single();
  if (error) throw new Error(error.message);

  // Upload image if there is one
  if (!image) return post;

  const extension = image.name.split('.').at(-1);
  const filename = `${post.id}.${extension}`;

  const { error: imageUploadError } = await supabase.storage
    .from('post-images')
    .upload(filename, image, {
      upsert: true,
    });

  if (imageUploadError) throw new Error(imageUploadError.message);

  // Fetch the uploaded image public URL
  const {
    data: { publicUrl },
  } = await supabase.storage.from('post-images').getPublicUrl(filename);

  // Update post with uploaded image URL
  const { data: updatedPost, error: updatedPostError } = await supabase
    .from('posts')
    .update({ image: publicUrl })
    .eq('id', post.id)
    .select('*');

  if (updatedPostError) throw new Error(updatedPostError.message);

  return updatedPost;
}

export async function supabaseGetPosts(userId = '') {
  let query = supabase.from('posts');
  query = query.select('*, author: users(*)');
  if (userId !== '') query = query.eq('author_id', userId);
  query = query.order('created_at', { ascending: false });

  const { data: posts, error } = await query;

  if (error) throw new Error(error.message);

  return posts;
}

export async function supabaseDeletePost(post) {
  const { id, image } = post;
  // TODO: If there is an image, delete it from storage
  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) throw new Error(error.message);

  if (!image || image === '') return;

  const imageExtension = image.slice(image.indexOf(id) + id.length);
  const bucketImageName = `${id}${imageExtension}`;

  const { error: imageDeleteError } = await supabase.storage
    .from('post-images')
    .remove([bucketImageName]);

  if (imageDeleteError) throw new Error(imageDeleteError.message);
}

/* RECENT POSTS */
export async function supabaseGetRecentPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, author: users(*)')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);

  return data || [];
}

/* SEARCH POSTS */
export async function supabaseSearchPosts(query) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, author: users(*)')
    .textSearch('body', query);

  if (error) throw new Error(error.message);
  return data || [];
}

/* LIKE POST */
export async function supabaseUpdateLikes({ postId, likesArray }) {
  const { data, error } = await supabase
    .from('posts')
    .update({ likes: likesArray })
    .eq('id', postId)
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function supabaseGetPostById(editId) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*, author: users(*)')
    .eq('id', editId)
    .single();

  if (error) throw new Error(error.message);

  return post;
}
