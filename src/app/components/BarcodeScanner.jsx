"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Scan, RefreshCw, AlertCircle } from 'lucide-react';

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
    const [error, setError] = useState(null);
    const html5QrCodeRef = useRef(null);
    const scannerId = "reader";

    useEffect(() => {
        const config = { 
            fps: 10, 
            qrbox: (viewfinderWidth, viewfinderHeight) => {
                // Adjusting qrbox for 1D barcodes (wider, shorter)
                return { 
                    width: viewfinderWidth * 0.8, 
                    height: viewfinderHeight * 0.4 
                };
            },
            aspectRatio: 1.0,
            formatsToSupport: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ] // All 1D/2D formats
        };

        const html5QrCode = new Html5Qrcode(scannerId);
        html5QrCodeRef.current = html5QrCode;

        const startScanner = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: "environment" }, 
                    config, 
                    (decodedText, decodedResult) => {
                        console.log("Scanned text:", decodedText);
                        stopScanner().then(() => {
                            onScanSuccess(decodedText);
                        });
                    },
                    (errorMessage) => {
                        // ignore failures
                    }
                );
            } catch (err) {
                console.error("Starting scanner failed:", err);
                setError("Unable to access back camera. Please ensure permissions are granted.");
            }
        };

        const stopScanner = async () => {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                try {
                    await html5QrCodeRef.current.stop();
                } catch (err) {
                    console.error("Stopping scanner failed:", err);
                }
            }
        };

        startScanner();

        return () => {
            stopScanner();
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
