"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Scan, RefreshCw } from 'lucide-react';

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
    const scannerRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            // Add barcode formats you want to support
            formatsToSupport: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ] // All formats
        }, false);

        function onScanSuccessInternal(decodedText, decodedResult) {
            console.log(`Scan Result: ${decodedText}`, decodedResult);
            scanner.clear().then(() => {
                onScanSuccess(decodedText);
            }).catch(error => {
                console.error("Failed to clear scanner", error);
                onScanSuccess(decodedText);
            });
        }

        function onScanFailure(error) {
            // This is called for every frame where no code is detected.
            // We usually don't want to log this but can if needed for debugging.
        }

        scanner.render(onScanSuccessInternal, onScanFailure);

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear scanner on unmount", error);
            });
        }
    }, [onScanSuccess]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Scan className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-wide">Scan Equipment</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scanner Content */}
                <div className="p-6">
                    <div className="relative group">
                        <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-dashed border-gray-200"></div>
                        
                        {/* Overlay with instructions */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                                    <RefreshCw className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-blue-900">Position the Barcode</p>
                                    <p className="text-xs text-blue-700 leading-relaxed mt-1">
                                        Align the equipment's barcode or QR code within the highlighted scanning area.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-center border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                        Camera access required for scanning
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BarcodeScanner;
