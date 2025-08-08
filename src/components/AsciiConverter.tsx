import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AsciiConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(100);
  const [ascii, setAscii] = useState('');
  const [theme, setTheme] = useState({
    backgroundColor: '#000000',
    textColor: '#00ff00',
    fontFamily: 'monospace',
    fontSize: '14px'
  });
  const [aspectRatio, setAspectRatio] = useState(1);
  const preRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate the optimal font size and container size
  const calculateSizes = () => {
    if (!preRef.current || !containerRef.current || !ascii) return;

    const lines = ascii.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length));
    const lineCount = lines.length;

    // Calculate character size (approximate monospace character aspect ratio)
    const charWidth = 0.6; // Width to height ratio of monospace characters
    const lineHeight = 1.2; // Line height multiplier

    // Get available space in the parent container
    const maxWidth = containerRef.current.offsetWidth - 40; // Account for padding
    const maxHeight = window.innerHeight * 0.7; // 70vh max

    // Calculate possible font sizes based on width and height constraints
    const widthBasedSize = maxWidth / maxLineLength / charWidth;
    const heightBasedSize = maxHeight / lineCount / lineHeight;

    // Use the smaller font size to fit both dimensions
    const fontSize = Math.min(widthBasedSize, heightBasedSize, 24); // 24px max
    const finalFontSize = Math.max(fontSize, 6); // 6px min

    // Calculate actual dimensions of the ASCII art
    const artWidth = maxLineLength * finalFontSize * charWidth;
    const artHeight = lineCount * finalFontSize * lineHeight;

    // Apply the calculated styles
    preRef.current.style.fontSize = `${finalFontSize}px`;
    preRef.current.style.width = `${artWidth}px`;
    preRef.current.style.height = `${artHeight}px`;
    preRef.current.style.lineHeight = `${lineHeight}`;

    setTheme(prev => ({
      ...prev,
      fontSize: `${finalFontSize}px`,
      lineHeight: `${lineHeight}`
    }));
  };

  // Trim whitespace from ASCII art
  const trimAscii = (art: string) => {
    const lines = art.split('\n');
    const trimmedLines = lines.map(line => line.replace(/\s+$/, ''));
    while (trimmedLines.length > 0 && trimmedLines[trimmedLines.length - 1] === '') {
      trimmedLines.pop();
    }
    return trimmedLines.join('\n');
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };

    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', width.toString());
    try {
      const res = await axios.post('http://localhost:8000/api/ascii/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAscii(trimAscii(res.data.ascii));
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

  // Recalculate sizes when ASCII, width, or window changes
  useEffect(() => {
    calculateSizes();
    const handleResize = () => calculateSizes();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ascii, width]);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4" ref={containerRef}>
      {/* File upload section */}
      <div className="flex flex-wrap items-center gap-2">
        <input 
          type="file" 
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="border rounded px-3 py-2 flex-grow"
          accept="image/*"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Width:</label>
          <input
            type="number"
            value={width}
            onChange={e => setWidth(Math.min(400, Math.max(10, parseInt(e.target.value) || 100)))}
            min={10}
            max={400}
            className="border rounded px-3 py-2 w-20"
          />
        </div>
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
        <div className="flex flex-wrap gap-4">
          <select 
            value={presetThemes.findIndex(t => 
              t.colors.backgroundColor === theme.backgroundColor && 
              t.colors.textColor === theme.textColor
            )}
            onChange={(e) => {
              const selectedTheme = presetThemes[parseInt(e.target.value)];
              if (selectedTheme) {
                setTheme(prev => ({ ...prev, ...selectedTheme.colors }));
              }
            }}
            className="border rounded px-3 py-2 flex-grow"
          >
            {presetThemes.map((t, i) => (
              <option key={t.name} value={i}>
                {t.name}
              </option>
            ))}
          </select>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">BG:</label>
              <input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => setTheme(prev => ({
                  ...prev,
                  backgroundColor: e.target.value
                }))}
                className="w-10 h-10 cursor-pointer"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Text:</label>
              <input
                type="color"
                value={theme.textColor}
                onChange={(e) => setTheme(prev => ({
                  ...prev,
                  textColor: e.target.value
                }))}
                className="w-10 h-10 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ASCII art display */}
      <div className="flex justify-center items-center overflow-hidden">
        <pre 
          ref={preRef}
          style={{
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSize,
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            whiteSpace: 'pre',
            margin: '0 auto',
            //lineHeight: theme.lineHeight || '1.2',
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {ascii}
        </pre>
      </div>
      
      {ascii && (
        <div className="text-center text-sm text-gray-500">
          {width} cols × {ascii.split('\n').length} rows • 
          Font: {parseFloat(theme.fontSize)}px
        </div>
      )}
    </div>
  );
}