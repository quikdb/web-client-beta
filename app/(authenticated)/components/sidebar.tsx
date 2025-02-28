'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@quikdb/design-system/components/ui/button';
import {
  DashboardIcon,
  FileTextIcon,
  GearIcon,
} from '@radix-ui/react-icons';
import { LogOutIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { clearAuthState } from '@/app/store';


interface GlobalSidebarProps {
  children?: ReactNode;
  // token?: string;
}

const GlobalSidebar: React.FC<GlobalSidebarProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSignout = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/sign-out', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        dispatch(clearAuthState()); // Clear token and user email from Redux store and cookies
        setSuccess(true);
        setError('');
        toast.success('Signed out successfully');
        router.push('/sign-in');
      } else {
        setError(result.error || 'Failed to sign out.');
        toast.warning(result.message || 'Failed to sign out.');
      }
    } catch (err: any) {
      console.error('Error during sign-out:', err);
      setError('An error occurred during sign-out. Please try again.');
      toast.error('An error occurred during sign-out. Please try again.');
    } finally {
      setLoading(false);
      router.push('/sign-in');
    }
  };


  const navigation = [
    { name: 'Overview', to: '/overview', icon: <DashboardIcon /> },
    { name: 'Projects', to: '/projects', icon: <FileTextIcon /> },
    // { name: 'User Management', to: '/user-mgt', icon: <PersonIcon /> },
    // { name: 'Audit Logs', to: '/audit-logs', icon: <ListBulletIcon /> },
    // { name: 'Analytics', to: '/analytics', icon: <BarChartIcon /> },
    // { name: 'Access Token', to: '/access-token', icon: <Crosshair2Icon /> },
    // { name: 'Rewards', to: '/rewards', icon: <BookmarkFilledIcon /> },
    // { name: 'Data Backup', to: '/data-backup', icon: <CloudUpload size={16} /> },
    { name: 'Settings', to: '/settings', icon: <GearIcon /> },
  ];

  return (
    <div className='dark:bg-[#18171C] w-[18%] border-r border-r-[#1B1C1F] fixed hidden lg:flex flex-col items-center justify-start p-10 py-20 min-h-screen h-full overflow-y-auto'>
      <div className='flex flex-col justify-between h-full w-full'>
        <div>
          <Link href='/' className='font-medium text-gradient text-xl pl-10'>
            QuikDB
          </Link>
          <div className='flex flex-col gap-2 mt-16'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.to}
                className={`flex items-center gap-3 rounded-lg py-2 px-8 text-sm leading-7 ${pathname === item.to ? 'bg-gradient' : 'hover:bg-gradient'
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className='py-6 mt-6 flex flex-col gap-2 w-full items-'>
          {/* <Button size='lg' className='flex items-center gap-3 rounded-lg py-2 px-8 text-sm leading-7 hover:bg-gradient dark:bg-[#18171C] text-gradient'>
            <HeadphonesIcon /> Support
          </Button> */}
          <Button
            className='flex items-center gap-3 rounded-lg px-8 text-sm leading-7 hover:bg-gradient dark:bg-[#18171C] text-gradient w-full'
            onClick={handleSignout}
            disabled={loading}
          >
            <LogOutIcon />
            Logout
          </Button>
        </div>
      </div>
      <div className='flex-grow'>{children}</div>
    </div>
  );
};

export default GlobalSidebar;
