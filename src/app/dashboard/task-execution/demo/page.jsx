
'use client'
import React, { useState } from 'react';

const TaskPage = () => {
    const [tareWeight, setTareWeight] = useState("10.0");
    const [measuredWeight, setMeasuredWeight] = useState("500.0");
    const [remarks, setRemarks] = useState("Within ±0.1% Tolerance");

    return (
        // <div className="w-full p-4  font-sans h-full bg-red-500">
        //     {/* Header */}
        //     <div className="">

        //         <h2 className="text-2xl font-semibold text-gray-700 ">Paracetamol Production</h2>

        //         <div className="flex mt-4 space-x-4 text-sm">
        //             <span className="font-medium text-blue-600 border-b-2 border-blue-600 pb-1">Task View</span>
        //             <span className="text-gray-500 pb-1">Flow View</span>
        //         </div>
        //     </div>
        //     <div className="flex">
        //         {/* Stages Overview */}
        //         <div className="mb-8">
        //             {/* Stage 1 */}
        //             <div className="mb-4">
        //                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Stage 1 Raw Materials</h3>
        //             </div>

        //             {/* Stage 2 */}
        //             <div className="mb-4">
        //                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Stage 2 Mixing and Blending</h3>
        //                 <div className="ml-4 border-l-2 border-gray-300 pl-4">
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        //                         <span className="text-green-700">2.1 Dry Mixing</span>
        //                     </div>
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        //                         <span className="text-green-700">2.2 Wet Granulation</span>
        //                     </div>
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        //                         <span className="text-green-700">2.3 Dry Granules</span>
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Stage 3 */}
        //             <div className="mb-4">
        //                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Stage 3 Milling and Sieving</h3>
        //                 <div className="ml-4 border-l-2 border-gray-300 pl-4">
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        //                         <span className="text-green-700">3.1 Milling Granules to achieve uniformity</span>
        //                     </div>
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        //                         <span className="text-green-700">3.2 Sieving for Uniform Particle Size</span>
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Stage 4 */}
        //             <div className="mb-4">
        //                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Stage 4 Compression</h3>
        //                 <div className="ml-4 border-l-2 border-gray-300 pl-4">
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        //                         <span className="text-green-700">4.1 Tablet Compression</span>
        //                     </div>
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        //                         <span className="text-green-700">4.2 Weight Check</span>
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Stage 5 */}
        //             <div className="mb-4">
        //                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Stage 5 Coating</h3>
        //                 <div className="ml-4 border-l-2 border-gray-300 pl-4">
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
        //                         <span className="text-blue-700 font-medium">5.1 Coating Preparation</span>
        //                     </div>
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
        //                         <span className="text-gray-500">5.2 Tablet Coating</span>
        //                     </div>
        //                     <div className="mb-2 flex items-center">
        //                         <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
        //                         <span className="text-gray-500">5.3 Railing/Safety Guard</span>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //         {/* <div className="border-t border-gray-300 pt-6 mb-6"></div> */}

        //         {/* Current Task */}
        //         <div className="mb-8">
        //             <h2 className="text-xl font-semibold text-gray-800 mb-2">Task 5.1 Coating Preparation</h2>

        //             <div className="bg-gray-100 p-4 rounded-md mb-6">
        //                 <div className="flex justify-between items-center">
        //                     <div>
        //                         <span className="font-medium">Perform Task: NLT 20 min Max Time 30 min</span>
        //                         <span className="mx-2">|</span>
        //                         <span>Assignees: SM PA +9</span>
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Tare Weight Section */}
        //             <div className="mb-6">
        //                 <h3 className="font-medium text-gray-700 mb-2">Enter Container Tared Weight (g)</h3>
        //                 <div className="flex items-center mb-2">
        //                     <input
        //                         type="text"
        //                         value={tareWeight}
        //                         onChange={(e) => setTareWeight(e.target.value)}
        //                         className="border border-gray-300 rounded px-3 py-2 w-32 mr-2 text-right font-mono"
        //                     />
        //                     <span className="text-gray-700">g</span>
        //                 </div>
        //                 <div className="text-sm text-gray-500 mt-1">
        //                     Last updated by Smith Cowell ID: 3124 on May 30, 2024 11:20 AM
        //                 </div>
        //                 <div className="flex items-center mt-1">
        //                     <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
        //                     <span className="text-sm text-gray-600">Self Verified by Smith Cowell, ID: 3124 on May 30, 2024 11:28 AM</span>
        //                 </div>
        //                 <div className="flex items-center mt-1">
        //                     <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
        //                     <span className="text-sm text-gray-600">Peer Verification approved by Mary Johnson, ID: 3520 on May 30, 2024 11:31 AM</span>
        //                 </div>
        //             </div>

        //             <div className="border-t border-gray-300 my-6"></div>

        //             {/* Measured Weight Section */}
        //             <div className="mb-6">
        //                 <h3 className="font-medium text-gray-700 mb-2">Enter Measured Weight (g)</h3>
        //                 <div className="flex items-center mb-2">
        //                     <input
        //                         type="text"
        //                         value={measuredWeight}
        //                         onChange={(e) => setMeasuredWeight(e.target.value)}
        //                         className="border border-gray-300 rounded px-3 py-2 w-32 mr-2 text-right font-mono"
        //                     />
        //                     <span className="text-gray-700">g</span>
        //                 </div>
        //                 <div className="text-sm text-gray-500 mt-1">
        //                     Last updated by Smith Cowell, ID: 3124 on May 30, 2024 11:31 AM
        //                 </div>
        //                 <div className="flex items-center mt-1">
        //                     <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
        //                     <span className="text-sm text-gray-600">Peer Verification approved by Mary Johnson, ID: 3520 on May 30, 2024 11:45 AM</span>
        //                 </div>
        //             </div>

        //             <div className="border-t border-gray-300 my-6"></div>

        //             {/* Remarks Section */}
        //             <div className="mb-6">
        //                 <h3 className="font-medium text-gray-700 mb-2">Remarks (Within ±0.1% Tolerance/Other)</h3>
        //                 <input
        //                     type="text"
        //                     value={remarks}
        //                     onChange={(e) => setRemarks(e.target.value)}
        //                     className="border border-gray-300 rounded px-3 py-2 w-full"
        //                 />
        //                 <div className="text-sm text-gray-500 mt-1">
        //                     Last updated by Smith Cowell, ID: 3124 on May 30, 2024 11:46 AM
        //                 </div>
        //                 <div className="flex items-center mt-1">
        //                     <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
        //                     <span className="text-sm text-gray-600">Self Verified by Smith Cowell, ID: 3124 on May 30, 2024 11:52 AM</span>
        //                 </div>
        //                 <div className="flex items-center mt-1">
        //                     <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
        //                     <span className="text-sm text-gray-600">Peer Verification approved by Mary Johnson, ID: 3520 on May 30, 2024 12:02 AM</span>
        //                 </div>
        //             </div>

        //             {/* Action Buttons */}
        //             <div className="flex space-x-4 mt-8">
        //                 <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition">
        //                     Pause Task
        //                 </button>
        //                 <button className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
        //                     Complete Task
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="w-full h-screen bg-yellow-300">
            asd
        </div>
    );
};

export default TaskPage;