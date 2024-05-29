import logo from './logo.svg';
import './App.css';
import './tailwind.css';
import "./index.css";
import { useEffect, useState } from 'react';

function App() {

  // panel switch
  const [setupServer, setSetup] = useState(false);

  const remoteServer = "http://localhost:2895"

  // fetched data from database
  const [fetchedGames, fetchGames] = useState([{}]);
  const [fetchedTypes, fetchTypes] = useState([{}]);
  const [fetchedVersions, fetchVersions] = useState([{}]);

  // game, server type, version
  const [chosenGame, setChosenGame] = useState({ id: null, name: '' });
  const [chosenServerType, setChosenServerType] = useState({id: null, name: ''});
  const [chosenVersion, setChosenVersion] = useState({id: null, name: ''});

  // open/close selects
  const [isGameMenu, setGameMenu] = useState(false);
  const [isServerTypeMenu, setServerTypeMenu] = useState(false);
  const [isVersionMenu, setVersionMenu] = useState(false);




    useEffect(() => {
        if(!chosenGame.id){
            fetch(`${remoteServer}/api/games/all`, {
              method: 'GET',
            })
            .then(response => response.json())
            .then(data => {fetchGames(data)})
        }
        if(chosenGame.id && !chosenVersion.id){
          fetch(`${remoteServer}/api/types/${chosenGame.id}`,{
            method: 'GET',
          })
          .then(response => response.json())
          .then(data => {fetchTypes(data)})
        }
        if(chosenGame.id && chosenServerType.id){
          fetch(`${remoteServer}/api/versions/${chosenServerType.id}`,{
            method: 'GET',
          })
          .then(response => response.json())
          .then(data => {fetchVersions(data); console.log(data)})
        }
    }, [chosenGame.id, chosenServerType.id, chosenVersion.id]);
  

  return (
    <div className="flex h-screen w-full">
      <div className='w-full flex-col'>
      <div className="bg-white text-red h-12 w-full flex items-center justify-start border-b border-[#DCDCDC]">
        <h1 className="text-2xl p-2 fdp flex-row flex gap-2">ServerSphere<img alt='logo' className='w-7' src='./serversphere_logo.png'></img></h1>
      </div>
      <div className="text-red h-5/6 w-full flex items-center justify-center">
        <div className={`${setupServer ? "h-5/6 justify-start" : "h-48 justify-center"} flex gap-2 flex-col items-center bg-[#ECECEC] border-[#BFBFBF] border w-2/3 rounded-xl text-[#BFBFBF] hover:text-[#9C9C9C] duration-300 ease-in-out`} onClick={() => setSetup(true)}>
        {setupServer ? (
        <> 
          <div className="relative inline-block w-3/4 mt-2">
      <button onClick={() => {setGameMenu(!isGameMenu); setServerTypeMenu(false); setVersionMenu(false)}} className={`${isGameMenu && fetchedGames ? "rounded-t-lg":"rounded-xl"} flex flex-row items-center justify-start w-3/4 h-8 p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out`}>
        <span className="mr-1">{chosenGame.id ? chosenGame.name : "Select Game"}</span>
        <svg className={`fill-current h-4 w-4 ${isGameMenu && "rotate-180"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
      {isGameMenu && ( 
        <ul className="absolute z-10 flex flex-col items-center justify-center w-3/4 gap-1 p-1 bg-white overflow-elippsis border border-[#DCDCDC] duration-150 ease-in-out rounded-b-lg">
      {fetchedGames.map(game => (
        <li key={game.id} onClick={() => {setChosenGame(game);  setChosenServerType({id: null, name: ''}); setChosenVersion({id: null, name: ''}); fetchVersions([{}]); setGameMenu(false)}} className="cursor-pointer flex flex-row items-center justify-start w-full p-1 ps-2 bg-white rounded-lg overflow-elippsis hover:bg-gray-200  duration-150 ease-in-out">
          {game.name}
        </li>
      ))}
        </ul>
      )}
    </div>
    <div className="relative inline-block w-3/4">
      <button disabled={!chosenGame.id} onClick={() => {setServerTypeMenu(!isServerTypeMenu); setGameMenu(false); setVersionMenu(false)}} className={`${isServerTypeMenu && fetchedTypes ? "rounded-t-lg":"rounded-xl"} ${!chosenGame.id && "opacity-50" } flex flex-row items-center justify-start w-3/4 h-8 p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out`}>
        <span className="mr-1">{chosenServerType.id ? chosenServerType.name : "Select Server Type"}</span>
        <svg className={`fill-current h-4 w-4 ${isServerTypeMenu && "rotate-180"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
      {isServerTypeMenu && (
        <ul className="absolute z-10 flex flex-col items-center justify-center w-3/4 gap-1 p-1 bg-white overflow-elippsis border border-[#DCDCDC] duration-150 ease-in-out rounded-b-lg">
          {fetchedTypes.map(type => (
            <li key={type.id} onClick={() => {setChosenServerType(type); setServerTypeMenu(false); setChosenVersion([{}]); }} className="cursor-pointer flex flex-row items-center justify-start w-full p-1 ps-2 bg-white rounded-lg overflow-elippsis hover:bg-gray-200  duration-150 ease-in-out">
              {type.name}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="relative inline-block w-3/4">
      <button disabled={!chosenServerType.id} onClick={() => {setVersionMenu(!isVersionMenu); setServerTypeMenu(false); setGameMenu(false)}} className={`${isVersionMenu && fetchedVersions ? "rounded-t-lg":"rounded-xl"} ${!chosenServerType.id && "opacity-50"} flex flex-row items-center justify-start w-3/4 h-8 p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out`}>
        <span className="mr-1">{chosenVersion.id ? chosenVersion.name : "Select Version"}</span>
        <svg className={`fill-current h-4 w-4 ${isVersionMenu && "rotate-180"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
      {isVersionMenu && (
        <ul className="absolute z-10 flex flex-col items-center justify-center w-3/4 gap-1 p-1 bg-white overflow-elippsis border border-[#DCDCDC] duration-150 ease-in-out rounded-b-lg">
          {fetchedVersions.map(version => (
            <li key={version.id} onClick={() => {setChosenVersion(version); setVersionMenu  (false)}} className="cursor-pointer flex flex-row items-center justify-start w-full p-1 ps-2 bg-white rounded-lg overflow-elippsis hover:bg-gray-200  duration-150 ease-in-out">
              {version.name}
            </li>
          ))}
        </ul>
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
            <p className='fd flex-row flex text-2xl'>server1<img alt='minecraft emoji' className='w-3 h-3 mt-2 m-1' src='./emoji_minecraft_simple.png'></img></p>
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
            <p className='fd flex-row flex text-2xl'>server1<img alt='minecraft emoji' className='w-3 h-3 mt-2 m-1' src='./emoji_minecraft_simple.png'></img></p>
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
