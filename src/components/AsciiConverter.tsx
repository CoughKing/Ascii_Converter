import { useState } from 'react';
import axios from 'axios';

export default function AsciiConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(100);
  const [ascii, setAscii] = useState('');

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

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <input
        type="number"
        value={width}
        onChange={e => setWidth(parseInt(e.target.value))}
        className="ml-2 border p-1 w-20"
        min={10}
        max={200}
      />
      <button onClick={handleUpload} className="ml-2 bg-blue-500 text-white px-3 py-1 rounded">
        Convert
      </button>
      <pre className="mt-4 bg-black text-green-500 p-3 overflow-x-auto whitespace-pre-wrap">
        {ascii}
      </pre>
    </div>
  );
}
