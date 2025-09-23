"use client";

import React, { useState } from 'react'

function Page() {
  const [input, setInput] = useState<string>('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  
  // State for dynamic form management
  const [personalInfo, setPersonalInfo] = useState<{[key: string]: string}>({})
  const [skills, setSkills] = useState<string[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [education, setEducation] = useState<any[]>([])

  // Initialize form data when result changes
  React.useEffect(() => {
    if (result?.parsed_data) {
      setPersonalInfo(result.parsed_data.personal_information || {})
      setSkills(result.parsed_data.skills || [])
      setProjects(result.parsed_data.projects || [])
      setLanguages(result.parsed_data.languages || [])
      setEducation(result.parsed_data.education || [])
    }
  }, [result])

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
        <h1 className='text-lg font-bold'>Portfolio to CV</h1>
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
        
        {result && result.error && (
          <div className='mt-4 w-full max-w-2xl'>
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
              {result.error}
            </div>
          </div>
        )}

        {result && !result.error && (
          <div className='mt-4 w-full max-w-2xl'>
            <h3 className='text-lg font-semibold mb-2'>API Response:</h3>
            <pre className='bg-gray-100 p-4 overflow-x-auto text-xs border rounded'>
              {JSON.stringify(result, null, 2)}
            </pre>
            <div className='mt-2 text-sm text-gray-600'>
              <p>Available keys: {Object.keys(result).join(', ')}</p>
              <p>Has personal_information: {result.parsed_data?.personal_information ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </div>

      <div className='flex flex-col items-center justify-center py-2'>
        <h1 className='text-4xl font-bold'>Convert Your Portfolio Website to CV</h1>
        <p className='mt-4 text-lg'>Developed by Kcodz</p>
      </div>

      {/* Show CV editor if result exists and has data - more flexible condition */}
      {result && !result.error && result.parsed_data && (
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edit CV</h1>

          {/* Personal Information */}
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <div className="space-y-2">
            {Object.entries(personalInfo).map(([key, value], index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="border p-2 flex-1"
                  value={key}
                  onChange={(e) => {
                    const newPersonalInfo = { ...personalInfo }
                    delete newPersonalInfo[key]
                    newPersonalInfo[e.target.value] = value
                    setPersonalInfo(newPersonalInfo)
                  }}
                  placeholder="Field name (e.g., name, email)"
                />
                <input
                  type="text"
                  className="border p-2 flex-1"
                  value={value}
                  onChange={(e) => {
                    setPersonalInfo({ ...personalInfo, [key]: e.target.value })
                  }}
                  placeholder="Value"
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    const newPersonalInfo = { ...personalInfo }
                    delete newPersonalInfo[key]
                    setPersonalInfo(newPersonalInfo)
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setPersonalInfo({ ...personalInfo, '': '' })}
            >
              + Add Personal Info
            </button>
          </div>

          {/* Professional Summary */}
          <h2 className="text-xl font-semibold mt-6">Professional Summary</h2>
          <textarea
            className="border p-2 w-full my-2 h-24"
            defaultValue={result.parsed_data.professional_summary || ''}
            placeholder="Professional summary..."
          />

          {/* Skills */}
          <h2 className="text-xl font-semibold mt-6">Skills</h2>
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="border p-2 flex-1"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...skills]
                    newSkills[index] = e.target.value
                    setSkills(newSkills)
                  }}
                  placeholder={`Skill ${index + 1}`}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    const newSkills = skills.filter((_, i) => i !== index)
                    setSkills(newSkills)
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setSkills([...skills, ''])}
            >
              + Add Skill
            </button>
          </div>

          {/* Education */}
          {result.parsed_data.education && Array.isArray(result.parsed_data.education) && (
            <>
              <h2 className="text-xl font-semibold mt-6">Education</h2>
              {result.parsed_data.education.map((edu: any, index: number) => (
                <div key={index} className="border p-4 my-2 rounded bg-gray-50">
                  <h3 className="font-medium mb-2">Education {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      className="border p-2 w-full my-1"
                      defaultValue={edu?.degree || ''}
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      className="border p-2 w-full my-1"
                      defaultValue={edu?.institution || ''}
                      placeholder="Institution"
                    />
                    <input
                      type="text"
                      className="border p-2 w-full my-1"
                      defaultValue={edu?.graduation_year || ''}
                      placeholder="Graduation Year"
                    />
                    <input
                      type="text"
                      className="border p-2 w-full my-1"
                      defaultValue={edu?.gpa || ''}
                      placeholder="GPA"
                    />
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Projects */}
          <h2 className="text-xl font-semibold mt-6">Projects</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="border p-4 rounded bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Project {index + 1}</h3>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => {
                      const newProjects = projects.filter((_, i) => i !== index)
                      setProjects(newProjects)
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={project.name || ''}
                    onChange={(e) => {
                      const newProjects = [...projects]
                      newProjects[index] = { ...newProjects[index], name: e.target.value }
                      setProjects(newProjects)
                    }}
                    placeholder="Project Name"
                  />
                  <textarea
                    className="border p-2 w-full h-16"
                    value={project.description || ''}
                    onChange={(e) => {
                      const newProjects = [...projects]
                      newProjects[index] = { ...newProjects[index], description: e.target.value }
                      setProjects(newProjects)
                    }}
                    placeholder="Project Description"
                  />
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || ''}
                    onChange={(e) => {
                      const newProjects = [...projects]
                      newProjects[index] = { ...newProjects[index], technologies: e.target.value.split(', ') }
                      setProjects(newProjects)
                    }}
                    placeholder="Technologies (comma separated)"
                  />
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={project.link || ''}
                    onChange={(e) => {
                      const newProjects = [...projects]
                      newProjects[index] = { ...newProjects[index], link: e.target.value }
                      setProjects(newProjects)
                    }}
                    placeholder="Project Link"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setProjects([...projects, { name: '', description: '', technologies: [], link: '' }])}
            >
              + Add Project
            </button>
          </div>

          {/* Languages */}
          <h2 className="text-xl font-semibold mt-6">Languages</h2>
          <div className="space-y-2">
            {languages.map((language, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="border p-2 flex-1"
                  value={language}
                  onChange={(e) => {
                    const newLanguages = [...languages]
                    newLanguages[index] = e.target.value
                    setLanguages(newLanguages)
                  }}
                  placeholder={`Language ${index + 1}`}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    const newLanguages = languages.filter((_, i) => i !== index)
                    setLanguages(newLanguages)
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setLanguages([...languages, ''])}
            >
              + Add Language
            </button>
          </div>

          {/* Work Experience */}
          {result.parsed_data.work_experience && Array.isArray(result.parsed_data.work_experience) && result.parsed_data.work_experience.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6">Work Experience</h2>
              {result.parsed_data.work_experience.map((work: any, index: number) => (
                <div key={index} className="border p-4 my-2 rounded bg-gray-50">
                  <h3 className="font-medium mb-2">Experience {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      className="border p-2 w-full my-1"
                      defaultValue={work?.position || ''}
                      placeholder="Position"
                    />
                    <input
                      type="text"
                      className="border p-2 w-full my-1"
                      defaultValue={work?.company || ''}
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      className="border p-2 w-full my-1"
                      defaultValue={work?.start_date || ''}
                      placeholder="Start Date"
                    />
                    <input
                      type="text"
                      className="border p-2 w-full my-1"
                      defaultValue={work?.end_date || ''}
                      placeholder="End Date"
                    />
                  </div>
                  <textarea
                    className="border p-2 w-full my-1 h-16"
                    defaultValue={work?.description || ''}
                    placeholder="Job Description"
                  />
                </div>
              ))}
            </>
          )}

          {/* Save Button */}
          <div className="mt-8 flex justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold">
              Generate PDF CV
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default Page