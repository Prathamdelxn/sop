"use client";
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Scan, RefreshCw, AlertCircle, Camera } from "lucide-react";

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
    const [error, setError] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [currentCamera, setCurrentCamera] = useState(null);
    const scannerRef = useRef(null);
    const containerId = "html5-qrcode-scanner";
    const isMounted = useRef(true);

    // Check and request camera permissions
    const requestCameraPermission = async () => {
        try {
            setIsRequestingPermission(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            // Stop the stream immediately after getting permission
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (err) {
            console.error("Permission error:", err);
            if (err.name === "NotAllowedError") {
                setError("Camera permission denied. Please allow camera access in your browser settings and refresh the page.");
            } else if (err.name === "NotFoundError") {
                setError("No camera found on this device.");
            } else {
                setError("Unable to access camera. Please check your camera settings.");
            }
            return false;
        } finally {
            setIsRequestingPermission(false);
        }
    };

    // Get available cameras
    const getCameras = async () => {
        try {
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length > 0) {
                setCameras(devices);
                // Prefer back camera
                const backCamera = devices.find(device =>
                    device.label.toLowerCase().includes("back") ||
                    device.label.toLowerCase().includes("rear") ||
                    device.label.toLowerCase().includes("environment")
                );
                setCurrentCamera(backCamera || devices[0]);
                return true;
            } else {
                setError("No cameras detected on this device.");
                return false;
            }
        } catch (err) {
            console.error("Error getting cameras:", err);
            setError("Failed to detect cameras. Please ensure camera permissions are granted.");
            return false;
        }
    };

    // Initialize and start scanner
    const startScanner = async () => {
        if (!currentCamera || !isMounted.current) return;

        try {
            // Clean up existing scanner
            if (scannerRef.current) {
                try {
                    await scannerRef.current.stop();
                    await scannerRef.current.clear();
                } catch (err) {
                    console.log("Cleanup error:", err);
                }
                scannerRef.current = null;
            }

            // Wait for container to be ready
            const container = document.getElementById(containerId);
            if (!container) {
                setTimeout(() => startScanner(), 100);
                return;
            }

            const scanner = new Html5Qrcode(containerId);
            scannerRef.current = scanner;

            const config = {
                fps: 10,
                qrbox: { width: 280, height: 100 },
                aspectRatio: 1.0,
                disableFlip: false,
                verbose: false,
            };

            await scanner.start(
                currentCamera.id,
                config,
                (decodedText) => {
                    if (!isMounted.current) return;

                    console.log("✅ Scanned:", decodedText);
                    setIsScanning(true);

                    // Vibration feedback if available
                    if (navigator.vibrate) {
                        navigator.vibrate(200);
                    }

                    // Stop scanner and call success callback
                    stopScanner().then(() => {
                        if (isMounted.current) {
                            onScanSuccess(decodedText);
                        }
                    });
                },
                (errorMessage) => {
                    // Silent failure for normal scanning errors
                    if (errorMessage && errorMessage.includes("NoMultiFormat")) {
                        // This is normal, ignore
                    }
                }
            );

            setError(null);
        } catch (err) {
            console.error("Start scanner error:", err);
            if (isMounted.current) {
                setError(`Failed to start scanner: ${err.message || "Unknown error"}`);
            }
        }
    };

    const stopScanner = async () => {
        try {
            if (scannerRef.current && scannerRef.current.isScanning) {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
                scannerRef.current = null;
            }
        } catch (err) {
            console.error("Stop scanner error:", err);
        }
    };

    const switchCamera = async () => {
        if (cameras.length <= 1) return;

        const currentIndex = cameras.findIndex(c => c.id === currentCamera?.id);
        const nextIndex = (currentIndex + 1) % cameras.length;
        setCurrentCamera(cameras[nextIndex]);
    };

    const retryScanner = async () => {
        setError(null);
        setIsScanning(false);
        await stopScanner();

        // Re-request permissions and restart
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
            const hasCameras = await getCameras();
            if (hasCameras) {
                await startScanner();
            }
        }
    };

    // Initialize scanner on mount
    useEffect(() => {
        isMounted.current = true;

        const init = async () => {
            const hasPermission = await requestCameraPermission();
            if (hasPermission) {
                const hasCameras = await getCameras();
                if (hasCameras && currentCamera) {
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        if (isMounted.current) {
                            startScanner();
                        }
                    }, 500);
                }
            }
        };

        init();

        return () => {
            isMounted.current = false;
            stopScanner();
        };
    }, []);

    // Restart scanner when camera changes
    useEffect(() => {
        if (currentCamera && !error && isMounted.current) {
            startScanner();
        }
    }, [currentCamera]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Scan className="w-4 h-4 text-white" />
                            <h2 className="text-base font-semibold text-white">
                                Scan Equipment Barcode
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isScanning}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Scanner Container */}
                <div className="relative bg-black" style={{ minHeight: "400px" }}>
                    <div id={containerId} className="w-full" style={{ minHeight: "400px" }}></div>

                    {/* Scanning Guide Overlay */}
                    {!error && !isRequestingPermission && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-black/40">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative">
                                        <div className="w-72 h-24 border-2 border-blue-400 rounded-lg">
                                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400"></div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400"></div>
                                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400"></div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400"></div>
                                        </div>
                                        {/* Scanning Line */}
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400 animate-scan"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Camera Switch Button */}
                    {cameras.length > 1 && !error && !isRequestingPermission && (
                        <button
                            onClick={switchCamera}
                            className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                            <Camera className="w-5 h-5 text-white" />
                        </button>
                    )}

                    {/* Loading Overlay */}
                    {isRequestingPermission && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-white text-sm">Requesting camera permission...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="p-5 space-y-4">
                    {!error && !isRequestingPermission && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                                <RefreshCw className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-900">
                                        Position Barcode in Frame
                                    </p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Keep the barcode centered within the blue rectangle. The scanner will automatically detect and redirect.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scanning Status */}
                    {isScanning && !error && (
                        <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm text-green-700 font-medium">
                                Barcode detected! Redirecting to task...
                            </p>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-red-800 mb-2">
                                        Camera Access Error
                                    </p>
                                    <p className="text-sm text-red-700 mb-3">
                                        {error}
                                    </p>
                                    <div className="bg-red-100/50 rounded-lg p-3 mb-3">
                                        <p className="text-xs font-semibold text-red-800 mb-2">
                                            Troubleshooting Steps:
                                        </p>
                                        <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                                            <li>Click the camera icon in your browser's address bar</li>
                                            <li>Select "Allow" for camera access</li>
                                            <li>Refresh the page after allowing permission</li>
                                            <li>Make sure you're using HTTPS (required for camera access)</li>
                                            <li>Close other applications that might be using the camera</li>
                                        </ul>
                                    </div>
                                    <button
                                        onClick={retryScanner}
                                        className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-center text-xs text-gray-400">
                        Camera access required • Works with all barcode types
                    </p>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx global>{`
                @keyframes scan {
                    0% {
                        top: 0;
                    }
                    100% {
                        top: 100%;
                    }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default BarcodeScanner;