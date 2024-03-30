'use client'
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please upload an audio file.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('http://localhost:7000/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setTranscription(result.transcription);
    } catch (error) {
      console.error('Error during transcription:', error);
      alert('Error during transcription. Check the console for more information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' , marginLeft:'500px', marginTop:'100px'}}>Audio to Text Converter</h1>
      <form onSubmit={handleSubmit} style={{ marginLeft:'450px', marginTop:'50px' }}>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileChange} 
          style={{ 
            display: 'block', 
            marginBottom: '10px', 
            width: '300px', 
            border: '1px solid #ccc', 
            padding: '5px' 
          }} 
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          style={{ 
            background: '#007bff', 
            color: 'white', 
            padding: '10px 15px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            opacity: isLoading ? 0.7 : 1 
          }}>
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {transcription && (
        <div style={{ marginTop: '20px', border: '1px solid #eee', padding: '20px', borderRadius: '5px' }}>
          <h2 style={{ color: '#333' }}>Transcription Result:</h2>
          <p style={{ whiteSpace: 'pre-wrap', color: '#666' }}>{transcription}</p>
        </div>
      )}
    </div>
  );
}
  