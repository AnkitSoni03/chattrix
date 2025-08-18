import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageContainer from './components/MessageContainer';

const Home = () => {

  const [selectedUser , setSelectedUser] = useState(null);
  const [isSidebarVisible , setIsSidebarVisible]= useState(true);

  const handelUserSelect=(user)=>{
    setSelectedUser(user);
    setIsSidebarVisible(false);
  }
  const handelShowSidebar=()=>{
    setIsSidebarVisible(true);
    setSelectedUser(null);
  }
  return (

<div className='flex justify-between min-w-full
     md:min-w-[550px] md:max-w-[65%]
     h-screen md:h-full  
      md:rounded-xl md:shadow-lg
       md:bg-gray-400 md:bg-clip-padding
        md:backdrop-filter md:backdrop-blur-lg
        md:bg-opacity-0'
        >
      <div className={`w-full md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
      <Sidebar onSelectUser={handelUserSelect}/>
      </div>
      <div className={`divider divider-horizontal px-3 md:flex
         ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
      <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-gray-200}`}>
      <MessageContainer onBackUser={handelShowSidebar}/>
      </div>
    </div>
  );
};

export default Home;
