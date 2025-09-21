import React from 'react'

function page() {
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
            placeholder='Enter your portfolio link to here...'
          ></textarea>
          <button className='bg-blue-500 text-white p-4 ml-2 h-fit self-start'>Generate CV</button>
        </div>
      </div>

      <div className='flex flex-col items-center justify-center  py-2'>
         <h1 className='text-4xl font-bold'>Convert Your Portfolio Website to CV</h1>
         <p className='mt-4 text-lg'>Developed by Kcodz</p>
      </div>
    </main>
  )
}

export default page