import { useGetPostById, useUpdatePost } from '@/lib/react-query/queries';
import Loader from '@/ui/Loader';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  height: 3rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: #1f2937;
  color: #dee4eb;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #d1d5db;
  font-size: 1rem;
`;

function UpdatePost() {
  const { id } = useParams();
  const { handleSubmit, register } = useForm();
  const user = useSelector((state) => state.user.currentUser);
  const { data, error, isPending } = useGetPostById(id);
  const { updatePost, isPending: isUpdating } = useUpdatePost();

  if (isPending) return <Loader />;

  if (!!error || user.id !== data.author_id) return <Navigate to='/' />;

  async function handleNewPost({ tags, body, image: submittedImage }) {
    const image = submittedImage.length > 0 ? submittedImage[0] : undefined;
    updatePost({ tags, body, image, postId: id });
    toast.success('Your post has been edited successfully!');
  }

  return (
    <div className='w-full'>
      <h1 className='mb-12 text-2xl font-bold'>Edit your post</h1>
      <form
        className='space-y-4  [&_div_label]:mb-2 [&_div_label]:block'
        onSubmit={handleSubmit(handleNewPost)}>
        <div>
          <Label htmlFor='body'>Body</Label>
          <textarea
            id='body'
            defaultValue={data.body}
            {...register('body', { required: true })}
            className='w-full resize-none rounded-md bg-slate-800 p-3 text-slate-50'
            rows={8}
          />
        </div>
        <div>
          <Label htmlFor='tags'>Tags (separated with comma)</Label>
          <Input
            type='text'
            id='tags'
            {...register('tags')}
            className='text-black'
            defaultValue={data.tags}
          />
        </div>
        <div>
          <Label htmlFor='image'>Image</Label>
          <input type='file' id='image' {...register('image')} />
        </div>
        <button
          type='submit'
          disabled={isPending || isUpdating}
          className='rounded-sm bg-blue-600 px-4 py-1 text-white'>
          Post
        </button>
      </form>
    </div>
  );
}

export default UpdatePost;
