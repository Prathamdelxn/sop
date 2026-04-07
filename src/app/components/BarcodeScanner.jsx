// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import { X, Scan, RefreshCw, AlertCircle } from 'lucide-react';

// const BarcodeScanner = ({ onScanSuccess, onClose }) => {
//     const [error, setError] = useState(null);
//     const html5QrCodeRef = useRef(null);
//     const scannerId = "reader";

//     useEffect(() => {
//         const config = {
//             fps: 15,
//             qrbox: (viewfinderWidth, viewfinderHeight) => {
//                 // Adjusting qrbox for 1D barcodes (wider, shorter)
//                 return {
//                     width: viewfinderWidth * 0.8,
//                     height: viewfinderHeight * 0.4
//                 };
//             },
//             aspectRatio: 1.0,
//             formatsToSupport: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] // All 1D/2D formats
//         };

//         const html5QrCode = new Html5Qrcode(scannerId);
//         html5QrCodeRef.current = html5QrCode;

//         const startScanner = async () => {
//             try {
//                 await html5QrCode.start(
//                     { facingMode: "environment" },
//                     config,
//                     (decodedText, decodedResult) => {
//                         console.log("Scanned text:", decodedText);
//                         stopScanner().then(() => {
//                             onScanSuccess(decodedText);
//                         });
//                     },
//                     (errorMessage) => {
//                         // ignore failures
//                     }
//                 );
//             } catch (err) {
//                 console.error("Starting scanner failed:", err);
//                 setError("Unable to access back camera. Please ensure permissions are granted.");
//             }
//         };

//         const stopScanner = async () => {
//             if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
//                 try {
//                     await html5QrCodeRef.current.stop();
//                 } catch (err) {
//                     console.error("Stopping scanner failed:", err);
//                 }
//             }
//         };

//         startScanner();

//         return () => {
//             stopScanner();
//         }
//     }, [onScanSuccess]);

//     return (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
//             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
//                 {/* Header */}
//                 <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 bg-white/20 rounded-xl">
//                             <Scan className="w-5 h-5 text-white" />
//                         </div>
//                         <h2 className="text-lg font-bold text-white tracking-wide">Scan Equipment</h2>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
//                     >
//                         <X className="w-5 h-5" />
//                     </button>
//                 </div>

//                 {/* Scanner Content */}
//                 <div className="p-6">
//                     <div className="relative group">
//                         <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-dashed border-gray-200"></div>

//                         {/* Overlay with instructions */}
//                         <div className="mt-6 space-y-3">
//                             <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
//                                 <div className="p-2 bg-blue-100 rounded-lg shrink-0">
//                                     <RefreshCw className="w-4 h-4 text-blue-600" />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-semibold text-blue-900">Position the Barcode</p>
//                                     <p className="text-xs text-blue-700 leading-relaxed mt-1">
//                                         Align the equipment's barcode or QR code within the highlighted scanning area.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {error && (
//                         <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
//                             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
//                             {error}
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <div className="px-6 py-4 bg-gray-50 flex items-center justify-center border-t border-gray-100">
//                     <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">
//                         Camera access required for scanning
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BarcodeScanner;




"use client";
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, Scan, RefreshCw } from "lucide-react";

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
    const [error, setError] = useState(null);
    const html5QrCodeRef = useRef(null);
    const scannerId = "reader";
    const scannedRef = useRef(false);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode(scannerId);
        html5QrCodeRef.current = html5QrCode;

        const config = {
            fps: 15,
            qrbox: (w, h) => ({
                width: w * 0.9,
                height: 120 // 🔥 ideal for barcode
            }),
            aspectRatio: 1.777, // 🔥 rectangular view
            formatsToSupport: [
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8
            ]
        };

        const startScanner = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();

                if (!devices || devices.length === 0) {
                    setError("No camera found on this device");
                    return;
                }

                // Prefer back camera
                const backCamera = devices.find(d =>
                    d.label.toLowerCase().includes("back")
                );

                const cameraId = backCamera?.id || devices[0].id;

                await html5QrCode.start(
                    cameraId,
                    config,
                    (decodedText) => {
                        if (scannedRef.current) return;
                        scannedRef.current = true;

                        console.log("✅ Scanned:", decodedText);

                        // optional vibration (mobile UX boost)
                        if (navigator.vibrate) {
                            navigator.vibrate(200);
                        }

                        stopScanner().then(() => {
                            onScanSuccess(decodedText);
                        });
                    },
                    () => { }
                );
            } catch (err) {
                console.error("Camera start error:", err);
                setError("Camera failed. Use HTTPS & allow permissions.");
            }
        };

        const stopScanner = async () => {
            try {
                if (html5QrCodeRef.current?.isScanning) {
                    await html5QrCodeRef.current.stop();
                    await html5QrCodeRef.current.clear();
                }
            } catch (err) {
                console.error("Stop failed:", err);
            }
        };

        startScanner();

        return () => {
            stopScanner();
        };
    }, [onScanSuccess]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Scan className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white">
                            Scan Equipment
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scanner */}
                <div className="p-6">
                    <div id="reader" className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-200" />

                    {/* Instruction */}
                    <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <RefreshCw className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-blue-900">
                                Align Barcode Properly
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                Keep barcode horizontal inside the scanning line.
                            </p>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 text-center text-xs text-gray-400">
                    Camera permission required
                </div>
            </div>
        </div>
    );
};

export default BarcodeScanner;