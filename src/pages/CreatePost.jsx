import { useCreatePost } from '@/lib/react-query/queries';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
    <div className='mx-auto w-2/5'>
      <h1 className='my-8 text-2xl font-bold'>Create a new post</h1>

      <form className='space-y-6' onSubmit={handleSubmit(handleNewPost)}>
        <div>
          {/* <Label htmlFor='body'>Body</Label> */}
          <textarea
            {...register('body', { required: true })}
            id='body'
            rows={8}
            className='textarea textarea-primary textarea-lg w-full resize-none text-slate-100'
            placeholder='What will your post be about?'></textarea>
        </div>
        <div>
          {/* <Label htmlFor='tags'>Tags (separated with comma)</Label> */}
          <input
            {...register('tags')}
            id='tags'
            type='text'
            placeholder='Optional tags for your post, e.g. react, javascript'
            className='input input-lg input-bordered input-primary w-full text-slate-100'
          />
        </div>
        <div>
          <input
            {...register('image')}
            id='image'
            type='file'
            accept='image/*'
            className='file-input file-input-bordered file-input-primary w-full max-w-sm'
          />
        </div>
        <button
          type='submit'
          disabled={isPending}
          className='btn btn-primary btn-lg w-full'>
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
