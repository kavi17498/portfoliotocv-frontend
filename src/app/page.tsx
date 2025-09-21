"use client";

import React, { useState } from 'react'

function Page() {
  const [input, setInput] = useState<string>('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleButtonClick = async () => {
    if (!input.trim()) {
      setResult({ error: 'Please enter a valid portfolio link.' });
      return;
    }
    
    setLoading(true)
    const url = `http://127.0.0.1:8000/scrape/${encodeURIComponent(input.trim())}?format=json`;
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log(data)
      setResult(data)
    } catch (error) {
      console.error('Fetch error:', error)
      setResult({ error: 'Failed to fetch data. Please check the URL and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <nav className='bg-gray-800 text-white p-4'>
        <h1 className='text-lg font-bold'>CV to Portfolio</h1>
      </nav>

      <div className='flex flex-col items-center justify-center py-4 m-10'>
        <div className='flex flex-row w-full max-w-2xl'>
          <textarea
            className='border border-gray-300 w-full resize-none p-4 h-20'
            rows={4}
            placeholder='Enter your portfolio link here...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          ></textarea>
          <button 
            className={`text-white p-4 ml-2 h-fit self-start ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            onClick={handleButtonClick}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate CV'}
          </button>
        </div>
        
        {result && (
          <div className='mt-4 w-full max-w-2xl'>
            <h3 className='text-lg font-semibold mb-2'>Result:</h3>
            <pre className='bg-gray-100 p-4 overflow-x-auto text-xs border rounded'>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className='flex flex-col items-center justify-center py-2'>
        <h1 className='text-4xl font-bold'>Convert Your Portfolio Website to CV</h1>
        <p className='mt-4 text-lg'>Developed by Kcodz</p>
      </div>
    </main>
  )
}

export default Page