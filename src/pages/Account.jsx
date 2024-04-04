function Account() {
  return (
    <div className='w-full'>
      <h1 className='mb-6 text-2xl font-bold'>Account</h1>
      <div className='grid-1-col grid'>
        <div className='m-2 flex items-start'>
          <label htmlFor='' className='mr-4 text-xl'>
            Profile picture
          </label>
          <div className='flex h-32 w-32 items-center justify-center rounded-md bg-slate-900'>
            <img src='/assets/logo.png' alt='' className=' inline-block h-24' />
          </div>
          <input type='file' />
        </div>
        <div className='m-2 '>
          <label htmlFor='email' className='mr-4 text-xl'>
            Email address
          </label>
          <input
            type='email'
            disabled
            value={'tomislav@monekt.com'}
            id='email'
            className='text-md rounded-md bg-slate-800 p-2 text-slate-50 disabled:text-slate-200 disabled:hover:cursor-not-allowed'
          />
        </div>
        <div className='m-2 '>
          <label htmlFor='username' className='mr-4 text-xl'>
            Username
          </label>
          <input
            type='text'
            disabled
            id='username'
            value={'@tomoo'}
            className='text-md rounded-md bg-slate-800 p-2 text-slate-50 disabled:text-slate-200 disabled:hover:cursor-not-allowed'
          />
        </div>
        <div className='m-2 w-fit rounded-md bg-slate-900 p-2'>
          <div className='m-2 flex justify-between'>
            <label htmlFor='password' className='mr-4 text-xl'>
              Password
            </label>
            <input
              type='text'
              disabled
              id='password'
              value={''}
              className='text-md rounded-md bg-slate-800 p-2 text-slate-50 disabled:text-slate-200 disabled:hover:cursor-not-allowed'
            />
          </div>
          <div className='m-2 flex justify-between'>
            <label htmlFor='confirmPassword' className='mr-4 text-xl'>
              Confirm Password
            </label>
            <input
              type='text'
              disabled
              id='confirmPassword'
              value={''}
              className='text-md rounded-md bg-slate-800 p-2 text-slate-50 disabled:text-slate-200 disabled:hover:cursor-not-allowed'
            />
          </div>
          <button className='text-md rounded-md bg-blue-600 p-2 font-bold text-white'>
            Update password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
