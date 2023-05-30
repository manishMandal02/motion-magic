'use client';
import ArtBoard from '@/components/art-board';
import SideNav from '@/components/nav/side-nav';
import Timeline from '@/components/timeline';
import React from 'react';

export default function Page() {
  return (
    <div className='h-screen w-screen'>
      {/* top nav */}
      <div className='flex h-1/10 items-center w-full justify-center bg-slate-400'>Top Nav</div>
      {/* editor wrapper */}
      <div className='max-h-9/10 h-9/10'>
        {/* top container */}
        <div className='flex w-full h-4/6 bg-slate-600'>
          {/* side menu wrapper */}
          <div className='flex bg-slate-400 h-full max-h-full w-4/12 overflow-hidden'>
            {/* side nav */}
            <SideNav />
          </div>
          {/* art board wrapper */}
          <div className='flex bg-slate-700 w-8/12  items-center justify-center'>
            <ArtBoard />
          </div>
        </div>
        {/* bottom container */}
        <div className='flex w-full h-2/6 bg-slate-900 text-white flex-col px-2'>
          <Timeline />
        </div>
      </div>
    </div>
  );
}
