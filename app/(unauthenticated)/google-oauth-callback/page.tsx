'use client';
import { useDispatch } from 'react-redux';
import { setAuthState } from '@/app/store';
import { useGoogleAuth } from '@/hooks/fetchGoogleAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const GoogleCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [code, setCode] = useState<string | null>(null);

  const { data, isError, isLoading } = useGoogleAuth(code || '');

  useEffect(() => {
    // Extract code parameter from window.location
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');

    if (codeParam) {
      setCode(codeParam);
    }

    if (data) {
      const userEmail = data.data.email;
      const accessToken = data.data.accessToken;

      if (userEmail && accessToken) {
        dispatch(setAuthState({ token: accessToken, userEmail }));
      }
      router.push('/overview');
    }
  }, [data, router, dispatch]);

  if (!code) {
    return <main className='min-h-screen px-20 py-7'>No code found in URL</main>;
  }

  if (isLoading) {
    return <main className='min-h-screen px-20 py-7'>Loading...</main>;
  }

  if (isError) {
    return <main className='min-h-screen px-20 py-7'>An error occurred. Please try again.</main>;
  }

  return (
    <main className='min-h-screen px-20 py-7'>
      <div>{JSON.stringify(data, null, 2)}</div>
    </main>
  );
};

export default GoogleCallback;
