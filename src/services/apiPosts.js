import toast from 'react-hot-toast';
import supabase from './supabase';

export async function supabaseCreatePost({ image, title, body }) {
  const {
    data: {
      user: { id: authorid },
    },
  } = await supabase.auth.getUser();
  console.log(authorid);

  const { data: post, error } = await supabase
    .from('posts')
    .insert([{ title, body, author_id: authorid }])
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

export async function supabaseGetPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, author: users(*)');

  if (error) throw new Error(error.message);

  return posts;
}

export async function supabaseDeletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
