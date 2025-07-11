// // components/BarcodeGenerator.jsx
// import JsBarcode from "jsbarcode";
// import { useEffect, useRef } from "react";
// import { QrCode } from "lucide-react";

// const BarcodeGenerator = ({ text }) => {
//   const svgRef = useRef(null);

//   useEffect(() => {
//     if (svgRef.current && text) {
//       JsBarcode(svgRef.current, text, {
//         format: "CODE128",
//         lineColor: "#111827",
//         width: 2,
//         height: 60,
//         displayValue: true,
//         fontOptions: "bold",
//         font: "monospace",
//         fontSize: 16,
//       });
//     }
//   }, [text]);

//   return (
//     <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 rounded-2xl border border-slate-200">
//       <div className="flex items-center justify-center mb-4">
//         <QrCode className="w-6 h-6 text-slate-600 mr-2" />
//         <span className="text-slate-700 font-medium">Asset Barcode</span>
//       </div>
//       <div className="bg-white p-4 rounded-xl shadow-inner flex justify-center">
//         <svg ref={svgRef}></svg>
//       </div>
//     </div>
//   );
// };

// export default BarcodeGenerator;


// components/BarcodeGenerator.jsx
// import JsBarcode from 'jsbarcode';
// import { useEffect, useRef } from 'react';

// const BarcodeGenerator = ({ text, onGenerated , width = 1.5, height = 60 }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (canvasRef.current && text) {
//       JsBarcode(canvasRef.current, text, {
//         format: 'CODE128',
//         displayValue: false,
//         width: 2,
//         height: 60,
//         background: "#ffffff",
//       });

//       canvasRef.current.toBlob((blob) => {
//         const file = new File([blob], `${text}.png`, { type: 'image/png' });
//         if (onGenerated) onGenerated(file);
//       }, 'image/png');
//     }
//   }, [text, onGenerated]);

//   return <canvas ref={canvasRef} className="mx-auto" />;
// };

// export default BarcodeGenerator;
// components/BarcodeGenerator.jsx
import JsBarcode from 'jsbarcode';
import { useEffect, useRef } from 'react';

const BarcodeGenerator = ({ text, onGenerated, width = 1.5, height = 60 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      JsBarcode(canvasRef.current, text, {
        format: 'CODE128',
        displayValue: false,
        width: width,     // narrower bars
        height: height,   // height of the barcode
        background: "#ffffff",
      });

      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], `${text}.png`, { type: 'image/png' });
        if (onGenerated) onGenerated(file);
      }, 'image/png');
    }
  }, [text, onGenerated, width, height]);

  return <canvas ref={canvasRef} className="mx-auto max-w-xs" />;
};

export default BarcodeGenerator;
