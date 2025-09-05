"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

// Default dummy logo (embedded SVG as a data URL)
const logoDataUrl =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
    <defs>
      <radialGradient id='g' cx='50%' cy='50%' r='50%'>
        <stop offset='0%' stop-color='#60a5fa'/>
        <stop offset='100%' stop-color='#2563eb'/>
      </radialGradient>
    </defs>
    <rect width='96' height='96' rx='20' fill='url(#g)'/>
    <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='28' font-weight='700' fill='white'>LOGO</text>
  </svg>
`);

export default function Home() {
  const [url, setUrl] = useState("https://example.com");
  const [logoSrc, setLogoSrc] = useState(logoDataUrl);
  const canvasRef = useRef<HTMLAnchorElement>(null);

  const downloadPng = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const onLogoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">QR Generator with Center Logo</h1>
          <p className="text-gray-600 mt-2">Scans/opens to your URL. Click the QR to open as well.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="bg-white rounded-2xl shadow p-5 space-y-4">
            <label className="block text-sm font-medium text-gray-700">Destination URL</label>
            <input
              type="url"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://your-site.com/page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700">Center logo (optional)</label>
              <input type="file" accept="image/*" onChange={onLogoPick} className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">Keeps a small image in the center of the QR. Defaults to a dummy logo.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={downloadPng}
                className="rounded-2xl bg-indigo-600 text-white px-4 py-2 shadow hover:bg-indigo-700 transition"
              >
                Download PNG
              </button>
              <a
                href={url || "#"}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-300 px-4 py-2 hover:bg-gray-100 transition"
              >
                Open URL
              </a>
            </div>
          </div>

          {/* QR Preview */}
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-center justify-center">
            <a href={url || "#"} target="_blank" rel="noreferrer" ref={canvasRef} className="group">
              <QRCodeCanvas
                value={url || ""}
                size={280}
                level="H" // high error correction so logo doesn't break it
                includeMargin={true}
                imageSettings={{
                  src: logoSrc,
                  height: 56,
                  width: 56,
                  excavate: true, // cut out the background under the logo
                }}
              />
              <div className="text-center text-sm text-gray-500 mt-3 group-hover:underline">
                Click the QR to open the URL
              </div>
            </a>
          </div>
        </div>

      
      </div>
    </div>
  );
}
