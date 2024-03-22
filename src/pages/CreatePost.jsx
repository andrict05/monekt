import { useForm } from 'react-hook-form';
import { useCreatePost } from '../features/post/useCreatePost';
import toast from 'react-hot-toast';

function CreatePost() {
  const { handleSubmit, register, reset } = useForm();
  const { createPost, isPending } = useCreatePost();

  async function handleNewPost({ title, body, image: submittedImage }) {
    const image = submittedImage.length > 0 ? submittedImage[0] : undefined;
    createPost({ title, body, image });
    toast.success('Your post has been created successfully!');
    reset();
  }

  return (
    <div className='w-full'>
      <h1 className='mb-12 text-3xl'>Create a new post</h1>
      <form
        className='space-y-4  [&_div_label]:mb-2 [&_div_label]:block'
        onSubmit={handleSubmit(handleNewPost)}>
        <div>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            id='title'
            {...register('title')}
            className='text-black'
          />
        </div>
        <div>
          <label htmlFor='body'>Body</label>
          <textarea
            id='body'
            {...register('body', { required: true })}
            className='text-black'
          />
        </div>
        <div>
          <label htmlFor='image'>Image</label>
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
