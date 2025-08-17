// import React, { useEffect, useState } from 'react';
// import Sidebar from './components/Sidebar';
// import MessageContainer from './components/MessageContainer';

// const Home = () => {

//   const [selectedUser , setSelectedUser] = useState(null);
//   const [isSidebarVisible , setIsSidebarVisible]= useState(true);

//   const handelUserSelect=(user)=>{
//     setSelectedUser(user);
//     setIsSidebarVisible(false);
//   }
//   const handelShowSidebar=()=>{
//     setIsSidebarVisible(true);
//     setSelectedUser(null);
//   }
//   return (

//     <div className='flex justify-between min-w-full
//      md:min-w-[550px] md:max-w-[65%]
//       px-2 h-[95%] md:h-full  
//       rounded-xl shadow-lg
//        bg-gray-400 bg-clip-padding
//         backdrop-filter backdrop-blur-lg 
//         bg-opacity-0'
//         >
//       <div className={`w-full py-2 md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
//       <Sidebar onSelectUser={handelUserSelect}/>
//       </div>
//       <div className={`divider divider-horizontal px-3 md:flex
//          ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
//       <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-gray-200}`}>
//       <MessageContainer onBackUser={handelShowSidebar}/>
//       </div>
//     </div>
//   );
// };

// export default Home;




import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageContainer from './components/MessageContainer';

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handelUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  }
  
  const handelShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  }
  
  return (
    <div className="flex justify-between w-full px-3 h-[95%] md:h-full rounded-2xl shadow-xl bg-slate-800/40 backdrop-blur-2xl border border-slate-600/30">
      
      {/* Sidebar Section - 30% */}
      <div className={`w-full md:w-[30%] py-3 md:flex transition-all duration-300 ${
        isSidebarVisible ? '' : 'hidden'
      }`}>
        <div className="w-full h-full bg-slate-700/30 backdrop-blur-xl rounded-xl border border-slate-600/40 shadow-lg">
          <Sidebar onSelectUser={handelUserSelect} />
        </div>
      </div>
      
      {/* Simple Divider */}
      <div className={`divider divider-horizontal px-4 md:flex transition-all duration-300 ${
        isSidebarVisible ? '' : 'hidden'
      } ${selectedUser ? 'block' : 'hidden'}`}>
        <div className="w-px h-full bg-slate-500/50"></div>
      </div>
      
      {/* Message Container Section - 70% */}
      <div className={`w-full md:w-[70%] transition-all duration-300 ${
        selectedUser ? '' : 'hidden md:flex'
      }`}>
        <div className="w-full h-full bg-slate-700/25 backdrop-blur-xl rounded-xl border border-slate-600/40 shadow-lg">
          <MessageContainer onBackUser={handelShowSidebar} />
        </div>
      </div>
    </div>
  );
};

export default Home;