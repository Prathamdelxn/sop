
// 'use client';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// export default function RootLayout({ children }) {
  
//   const staticDashboardItem = { 
//     id: 'dashboard', 
//     title: 'Dashboard', 
//     icon: '📊', 
//     path: '/updated-admin', 
//     active: true 
//   };

//   const [dynamicSidebarItems, setDynamicSidebarItems] = useState([]);
//   const [activeItemId, setActiveItemId] = useState('dashboard');
//   const [companyData, setCompanyData] = useState();
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [isLoadingItems, setIsLoadingItems] = useState(true);
//   const [Id, setId] = useState();

//   useEffect(() => {
//     const data = localStorage.getItem('user');
//     const userdata = JSON.parse(data);
//     console.log("asdf", userdata)
//     setId(userdata.id);
//   }, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch(`/api/superAdmin/fetchById/${Id}`);
//       const newdata = await res.json();
//       console.log(newdata.superAdmin);
//       setCompanyData(newdata.superAdmin);
//       console.log(newdata.superAdmin?.workerRole);
//       const dd=newdata.superAdmin?.workerRole;
//       setDynamicSidebarItems(dd);
//       console.log(dd?.length);
//       setIsLoadingItems(false);
//     }
//     fetchData();
//   }, [Id])


//   const setActiveItem = (id) => {
//     setActiveItemId(id);
//   };

//   const handleLogout = () => {
//    localStorage.removeItem('token');
//   localStorage.removeItem('user');
//   router.replace('/new-login');
//   };

//   const renderSidebarItems = () => {
//     // Always show the static dashboard item first
//     const allItems = [staticDashboardItem, ...dynamicSidebarItems];
    
//     return allItems.map((item, index) => (
//       <div key={item.id} className="group relative">
//         <Link
//           href={item.path}
//           onClick={() => setActiveItem(item.id)}
//           className={`
//             flex items-center px-4 py-3 rounded-2xl text-sm font-semibold
//             transition-all duration-200 overflow-hidden
//             ${activeItemId === item.id
//               ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow scale-105'
//               : 'text-gray-800 hover:bg-gray-100 hover:text-black'}
//           `}
//         >
//           <span className="text-xl mr-4">{item.icon}</span>
//           {!isSidebarCollapsed && (
//             <>
//               <span className="flex-1">{item.title}</span>
//               {activeItemId === item.id && (
//                 <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
//               )}
//             </>
//           )}
//         </Link>
//       </div>
//     ));
//   };

//   const renderEmptyState = () => {
//     if (isLoadingItems) {
//       return (
//         <div className="px-4 py-8 text-center">
//           <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
//           {!isSidebarCollapsed && (
//             <p className="text-sm text-gray-500">Loading menu roles...</p>
//           )}
//         </div>
//       );
//     }

//     if (dynamicSidebarItems?.length === 0) {
//       return (
//         <div className="px-4 py-8 text-center">
//           <div className="text-4xl mb-3">📋</div>
//           {!isSidebarCollapsed && (
//             <div>
//               <p className="text-sm font-medium text-gray-600 mb-1">No menu roles</p>
//               <p className="text-xs text-gray-400">Additional menu roles will appear here when configured</p>
//             </div>
//           )}
//         </div>
//       );
//     }

//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 overflow-hidden">
//       {/* Decorative shape (light neutral) */}
//       <div className="fixed inset-0 z-0 pointer-events-none">
//         <div className="absolute -top-32 -right-44 w-96 h-96 bg-gray-100 opacity-70 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-28 -left-32 w-96 h-96 bg-gray-200 opacity-80 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 flex h-screen">
//         {/* Sidebar */}
//         <div className={`
//           bg-white shadow-xl py-6 border-r border-gray-200 
//           transition-all duration-400 ease-in-out
//           ${isSidebarCollapsed ? 'w-20' : 'w-72'}
//           flex flex-col
//         `}>
//           {/* Logo Section */}
//           <div className="h-18 flex items-center justify-between px-6 py-4">
//             <div className="flex items-center space-x-4">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold text-xl shadow-md">
//                 {companyData?.logo ? (
//                   <img src={companyData.logo} alt="Company Logo" className="w-full h-full object-cover" />
//                 ) : (
//                   'J'
//                 )}
//               </div>
//               {!isSidebarCollapsed && (
//                 <div>
//                   <h1 className="text-lg font-bold text-gray-900">{companyData?.name || 'Company'}</h1>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//             {/* Static Dashboard Item */}
//             <div className="group relative">
//               <Link
//                 href={staticDashboardItem.path}
//                 onClick={() => setActiveItem(staticDashboardItem.id)}
//                 className={`
//                   flex items-center px-4 py-3 rounded-2xl text-sm font-semibold
//                   transition-all duration-200 overflow-hidden
//                   ${activeItemId === staticDashboardItem.id
//                     ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow scale-105'
//                     : 'text-gray-800 hover:bg-gray-100 hover:text-black'}
//                 `}
//               >
//                 <span className="text-xl mr-4">{staticDashboardItem.icon}</span>
//                 {!isSidebarCollapsed && (
//                   <>
//                     <span className="flex-1">{staticDashboardItem.title}</span>
//                     {activeItemId === staticDashboardItem.id && (
//                       <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </>
//                 )}
//               </Link>
//             </div>

