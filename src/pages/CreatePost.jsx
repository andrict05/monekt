import { useCreatePost } from '@/lib/react-query/queries';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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

function CreatePost() {
  const { handleSubmit, register, reset } = useForm();
  const { createPost, isPending } = useCreatePost();

  async function handleNewPost({ tags, body, image: submittedImage }) {
    const image = submittedImage.length > 0 ? submittedImage[0] : undefined;
    createPost({ tags, body, image });
    toast.success('Your post has been created successfully!');
    reset();
  }

  return (
    <div className='w-full'>
      <h1 className='mb-12 text-2xl font-bold'>Create a new post</h1>
      <form
        className='space-y-4  [&_div_label]:mb-2 [&_div_label]:block'
        onSubmit={handleSubmit(handleNewPost)}>
        <div>
          <Label htmlFor='body'>Body</Label>
          <textarea
            id='body'
            placeholder='What are you thinking about?'
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
            placeholder='e.g. react, javascript'
          />
        </div>
        <div>
          <Label htmlFor='image'>Image</Label>
          <input type='file' id='image' {...register('image')} />
        </div>
        <button
          type='submit'
          disabled={isPending}
          className='rounded-sm bg-blue-600 px-4 py-1 text-white'>
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
