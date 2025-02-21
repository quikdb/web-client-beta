'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@quikdb/design-system/components/ui/button';
import { Input, FormDivider, PasswordInput, FormHeader } from '@quikdb/design-system/components/onboarding';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAuthState } from '@/app/store';

const OneTime = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const router = useRouter();

  const buttonStyle = 'w-full border-[1px] bg-transparent border-[#1F1F1F] h-[50px] text-base rounded-2xl px-6 text-white hover:text-blacko';
  const buttonTextPrefix = 'Sign Up';

  const handleOneTimeLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/send-otp-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, OTPType: 'link' }),
      });

      const result = await response.json();
      const link = result.data.link;
      const path = new URL(link).pathname;

      if (response.ok && result.status === 'success') {
        setSuccess(true);
        toast.success(`One-time link sent successfully`);
        // router.push(path);
      } else {
        setError(result.error || 'Failed to sign up. Please try again.');
        toast.warning(result.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error('Error during sign-up:', err);
      setError('An error occurred during sign-up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center w-full'>
      <div className='flex flex-col w-full max-w-screen-2xl'>
        <FormHeader title='Authenticate with One Time Link' description='Enter your email to authenticate with one-time link' showLogo />
        <main className='flex flex-col items-center justify-center w-full'>
          <div className='flex flex-col w-full md:w-[680px] items-center'>
            <form onSubmit={handleOneTimeLink} className='flex flex-col gap-y-4 items-center w-full'>
              <Input type='email' placeholder='Email Address' required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type='submit' className={buttonStyle} disabled={loading}>
                {loading ? 'Authenticating...' : 'Authenticate with One Time Link'}
              </Button>
            </form>
            {error && <p className='text-red-500'>{error}</p>}
            {success && <p className='text-green-500'>Authentication successful! Please check your email for OTP.</p>}
            <FormDivider />

            <section className='flex flex-col items-center gap-y-6'>
              <p className='text-sm font-light text-[#B3B4B3] text-center'>
                By clicking continue, you agree to our{' '}
                <Link href='/terms' className='underline'>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href='/privacy' className='underline'>
                  Privacy Policy
                </Link>
              </p>
              <p className='text-lg font-light text-[#B3B4B3]'>
                Already have an account?{' '}
                <Link href='/sign-in' className='text-gradient font-medium hover:text-white'>
                  Log in
                </Link>
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OneTime;
