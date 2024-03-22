import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './global.css';
import Home from './pages/Home';
import SignInForm from './features/auth/SignInForm';
import SignUpForm from './features/auth/SignUpForm';
import AuthLayout from './ui/AuthLayout';
import AppLayout from './ui/AppLayout';
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CreatePost from './pages/CreatePost';
import RootLayout from './ui/RootLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // staleTime: 0,
    },
  },
});

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    // TODO: Add error boundary
    errorElement: (
      <main className='flex h-screen items-center justify-center'>
        <h1>Unexpected error occured.</h1>
      </main>
    ),
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            path: '/',
            element: <Home />,
          },
          {
            path: '/explore',
            element: <div>Explore</div>,
          },
          {
            path: '/people',
            element: <div>People</div>,
          },
          {
            path: '/saved',
            element: <div>Saved</div>,
          },
          {
            path: '/create-post',
            element: <CreatePost />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            index: true,
            path: '/signin',
            element: <SignInForm />,
          },
          {
            path: '/signup',
            element: <SignUpForm />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <main className='flex h-screen items-center justify-center'>
        <h1>Page not found.</h1>
      </main>
    ),
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* TODO: customize toaster */}
      <Toaster
        position='top-center'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#1f2937',
            border: '1px solid #020617',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
