import logo from './logo.svg';
import './App.css';
import './tailwind.css';
import "./index.css";
import { useEffect, useState } from 'react';

function App() {
  const [serverName, setServerName] = useState('');
  const [setupServer, setSetup] = useState(false);


  return (
    <div className="flex h-screen w-full">
      <div className='w-full flex-col'>
      <div className="bg-white text-red h-12 w-full flex items-center justify-start border-b border-[#DCDCDC]">
        <h1 className="text-2xl p-2 fdp flex-row flex gap-2">ServerSphere<img className='w-7' src='./serversphere_logo.png'></img></h1>
      </div>
      <div className="text-red h-5/6 w-full flex items-center justify-center">
        <div className={`${setupServer ? "h-5/6" : "h-48"} flex flex-col items-center justify-center bg-[#ECECEC] border-[#BFBFBF] border w-2/3 rounded-xl text-[#BFBFBF] hover:text-[#9C9C9C] duration-300 ease-in-out cursor-pointer`} onClick={() => setSetup(true)}>
        {setupServer ? (
        <> 
          <p className='fm'>SETUP SERVER</p>
          <p className='fm text-4xl'>+</p>
          <input type='text'></input>
        </>
        ) : (
        <>
          <p className='fm'>CREATE NEW SERVER</p>
          <p className='fm text-4xl'>+</p>
        </>
        )
        }
        </div>
      </div>
      </div>
      <div className="bg-[#ECECEC] border-[#DCDCDC] items-center border-s text-red h-full w-64 flex flex-col justify-start">
        <p className='fdp self-start m-1 text-xl ms-2'>My servers</p>
        <div className='flex flex-col items-center justify-center w-full max-h-11/12 gap-2 overflow-auto'>
          <div className='flex flex-col items-center justify-start w-10/12 h-12 bg-white rounded-xl overflow-elippsis border border-white hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out cursor-pointer'>
            <div className='flex-row flex'>
            <p className='fd flex-row flex text-2xl'>server1<img className='w-3 h-3 mt-2 m-1' src='./emoji_minecraft_simple.png'></img></p>
            <div className='bg-red-600 w-1.5 h-1.5 rounded-xl mt-2.5 ms-1 me-2'></div>
            <div className='w-[1px] bg-[#DCDCDC] h-6 mt-1'></div>
            <div className='flex flex-col ms-1 items-end gap-0 leading-none mt-[2px]'>
                <p className='fdp leading-none text-sm'>Vanilla</p>
                <p className='fdp text-sm leading-none'>1.17.1</p>
              </div>
            </div>
            <div className='fm text-[9.5px] text-[#9C9C9C]'>minecraft_server1.12.6.jar</div>
          </div>
          <div className='flex flex-col items-center justify-start w-10/12 h-12 bg-white rounded-xl overflow-elippsis border border-white hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out cursor-pointer'>
            <div className='flex-row flex'>
            <p className='fd flex-row flex text-2xl'>server1<img className='w-3 h-3 mt-2 m-1' src='./emoji_minecraft_simple.png'></img></p>
            <div className='bg-green-500 w-1.5 h-1.5 rounded-xl mt-2.5 ms-1 me-2'></div>
            <div className='w-[1px] bg-[#DCDCDC] h-6 mt-1'></div>
            <div className='flex flex-col ms-1 items-end gap-0 leading-none mt-[2px]'>
                <p className='fdp leading-none text-sm'>Vanilla</p>
                <p className='fdp text-sm leading-none'>1.17.1</p>
              </div>
            </div>
            <div className='fm text-[9.5px] text-[#9C9C9C]'>minecraft_server1.12.6.jar</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
