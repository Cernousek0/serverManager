import logo from './logo.svg';
import './App.css';
import './tailwind.css';
import { useState } from 'react';

function App() {
  return (
    <div className="flex h-screen w-full">
      <div className='w-full flex-col'>
      <div className="bg-white text-red h-12 w-full flex items-center justify-start border-b border-[#DCDCDC]">
        <h1 className="text-2xl p-2">Hello World</h1>
      </div>
      <div className=" text-red h-full w-full flex items-center justify-center">
        <h1 className="text-2xl">Hello World</h1>
      </div>
      </div>
      <div className="bg-[#ECECEC] border-[#DCDCDC] border-s text-red h-full w-64 flex items-center justify-center">
        <h1 className="text-2xl">Hello World</h1>
      </div>
    </div>
  );
}

export default App;
