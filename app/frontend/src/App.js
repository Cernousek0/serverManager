import logo from './logo.svg';
import './App.css';
import './tailwind.css';
import "./index.css";
import { useEffect, useRef, useState } from 'react';
import 'framework7-icons/css/framework7-icons.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


function App() {

  ChartJS.register(ArcElement, Tooltip, Legend);

  // panel switch
  const [setupServer, setSetup] = useState(false);
  
  // api's, url's
  const remoteServer = "http://localhost:2895";
  const localApi = "http://localhost:5000";
  
  // fetched data from database
  const [fetchedGames, fetchGames] = useState([{}]);
  const [fetchedTypes, fetchTypes] = useState([{}]);
  const [fetchedVersions, fetchVersions] = useState([{}]);
  
  // game, server type, version
  const [chosenName, setChosenName] = useState('');
  const [chosenGame, setChosenGame] = useState({ id: null, name: '' });
  const [chosenServerType, setChosenServerType] = useState({ id: null, name: '' });
  const [chosenVersion, setChosenVersion] = useState({ id: null, name: '' });
  
  // open/close selects
  const [isGameMenu, setGameMenu] = useState(false);
  const [isServerTypeMenu, setServerTypeMenu] = useState(false);
  const [isVersionMenu, setVersionMenu] = useState(false);
  const [isLoading, setLoading] = useState(false);
  
  // open server dashboard
  const [isServerDashBoard, setServerDashBoard] = useState(false);
  const [isServerSidebar, setServerSidebar] = useState(false);
  
  // loaded servers
  const [loadedServers, setLoadedServers] = useState([{}]);
  const [serverStatuses, setServerStatuses] = useState({}); // New state for server statuses
  
  // server data
  const [isServerOn, setServerOn] = useState(false);
  
  const [serverId, setServerId] = useState('');
  const [serverName, setServerName] = useState('');
  const [serverGame, setServerGame] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [serverPlayersList, setServerPlayers] = useState([]);
  const [serverPlayersCount, setPlayersCount] = useState(0);
  const [serverType, setServerType] = useState('');
  const [serverLogs, setServerLogs] = useState([]);
  const [serverBirth, setServerBirth] = useState('');
  
  const [localIp, setPrivateIp] = useState('');
  const [publicIp, setPublicIp] = useState('');
  
  const [cpuUsage, setCpuUsage] = useState(0);
  const [ramUsage, setRamUsage] = useState(0);
  const [diskUsage, setDiskUsage] = useState(0);
  
  const [command, setCommand] = useState('');
  const commandInput = useRef(null);
  
  const [isServerSettings, setServerSettings] = useState(false);
  const [settingsRam, setSettingsRam] = useState(0);
  const [settingsName, setSettingName] = useState('');
  const settingNameInput = useRef(null);
  
  // chart data & options
  const cpuData = {
    labels: ['CPU Usage', 'Empty'],
    datasets: [
      {
        label: 'CPU Usage',
        data: [cpuUsage, 100 - cpuUsage], // Example values
        backgroundColor: [
          'rgb(0, 0, 0)', // Border color for CPU Usage
          'rgb(196, 196, 196)', // Color for Empty
        ],
        borderColor: [
          'rgb(0, 0, 0)', // Border color for CPU Usage
          'rgb(196, 196, 196)', // Color for Empty
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const ramData = {
    labels: ['RAM Usage', 'Empty'],
    datasets: [
      {
        label: 'RAM Usage',
        data: [ramUsage, 100 - ramUsage], // Example values
        backgroundColor: [
          'rgb(0, 0, 0)', // Border color for CPU Usage
          'rgb(196, 196, 196)', // Color for Empty
        ],
        borderColor: [
          'rgb(0, 0, 0)', // Border color for CPU Usage
          'rgb(196, 196, 196)', // Color for Empty
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const diskData = {
    labels: ['Disk Usage', 'Empty'],
    datasets: [
      {
        label: 'Disk Usage',
        data: [diskUsage, 1000 - diskUsage], // Example values
        backgroundColor: [
          'rgb(0, 0, 0)', // Border color for CPU Usage
          'rgb(196, 196, 196)', // Color for Empty
        ],
        borderColor: [
          'rgb(0, 0, 0)', // Border color for CPU Usage
          'rgb(196, 196, 196)', // Color for Empty
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  
  // elements
  const containerLog = useRef(null);
  
  useEffect(() => {
    if(settingNameInput.current)    settingNameInput.current.value = serverName;
  }, [settingNameInput.current, serverName]);
  useEffect(() => {
    if (!chosenGame.id) {
      fetch(`${remoteServer}/api/games/all`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          fetchGames(data);
        });
    }
    if (chosenGame.id && !chosenVersion.id) {
      fetch(`${remoteServer}/api/types/${chosenGame.id}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          fetchTypes(data);
        });
    }
    if (chosenGame.id && chosenServerType.id) {
      fetch(`${remoteServer}/api/versions/${chosenServerType.id}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          fetchVersions(data);
        });
    }
  }, [chosenGame.id, chosenServerType.id, chosenVersion.id]);
  
  const createServer = async () => {
    let serverData = {};
    if (!chosenGame.id || !chosenServerType.id || !chosenVersion.id || !chosenName) return;
    await fetch(`${localApi}/server/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 4,
        name: chosenName,
        game: chosenGame.name,
        version: chosenVersion.name,
        type: chosenServerType.name,
        mods: {},
        plugins: {},
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        serverData = data;
      });
  
    if (serverData.error) return;
    setLoading(true);
    setServerOn(true);
    setTimeout(() => {
      loadServer(serverData.server_id);
    }, 2000);
  };
  
  const removeServer = async (server_id) => {
    if (!server_id) return;
    const result = await fetch(`${localApi}/server/${server_id}/delete`, {
      method: 'DELETE',
    });
    if (result.error) return;
    window.location.reload();
  };
  
  const startServer = async (server_id) => {
    let result;
    await fetch(`${localApi}/server/${server_id}/start`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        result = data;
      });
  
    if (result.error) return;
    setServerOn(true);
  };
  
  const stopServer = async (server_id) => {
    if (!server_id || !isServerOn) return;
    setServerOn(false);
  
    let result;
    setTimeout(async () => {
      await fetch(`${localApi}/server/${server_id}/stop`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then((data) => {
          result = data;
          if (result.error) {
            setServerOn(true);
          }
        });
    }, 5000);
  };
  
  const loadServer = async (server_id) => {
    if (!server_id) return;
    setServerId(server_id);
  
    await fetch(`${localApi}/server/${server_id}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setServerName(data.name);
        setServerGame(data.game);
        setServerPort(data.port);
        setServerType(data.type);
        setServerBirth(data.created_at);
        setSettingsRam(data.ram);
      });
  
    // change layout
    setServerDashBoard(true);
    setServerSidebar(true);
  
    // get ip addresses
    fetchIp();
  
    // fetch players and logs
    if (isServerOn) {
      fetchPlayers(server_id);
      fetchLog(server_id);
      fetchPerformance(server_id);
    }
  };
  
  const fetchPlayers = async (server_id) => {
    if (!isServerOn) return;
    const response = await fetch(`${localApi}/server/${server_id}/players`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if(!data.error){
        setPlayersCount(data.total);
        setServerPlayers(data.players);
        }
      });
    setTimeout(() => {
      fetchPlayers(server_id);
    }, 3500);
  };
  
  const fetchLog = async (server_id) => {
    if (!isServerOn) return;
    if (containerLog.current) {
      containerLog.current.scrollTop = containerLog.current.scrollHeight;
    }
  
    await fetch(`${localApi}/server/${server_id}/logs`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setServerLogs(data);
      });
    setTimeout(() => {
      fetchLog(server_id);
    }, 3500);
  };
  
  const fetchIp = async () => {
    await fetch(`${localApi}/ip`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setPublicIp(data.public_ip);
        setPrivateIp(data.local_ip);
      });
  };
  
  const fetchPerformance = async (server_id) => {
    if (!isServerOn) return;
    await fetch(`${localApi}/server/${server_id}/performance`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setCpuUsage(data.cpu_usage);
        setRamUsage(data.mem_percentage);
        setDiskUsage(data.disk_usage);
      });
  
    setTimeout(() => {
      fetchPerformance(server_id);
    }, 3500);
  };
  
  const fetchAllServers = async () => {
    await fetch(`${localApi}/server/all`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setLoadedServers(data);
      });
  };
  
  const fetchStatus = async (server_id) => {
    if (!server_id) return false;
    const response = await fetch(`${localApi}/server/${server_id}/status`, {
      method: 'GET',
    });
    const data = await response.json();
    return data.status;
  };
  
  useEffect(() => {
    const fetchAllStatuses = async () => {
      const statuses = await Promise.all(
        loadedServers.map(async (server) => {
          const isRunning = await fetchStatus(server.server_id);
          return { server_id: server.server_id, isRunning };
        })
      );
      const statusMap = {};
      statuses.forEach(({ server_id, isRunning }) => {
        statusMap[server_id] = isRunning;
      });
      setServerStatuses(statusMap);
    };
  
    if (loadedServers.length > 0) {
      fetchAllStatuses();
    }
  }, [loadedServers]);
  
  useEffect(() => {
    fetchAllServers();
  }, []);
  
  const sendCommand = async (server_id, command) => {
    let status;
    if (!server_id || !command) return;
    if(commandInput.current) commandInput.current.value = '';
    await fetch(`${localApi}/server/${server_id}/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command: command,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        status = data;
      });
  
    if (status.output) return;
  };
  
  const saveSetting = async () => {
    const response = await fetch(`${localApi}/server/${serverId}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ram: settingsRam,
        name: settingsName,
      }),
    });
  
    if (response.error) return;
    loadServer(serverId);
  };
  
  // useEffect to handle the dependent functions when isServerOn changes
  useEffect(() => {
    if (isServerOn && serverId) {
      fetchPlayers(serverId);
      fetchLog(serverId);
      fetchPerformance(serverId);
    }
  }, [isServerOn, serverId]);

  const resetAllStates = () => {
    window.location.reload();
  }

  return (
    <div className="flex h-screen w-full">
      {/* Setup server */}
      {!isServerDashBoard && (
      <div className='w-full flex-col '>
        <div className="bg-white text-red h-12 w-full flex items-center justify-start border-b border-[#DCDCDC]">
          <h1 className="text-2xl p-2 fdp flex-row flex gap-2">ServerSphere<img alt='logo' className='w-7' src='./serversphere_logo.png'></img></h1>
        </div>
        <div className="text-red h-5/6 w-full flex items-center justify-center">
          <div className={`${setupServer ? "h-5/6 justify-start" : "h-48 justify-center"} flex gap-2 flex-col items-center bg-[#ECECEC] border-[#BFBFBF] border w-2/3 rounded-xl text-[#BFBFBF] hover:text-[#9C9C9C] duration-300 ease-in-out`} onClick={() => setSetup(true)}>
            {setupServer ? (
              <>
                <div className="relative inline-block w-11/12 mt-2">
                  <button onClick={() => { setGameMenu(!isGameMenu); setServerTypeMenu(false); setVersionMenu(false) }} className={`${isGameMenu && fetchedGames ? "rounded-t-lg" : "rounded-xl"} flex flex-row items-center justify-start w-full h-8 p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out`}>
                    <span className="mr-1">{chosenGame.id ? chosenGame.name : "Select Game"}</span>
                    <svg className={`fill-current h-4 w-4 ${isGameMenu && "rotate-180"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                  {isGameMenu && (
                    <ul className="absolute z-10 flex flex-col items-center justify-center w-full gap-1 p-1 bg-white overflow-elippsis border border-[#DCDCDC] duration-150 ease-in-out rounded-b-lg">
                      {fetchedGames.map(game => (
                        <li key={game.id} onClick={() => { setChosenGame(game); setChosenServerType({ id: null, name: '' }); setChosenVersion({ id: null, name: '' }); fetchVersions([{}]); setGameMenu(false) }} className="cursor-pointer flex flex-row items-center justify-start w-full p-1 ps-2 bg-white rounded-lg overflow-elippsis hover:bg-gray-200  duration-150 ease-in-out">
                          {game.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className='m-2 flex flex-col items-center justify-start w-11/12 rounded-xl h-24 p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out'>
                  <p className='fm'>IMPORT MODPACK</p>
                  <p className='fm text-4xl'>+</p>
                </div>
                <div className='flex flex-row gap-2 w-11/12'>
                  <div className="relative inline-block w-full">
                    <button disabled={!chosenGame.id} onClick={() => { setServerTypeMenu(!isServerTypeMenu); setGameMenu(false); setVersionMenu(false) }} className={`${isServerTypeMenu && fetchedTypes ? "rounded-t-lg" : "rounded-xl"} ${!chosenGame.id && "opacity-50"} flex flex-row items-center justify-start w-full h-8 p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out`}>
                      <span className="mr-1">{chosenServerType.id ? chosenServerType.name : "Select Server Type"}</span>
                      <svg className={`fill-current h-4 w-4 ${isServerTypeMenu && "rotate-180"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                    {isServerTypeMenu && (
                      <ul className="absolute z-10 flex flex-col items-center justify-center w-full gap-1 p-1 bg-white overflow-elippsis border border-[#DCDCDC] duration-150 ease-in-out rounded-b-lg">
                        {fetchedTypes.map(type => (
                          <li key={type.id} onClick={() => { setChosenServerType(type); setServerTypeMenu(false); setChosenVersion([{}]); }} className="cursor-pointer flex flex-row items-center justify-start w-full p-1 ps-2 bg-white rounded-lg overflow-elippsis hover:bg-gray-200  duration-150 ease-in-out">
                            {type.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="relative inline-block w-full">
                    <button disabled={!chosenServerType.id} onClick={() => { setVersionMenu(!isVersionMenu); setServerTypeMenu(false); setGameMenu(false) }} className={`${isVersionMenu && fetchedVersions ? "rounded-t-lg" : "rounded-xl"} ${!chosenServerType.id && "opacity-50"} flex flex-row items-center justify-start w-full h-8 p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out`}>
                      <span className="mr-1">{chosenVersion.id ? chosenVersion.name : "Select Version"}</span>
                      <svg className={`fill-current h-4 w-4 ${isVersionMenu && "rotate-180"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                    {isVersionMenu && (
                      <ul className="absolute z-10 flex flex-col items-center justify-center w-full gap-1 p-1 bg-white overflow-elippsis border border-[#DCDCDC] duration-150 ease-in-out rounded-b-lg h-14 overflow-scroll">
                        {fetchedVersions.map(version => (
                          <li key={version.id} onClick={() => { setChosenVersion(version); setVersionMenu(false) }} className="cursor-pointer flex flex-row items-center justify-start w-full p-1 ps-2 bg-white rounded-lg overflow-elippsis hover:bg-gray-200  duration-150 ease-in-out">
                            {version.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className='w-11/12 flex flex-row gap-2 h-full mb-2'>
                  <div className='flex flex-col items-center justify-start w-full h-full rounded-xl p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out'>
                    <p className='fm'>PLUGINS ARE NOT AVAILIBLE FOR THIS VERSION</p>
                  </div>
                  <div className='flex flex-col items-center justify-start w-full rounded-xl h-full p-3 border-[#DCDCDC] bg-white overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out'>
                  <p className='fm'>MODS ARE NOT AVAILIBLE FOR THIS VERSION</p>
                  </div>
                </div>
                  <input onBlur={(e) => {setChosenName(e.target.value)}} className='text-sm bg-white border-[#DCDCDC] w-11/12 rounded-xl fm p-1 overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out' placeholder='Enter server name...'></input>
                {!isLoading && (<button onClick={createServer} className={`m-2 w-11/12 bg-green-200 border-green-500 border rounded-lg text-center ${!chosenVersion.id && "opacity-50"}`} disabled={chosenVersion.id ? false : true}>
                  <p className='fm'>CREATE NEW SERVER</p>
                </button>)}
                {isLoading && <div className='mb-3'><LoadingIndicator message="Creating Server" /></div>}
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
      )}
      {/* Server list */}
        <div className='bg-[#ECECEC] border-[#DCDCDC]h-full w-72 flex flex-col hover:w-80 duration-300 ease-in-out'>
        {!isServerSidebar ? (
          <div className="items-center border-s text-red justify-start">
            <p className='fdp self-start m-1 text-xl ms-2'>My servers</p>
            <div className='flex flex-col items-center justify-center w-full max-h-11/12 gap-2 overflow-auto'>
              {loadedServers.map(server => (
                <div key={server.server_id} onClick={() => {serverStatuses[server.server_id] ? startServer(server.server_id) && loadServer(server.server_id) : loadServer(server.server_id)}} className='flex flex-col items-center justify-start w-10/12 h-12 bg-white rounded-xl overflow-elippsis border border-white hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out cursor-pointer'>
                <div className='flex-row flex'>
                  <p className='fd flex-row flex text-2xl'>{server.name}<img alt='minecraft emoji' className='w-3 h-3 mt-2 m-1' src='./emoji_minecraft_simple.png'></img></p>
                  <div className={`${serverStatuses[server.server_id] ? "bg-green-600" : "bg-red-600"} w-1.5 h-1.5 rounded-xl mt-2.5 ms-1 me-2`}></div>
                  <div className='w-[1px] bg-[#DCDCDC] h-6 mt-1'></div>
                  <div className='flex flex-col ms-1 items-end gap-0 leading-none mt-[2px]'>
                    <p className='fdp leading-none text-sm'>{server.type}</p>
                    <p className='fdp text-sm leading-none'>{server.version}</p>
                  </div>
                </div>
                <div className='fm text-[9.5px] text-[#9C9C9C]'>{server.created_at}</div>
              </div>
              ))}  
            </div>
          </div>
          ) : (
        <div className='flex flex-col justify-center items-center pt-4 gap-4'>
          <div onClick={resetAllStates} className='flex flex-col items-center justify-center w-10/12 h-8 bg-white rounded-xl overflow-elippsis border border-white hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out cursor-pointer'>
            <i className="f7-icons p-1 cursor-pointer">arrow_left</i>
          </div>
          <div className='flex flex-col items-center justify-start w-10/12 h-12 bg-white rounded-xl overflow-elippsis border border-white duration-150 ease-in-out'>
            <p className='fdp pe-2 flex'>{publicIp ?? "0.0.0.0"}<i className="f7-icons fsize-14 p-1 cursor-pointer">doc_on_clipboard</i>            <div className={`${!isServerOn ? "from-[#FF0000] to-[#F11212]" : "from-[#92E441] to-[#72CA1A]"} bg-gradient-to-t w-1.5 h-1.5 rounded-xl mt-2.5 ms-1 me-2`}></div></p>
            <p className='fm ps-4'>or <span className='underline hover:bg-[#DEDEDE] rounded-xl duration-300 ease-in-out cursor-pointer'>{localIp ?? "0.0.0.0"}</span></p>
          </div>
          <div className='ps-4 pe-4 flex flex-col items-start justify-start w-10/12 h-44 bg-white rounded-xl overflow-elippsis border border-white duration-150 ease-in-out'>
            <table className='w-full '>
              <thead>
                <tr className='border-b border-[#D8D2D2]'>
                  <th className='text-2xl fd text-left'>Players</th>
                  <th className='text-2xl fd text-right'>{serverPlayersCount}/20</th>
                </tr>
              </thead>
              <tbody>
                {serverPlayersList.map(player => (
                       <tr>
                       <td className='text-sm fdp text-left'>{player}</td>
                     </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='flex gap-3 p-3 flex-col items-center justify-start w-10/12 bg-white rounded-xl overflow-elippsis border border-white duration-150 ease-in-out'>
          <div className='w-24 h-24'><Doughnut data={cpuData} options={options} /></div>
          <p className='fm'>CPU USAGE {!isNaN(cpuUsage) ? Math.round(cpuUsage) : 0}%</p>
          <div className='w-24 h-24'><Doughnut data={ramData} options={options} /></div>
          <p className='fm'>RAM USAGE {!isNaN(ramUsage) ? Math.round(ramUsage) : 0}%</p>
          <div className='w-24 h-24'><Doughnut data={diskData} options={options} /></div>
          <p className='fm'>DISK USAGE {!isNaN(diskUsage) ? Math.round(diskUsage) : 0}MB</p>
          </div> 
        </div>
          )}
      </div>
      {/* Server dashboard */}
      {isServerDashBoard && (
    
      <div className='w-full flex-col'>
        <div className="bg-white text-red h-12 w-full flex items-center justify-between border-b border-[#DCDCDC]">
          <h1 className="text-2xl p-2 fdp flex-row flex">{serverName?? ""}</h1>
          <div className='flex flex-row gap-1 me-2'>
            <button onClick={() => {isServerOn ? stopServer(serverId) : startServer(serverId)}} className={`${isServerOn ? "from-[#FF0000] to-[#F11212]" : "from-[#92E441] to-[#72CA1A]"} text-white bg-gradient-to-t  rounded-xl p-1`}><i className="f7-icons">power</i></button>
            {/* <button onClick={() => {stopServer(serverId); setTimeout( () => {startServer(serverId)}, 5000)}} className=' text-white bg-gradient-to-t from-[#FFA800] to-[#E19118] rounded-xl p-1'><i className="f7-icons">arrow_clockwise</i></button> */}
          </div>
        </div>
        <div className="h-20 px-4 justify-between bg-[#ECECEC] m-2 flex items-center rounded-xl">
          <div className='flex flex-col'>
            <p className='fdp text-xl'>{serverType?? ""} Server</p>
            <p className='fd text-xl text-[#707070] '>{serverBirth}</p>
          </div>
          <div className='w-[1px] h-2/3 bg-[#b1b1b1]'></div>
          <div className='flex items-start w-max flex-col hover:bg-[#DEDEDE] p-1 rounded-xl duration-300 ease-in-out cursor-pointer'>
            <p className='fdp text-base'>Mods</p>
            <p className='fd text-xl text-[#707070]'>Show Mods (0)</p>
          </div>
          <div className='w-[1px] h-2/3 bg-[#b1b1b1]'></div>
          <div className='flex items-start w-max flex-col hover:bg-[#DEDEDE] p-1 rounded-xl duration-300 ease-in-out cursor-pointer'>
            <p className='fdp text-base'>Plugins</p>
            <p className='fd text-xl text-[#707070]'>Show Plugins (0)</p>
          </div>
          <div className='w-[1px] h-2/3 bg-[#b1b1b1]'></div>
          <div onClick={() => setServerSettings(!isServerSettings)} className='flex items-center w-max flex-col hover:bg-[#DEDEDE] p-2 rounded-xl duration-300 ease-in-out cursor-pointer'>
            <div className='flex gap-2'><p className='fdp text-xl'>{isServerSettings ? "Server Log":"Settings"}</p><i className="f7-icons ps-1 ">{isServerSettings ? "bars" : "gear"}</i></div>
          </div>
        </div>
        <div className={`flex flex-col ${isServerSettings ? "" : "bg-black h-[73%]"} m-2 rounded-xl gap-2`}>
          {isServerSettings ? (<>
          <div className='flex p-2 flex-col gap-2 bg-[#ECECEC] rounded-xl'>
          <p className='fdp text-xl'>Server Settings</p>
          <div className='flex flex-row gap-2 justify-between'>
          <p className='fdp text-lg'>Server Ram</p>
          <p className='fdp text-lg'>{settingsRam}GB</p>
          </div>
          <input type='range' min="1" max="8" value={settingsRam} className='text-sm bg-white rounded-xl fm p-1 accent-black' onChange={(e) => setSettingsRam(e.target.value)}></input>
          <p className='fdp text-lg'>Server Name</p>
          <input type='text' className='text-sm bg-white border-[#DCDCDC] text-center rounded-xl fm p-1 overflow-elippsis border hover:bg-gray-200  hover:border-gray-300 duration-150 ease-in-out' ref={settingNameInput} onChange={(e) => setSettingName(e.target.value)}></input>
          <br></br>
          <button onClick={saveSetting} className='rounded-xl bg-white text-lg '>Save</button>
          <br></br><br></br>
          <button onClick={() => removeServer(serverId)} className=' text-white bg-gradient-to-t from-[#FF0000] to-[#F11212] rounded-xl p-1'><i className="f7-icons">trash</i></button>
          {/* <p className='fdp text-lg'>Server Properties</p>
          <button className='bg-white rounded-xl fm'>Open server.properties <i className="f7-icons text-[#2D2D2D] hover:text-black duration-300 ease-in-out fsize-18">arrow_up</i></button>
          <button onClick={() => setServerSettings(false)} className='fm'> BACK</button> */}
          </div>
          </>
          ) : (<>
            <div className='text-xs m-2 flex flex-col h-full text-white justify-start items-start overflow-scroll fm' ref={containerLog}>
              {serverLogs.map(log => (
                <p><span className="text-gray-500"></span> {log}</p>
              ))}
            </div>
            <div className='flex bg-[#2D2D2D] p-2 rounded-b-xl gap-2'>
              <input onBlur={(e) => {setCommand(e.target.value)}} ref={commandInput} className='text-sm bg-[#545454] w-11/12 rounded-xl fm p-1 text-white' placeholder='Enter commands here...'></input>
              <button onClick={() => sendCommand(serverId, command)} className='bg-[#545454] w-1/12 rounded-xl'><i className="f7-icons ps-1 text-[#2D2D2D] hover:text-white duration-300 ease-in-out">arrow_turn_right_up</i></button>
            </div>
          </>)}
        </div>
      </div>
      )}
    </div>
  );
}



const LoadingIndicator = ({ message }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='fm'>
      {message}
      {dots}
    </div>
  );
};



export default App;