//             {/* Divider if there are dynamic items */}
//             {dynamicSidebarItems?.length > 0 && (
//               <div className="px-4 py-2">
//                 <div className="border-t border-gray-200"></div>
//               </div>
//             )}

//             {/* Dynamic Sidebar Items */}
//             {dynamicSidebarItems?.map((item, index) => (
//               <div key={index} className="group relative">
//                 <Link
//                   href="/logo"
//                   onClick={() => setActiveItem(item._id)}
//                   className={`
//                     flex items-center px-4 py-3 rounded-2xl text-sm font-semibold
//                     transition-all duration-200 overflow-hidden
//                     ${activeItemId === item._id
//                       ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow scale-105'
//                       : 'text-gray-800 hover:bg-gray-100 hover:text-black'}
//                   `}
//                 >
//                   <span className="text-xl mr-4">📊</span>
//                   {!isSidebarCollapsed && (
//                     <>
//                       <span className="flex-1">{item.title}</span>
//                       {activeItemId === item._id && (
//                         <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                       )}
//                     </>
//                   )}
//                 </Link>
//               </div>
//             ))}

//             {/* Empty State */}
//             {renderEmptyState()}
//           </nav>

//           {/* User Section */}
//           <div className="p-4 mt-auto">
//             <div className="bg-gray-100/90 backdrop-blur rounded-2xl p-4 shadow border border-gray-200">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg">
//                   👤
//                 </div>
//                 {!isSidebarCollapsed && (
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-bold text-gray-900 truncate">{companyData?.username || 'Admin'}</p>
//                     <p className="text-xs text-gray-400 truncate">{companyData?.email || 'admin@company.com'}</p>
//                   </div>
//                 )}
//               </div>
//               {!isSidebarCollapsed && (
//                 <button
//                   onClick={handleLogout}
//                   className="w-full mt-4 flex items-center justify-center px-4 py-2.5 text-sm text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-xl transition-all duration-300 font-semibold"
//                 >
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                       d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                   </svg>
//                   Log Out
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Main Section */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Top Navigation Bar */}
//           <header className="bg-white shadow border-b border-gray-200">
//             <div className="flex items-center justify-between h-20 px-8">
//               <div className="flex items-center space-x-6">
//                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
//                   Admin Dashboard
//                 </h2>
//               </div>
//               <div className="flex items-center space-x-6">
//                 {/* Action buttons */}
//                 <div className="flex items-center space-x-2">
//                   {/* Profile */}
//                   <button className="flex items-center space-x-3 bg-gray-100 rounded-2xl p-2 pr-4 hover:scale-105 text-gray-900">
//                     <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center text-gray-700 shadow-lg">
//                       👤
//                     </div>
//                     <div className="hidden lg:block text-left">
//                       <p className="text-sm font-bold">Admin</p>
//                       <p className="text-xs text-gray-400">Online</p>
//                     </div>
//                     <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* Main Page Content */}
//           <main className="flex-1 overflow-auto">
//             <div className="min-h-full bg-white p-8">
//               {children}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  const router=useRouter();
  const staticDashboardItem = { 
    id: 'dashboard', 
    title: 'Dashboard', 
    icon: '📊', 
    path: '/updated-admin', 
    active: true 
  };

  // Random icons pool for dynamic items
  const iconPool = [
    '👥', '📈', '💼', '🎯', '📋', '⚙️', '🔍', '📊', '💡', '🚀',
    '📝', '🎨', '💰', '📞', '🏢', '🔧', '📱', '💻', '🌟', '🎪',
    '🎭', '🎪', '🎨', '🎯', '🎲', '🎵', '🎬', '🎮', '🎯', '🎪'
  ];

  const [dynamicSidebarItems, setDynamicSidebarItems] = useState([]);
  const [activeItemId, setActiveItemId] = useState('dashboard');
  const [companyData, setCompanyData] = useState();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [Id, setId] = useState();

  // Function to get random icon
  const getRandomIcon = (index) => {
    return iconPool[index % iconPool.length];
  };

  useEffect(() => {
    const data = localStorage.getItem('user');
    const userdata = JSON.parse(data);
    if(userdata){
             if(userdata.role!='company-admin'){
          router.replace('/new-login'); 
        }

        }
        else{
             router.replace('/new-login'); 
        }
    console.log("asdf", userdata)
    setId(userdata?.id);
  }, [])
 const getDynamicRoutePath = (title) => {
    // Convert title to lowercase and replace spaces with hyphens
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    return `/updated-admin/${slug}`;
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/superAdmin/fetchById/${Id}`);
      const newdata = await res.json();
      console.log(newdata.superAdmin);
      if(newdata.superAdmin?.status=="Inactive"){
        router.push('/deactivate')
      }
      setCompanyData(newdata.superAdmin);
      console.log(newdata.superAdmin?.workerRole);
      const dd = newdata.superAdmin?.workerRole;
      
      // Add random icons to dynamic items
      const itemsWithIcons = dd?.map((item, index) => ({
        ...item,
        icon: getRandomIcon(index)
      })) || [];
      
      setDynamicSidebarItems(itemsWithIcons);
      console.log(dd?.length);
      setIsLoadingItems(false);
    }
    fetchData();
  }, [Id])

  const setActiveItem = (id) => {
    setActiveItemId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/new-login');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderEmptyState = () => {
    if (isLoadingItems) {
      return (
        <div className="px-4 py-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"></div>
              <div className="absolute inset-0 animate-ping w-8 h-8 border border-blue-300 rounded-full opacity-20"></div>
            </div>
            {!isSidebarCollapsed && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Loading roles...</p>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (dynamicSidebarItems?.length === 0) {
      return (
        <div className="px-4 py-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="text-4xl opacity-50 animate-pulse">📋</div>
            {!isSidebarCollapsed && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">No additional roles</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  New menu items will appear here when roles are configured
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Enhanced Decorative Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-200 to-cyan-200 opacity-25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 opacity-20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Enhanced Sidebar */}
        <div className={`
          bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50
          transition-all duration-500 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-80'}
          flex flex-col relative
        `}>
        
         

          {/* Logo Section */}
          <div className="h-20 flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {companyData?.logo ? (
                  <img src={companyData.logo} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  'J'
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="transition-all duration-300">
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">{companyData?.name || 'Company'}</h1>
                  
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Static Dashboard Item with Enhanced Styling */}
            <div className="group relative">
              <Link
                href={staticDashboardItem.path}
                onClick={() => setActiveItem(staticDashboardItem.id)}
                className={`
                  flex items-center px-4 py-4 rounded-2xl text-sm font-semibold
                  transition-all duration-300 overflow-hidden relative
                  ${activeItemId === staticDashboardItem.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:scale-102'}
                  group-hover:shadow-md
                `}
              >
                <div className="flex items-center space-x-4 w-full">
                  <span className={`text-2xl transition-all duration-300 ${activeItemId === staticDashboardItem.id ? 'animate-pulse' : 'group-hover:scale-110'}`}>
                    {staticDashboardItem.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1 font-semibold">{staticDashboardItem.title}</span>
                      {activeItemId === staticDashboardItem.id && (
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      )}
                    </>
                  )}
                </div>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </Link>
              {/* Tooltip for collapsed state */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                  {staticDashboardItem.title}
                </div>
              )}
            </div>

            {/* Enhanced Divider */}
            {dynamicSidebarItems?.length > 0 && (
              <div className="px-4 py-3">
                <div className="border-t border-gradient-to-r from-transparent via-gray-300 to-transparent relative">
                  {!isSidebarCollapsed && (
                    <span className="absolute -top-2 left-1/2  -translate-x-1/2 bg-white px-3 text-xs text-gray-500 font-medium">
                      Roles
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Dynamic Sidebar Items */}
            {dynamicSidebarItems?.map((item, index) => (
              <div key={item._id || index} className="group relative">
                <Link
                href={getDynamicRoutePath(item.title)}
                  onClick={() => setActiveItem(item._id)}
                  className={`
                    flex items-center px-4 py-4 rounded-2xl text-sm font-semibold
                    transition-all duration-300 overflow-hidden relative
                    ${activeItemId === item._id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:scale-102'}
                    group-hover:shadow-md
                  `}
                >
                  <div className="flex items-center space-x-4 w-full">
                    <span className={`text-2xl transition-all duration-300 ${activeItemId === item._id ? 'animate-pulse' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1 font-semibold capitalize">{item.title}</span>
                        {activeItemId === item._id && (
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                      </>
                    )}
                  </div>
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Link>
                {/* Tooltip for collapsed state */}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 capitalize">
                    {item.title}
                  </div>
                )}
              </div>
            ))}

            {/* Enhanced Empty State */}
            {renderEmptyState()}
          </nav>

          {/* Enhanced User Section */}
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  👤
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{companyData?.username || 'Admin'}</p>
                    <p className="text-xs text-gray-500 truncate">{companyData?.email || 'admin@company.com'}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 ml-1 font-medium">Online</span>
                    </div>
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && (
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 flex items-center justify-center px-4 py-3 text-sm text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 font-semibold border border-red-200 hover:border-red-500 hover:shadow-lg hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Top Navigation Bar */}
          <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
            <div className="flex items-center justify-between h-20 px-8">
              <div className="flex items-center space-x-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Admin Dashboard
                </h2>
               
              </div>
              <div className="flex items-center space-x-6">
                {/* Enhanced Action buttons */}
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  
                  
                  {/* Profile */}
                  <button className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-2 pr-4 hover:scale-105 text-gray-900 transition-all duration-300 hover:shadow-lg border border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      👤
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-bold">Admin</p>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="min-h-full bg-white/50 backdrop-blur-sm p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}