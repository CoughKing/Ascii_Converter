import { useState } from 'react';
import axios from 'axios';

export default function AsciiConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(100);
  const [ascii, setAscii] = useState('');
  const [theme, setTheme] = useState({
    backgroundColor: '#000000',
    textColor: '#00ff00', // Default green-on-black
    fontFamily: 'monospace',
    fontSize: '14px'
  });

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', width.toString());
    try {
      const res = await axios.post('http://localhost:8000/api/ascii/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAscii(res.data.ascii);
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    }
  };

  const presetThemes = [
    { name: 'Classic Terminal', colors: { backgroundColor: '#000000', textColor: '#00ff00' } },
    { name: 'Modern Dark', colors: { backgroundColor: '#282c34', textColor: '#98c379' } },
    { name: 'Solarized Light', colors: { backgroundColor: '#fdf6e3', textColor: '#657b83' } },
    { name: 'Matrix', colors: { backgroundColor: '#000000', textColor: '#00ff00' } }
  ];

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      {/* File upload section */}
      <div className="flex items-center gap-2">
        <input 
          type="file" 
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          value={width}
          onChange={e => setWidth(parseInt(e.target.value))}
          min={10}
          max={400}
          className="border rounded px-3 py-2 w-20"
        />
        <button 
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Convert
        </button>
      </div>

      {/* Theme selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Theme:</label>
        <select 
          value={theme.backgroundColor}
          onChange={(e) => {
            const selectedTheme = presetThemes.find(t => t.colors.backgroundColor === e.target.value);
            if (selectedTheme) {
              setTheme(prev => ({ ...prev, ...selectedTheme.colors }));
            }
          }}
          className="border rounded px-3 py-2"
        >
          {presetThemes.map((t) => (
            <option key={t.name} value={t.colors.backgroundColor}>
              {t.name}
            </option>
          ))}
        </select>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Background Color:</label>
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => setTheme(prev => ({
                ...prev,
                backgroundColor: e.target.value
              }))}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Color:</label>
            <input
              type="color"
              value={theme.textColor}
              onChange={(e) => setTheme(prev => ({
                ...prev,
                textColor: e.target.value
              }))}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ASCII art display */}
       <pre 
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: 'monospace',
          fontSize: width > 100 ? `${Math.max(8, 14 - ((width - 100) * 0.05))}px` : '14px', // Scale font size based on width
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          maxWidth: '900px', // Fixed maximum width
          maxHeight: '700px',
          margin: '0 auto'
        }}
      >
        {ascii}
      </pre>
    </div>
  );
}