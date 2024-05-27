import logo from './logo.svg';
import './App.css';
import './tailwind.css';
import "./index.css";
import { useEffect, useState } from 'react';

function App() {
  const [serverName, setServerName] = useState('');
  const [setupServer, setSetup] = useState(false);


  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Select game");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const ServerTypeOptions = [
    "Minecraft","Terraria","Counter Strike 1.6"
  ];
  const ServerVersionTypeOptions = [
    "Forge","Vanilla","Spigot"
  ];

  return (
    <div className="flex h-screen w-full">
      <div className='w-full flex-col'>
      <div className="bg-white text-red h-12 w-full flex items-center justify-start border-b border-[#DCDCDC]">
        <h1 className="text-2xl p-2 fdp flex-row flex gap-2">ServerSphere<img className='w-7' src='./serversphere_logo.png'></img></h1>
      </div>
      <div className="text-red h-5/6 w-full flex items-center justify-center">
        <div className={`${setupServer ? "h-5/6 justify-start" : "h-48 justify-center"} flex gap-2 flex-col items-center bg-[#ECECEC] border-[#BFBFBF] border w-2/3 rounded-xl text-[#BFBFBF] hover:text-[#9C9C9C] duration-300 ease-in-out`} onClick={() => setSetup(true)}>
        {/* Setup server */}
        {setupServer ? (
        <> 
          <div className="relative inline-block w-3/4 mt-2">
      <button onClick={toggleDropdown} className={`${isOpen ? "rounded-t-lg":"rounded-xl"} flex flex-row items-center justify-start w-3/4 h-8 p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out`}>
        <span className="mr-1">{selected}</span>
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute z-10 flex flex-col items-center justify-center w-3/4 gap-1 p-1 bg-white overflow-elippsis border border-[#DCDCDC] duration-150 ease-in-out rounded-b-lg">
          {ServerTypeOptions.map(option => (
            <li key={option} onClick={() => handleOptionClick(option)} className="cursor-pointer flex flex-row items-center justify-start w-full p-1 ps-2 bg-white rounded-lg overflow-elippsis hover:bg-gray-200  duration-150 ease-in-out">
              {option}
            </li>
          ))}
        </ul>
      )}
      {selected === "Minecraft" && (
        <p></p>
      )}
      {selected === "Terraria" && (
        <div className="mt-4 p-4 text-black bg-orange-100 border border-orange-500 rounded-md">
          Comming soon...
        </div>
      )}
    </div>
    <div className="relative inline-block w-3/4">
      <button onClick={toggleDropdown} className={`${isOpen ? "rounded-t-lg":"rounded-xl"} flex flex-row items-center justify-start w-3/4 h-8 p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out`}>
        <span className="mr-1">{selected}</span>
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute z-10 flex flex-col items-center justify-center w-3/4 gap-1 p-1 bg-white overflow-elippsis border border-[#DCDCDC] duration-150 ease-in-out rounded-b-lg">
          {ServerVersionTypeOptions.map(option => (
            <li key={option} onClick={() => handleOptionClick(option)} className="cursor-pointer flex flex-row items-center justify-start w-full p-1 ps-2 bg-white rounded-lg overflow-elippsis hover:bg-gray-200  duration-150 ease-in-out">
              {option}
            </li>
          ))}
        </ul>
      )}
      {selected === "Minecraft" && (
        <p></p>
      )}
      {selected === "Terraria" && (
        <div className="mt-4 p-4 text-black bg-orange-100 border border-orange-500 rounded-md">
          Comming soon...
        </div>
      )}
    </div>
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
      {/* Server list */}
      <div className="bg-[#ECECEC] border-[#DCDCDC] items-center border-s text-red h-full w-64 flex flex-col justify-start hover:w-72 duration-300 ease-in-out">
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
