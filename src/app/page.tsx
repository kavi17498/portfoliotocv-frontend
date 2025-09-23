"use client";

import React, { useState } from 'react'

function Page() {
  const [input, setInput] = useState<string>('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  
  // State for dynamic form management
  const [personalInfo, setPersonalInfo] = useState<{[key: string]: string}>({})
  const [professionalSummary, setProfessionalSummary] = useState<string>('')
  const [skills, setSkills] = useState<string[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [education, setEducation] = useState<any[]>([])
  const [workExperience, setWorkExperience] = useState<any[]>([])
  const [pdfUrl, setPdfUrl] = useState<string>('')

  // Initialize form data when result changes
  React.useEffect(() => {
    if (result?.parsed_data) {
      setPersonalInfo(result.parsed_data.personal_information || {})
      setProfessionalSummary(result.parsed_data.professional_summary || '')
      setSkills(result.parsed_data.skills || [])
      setProjects(result.parsed_data.projects || [])
      setLanguages(result.parsed_data.languages || [])
      setEducation(result.parsed_data.education || [])
      setWorkExperience(result.parsed_data.work_experience || [])
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

  const handleGeneratePDF = async () => {
    try {
      setLoading(true)
      
      // Prepare the CV data in the required format
      const cvData = {
        personal_information: personalInfo,
        professional_summary: professionalSummary,
        skills: skills.filter(skill => skill.trim() !== ''),
        projects: projects.filter(project => 
          project.name && project.name.trim() !== ''
        ).map(project => ({
          name: project.name,
          description: project.description || '',
          technologies: Array.isArray(project.technologies) 
            ? project.technologies.filter((tech: any) => tech && tech.trim() !== '')
            : project.technologies?.split(', ').filter((tech: any) => tech && tech.trim() !== '') || [],
          link: project.link || ''
        })),
        work_experience: workExperience.filter(work => 
          work.position && work.position.trim() !== ''
        ).map(work => ({
          position: work.position,
          company: work.company || '',
          duration: work.duration || `${work.start_date || ''} - ${work.end_date || ''}`,
          start_date: work.start_date || '',
          end_date: work.end_date || '',
          responsibilities: work.responsibilities || [work.description || ''].filter(r => r.trim() !== ''),
          description: work.description || ''
        })),
        education: education.filter(edu => 
          edu.degree && edu.degree.trim() !== ''
        ).map(edu => ({
          degree: edu.degree,
          institution: edu.institution || '',
          graduation_year: edu.graduation_year || '',
          gpa: edu.gpa || ''
        })),
        languages: languages.filter(lang => lang.trim() !== '')
      }

      // Generate filename from personal info
      const name = personalInfo.name || personalInfo.Name || 'CV'
      const filename = name.replace(/[^a-zA-Z0-9]/g, '_') + '_Resume'

      const requestBody = {
        cv_data: cvData,
        filename: filename
      }

      console.log('Sending CV data:', requestBody)

      const response = await fetch('http://127.0.0.1:8000/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Handle PDF response - Show in iframe instead of downloading
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      setPdfUrl(url)

      console.log('PDF generated successfully!')
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-blue-50">
      {/* Modern Header */}
      <nav className='bg-blue-600 text-white p-6 shadow-lg'>
        <div className="max-w-7xl mx-auto">
          <h1 className='text-2xl font-bold tracking-wide'>🚀 Portfolio to CV</h1>
        </div>
      </nav>

      {/* Hero Section with Input */}
      <div className='flex flex-col items-center justify-center py-12 px-6'>
        <div className='w-full max-w-4xl'>
          {/* Animated Card Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 transition-all duration-300 hover:shadow-2xl">
            <div className='flex flex-col lg:flex-row gap-4 items-end'>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Portfolio Website URL
                </label>
                <textarea
                  className='w-full resize-none p-4 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm'
                  rows={3}
                  placeholder='Enter your portfolio website URL (e.g., yourname.com, github.io/portfolio)'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button 
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[160px] ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
                }`}
                onClick={handleButtonClick}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    ✨ Generate CV
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Error Message with Modern Styling */}
        {result && result.error && (
          <div className='mt-6 w-full max-w-4xl'>
            <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm'>
              <div className="text-red-500">❌</div>
              <div>{result.error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Text Section */}
      {!result?.parsed_data && (
        <div className='flex flex-col items-center justify-center py-16 px-6'>
          <div className="text-center max-w-3xl">
            <h1 className='text-5xl lg:text-6xl font-bold text-blue-600 mb-6'>
              Convert Your Portfolio to Professional CV
            </h1>
            <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
              Transform your online portfolio into a stunning, ATS-friendly CV in seconds. 
              <br />Powered by AI technology for the modern job market.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                AI-Powered Analysis
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Professional Templates
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ATS-Friendly Format
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className='text-gray-500'>Developed with ❤️ by <span className="font-semibold text-blue-600">Kcodz</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Modern Split Layout */}
      {result && !result.error && result.parsed_data && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* PDF Preview - Left Side */}
            <div className="xl:w-1/2">
              <div className="sticky top-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      📄 PDF Preview
                    </h2>
                  </div>
                  
                  {pdfUrl ? (
                    <>
                      <iframe
                        src={pdfUrl}
                        width="100%"
                        height="700px"
                        className="border-0"
                        title="CV Preview"
                      />
                      <div className="p-4 bg-gray-50 border-t">
                        <a
                          href={pdfUrl}
                          download={`${(personalInfo.name || personalInfo.Name || 'CV').replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          📥 Download PDF
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="h-96 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <p className="text-lg">Click "Generate PDF CV" to see preview</p>
                        <div className="mt-4 text-sm text-gray-500">
                          Your CV will appear here in real-time
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CV Editor - Right Side */}
            <div className="xl:w-1/2">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="bg-blue-600 text-white p-4 -m-6 mb-6 rounded-t-2xl">
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    ✏️ Edit CV Data
                  </h1>
                </div>

                <div className="space-y-8 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">

                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    👤 Personal Information
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(personalInfo).map(([key, value], index) => (
                      <div key={index} className="flex gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <input
                          type="text"
                          className="flex-1 p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
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
                          className="flex-1 p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                          value={value}
                          onChange={(e) => {
                            setPersonalInfo({ ...personalInfo, [key]: e.target.value })
                          }}
                          placeholder="Value"
                        />
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      onClick={() => setPersonalInfo({ ...personalInfo, '': '' })}
                    >
                      + Add Personal Info
                    </button>
                  </div>
                </div>

                {/* Professional Summary Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    📝 Professional Summary
                  </h2>
                  <textarea
                    className="w-full p-4 h-32 rounded-xl border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none shadow-sm hover:shadow-md"
                    value={professionalSummary}
                    onChange={(e) => setProfessionalSummary(e.target.value)}
                    placeholder="Write a compelling professional summary that highlights your expertise and career goals..."
                  />
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    🚀 Skills
                  </h2>
                  <div className="space-y-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100">
                        <input
                          type="text"
                          className="flex-1 p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
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
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
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
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      onClick={() => setSkills([...skills, ''])}
                    >
                      + Add Skill
                    </button>
                  </div>
                </div>

                {/* Education Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    🎓 Education
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="p-4 bg-blue-50/30 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-gray-700">Education {index + 1}</h3>
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all duration-200 transform hover:scale-105"
                            onClick={() => {
                              const newEducation = education.filter((_, i) => i !== index)
                              setEducation(newEducation)
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            className="p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                            value={edu?.degree || ''}
                            onChange={(e) => {
                              const newEducation = [...education]
                              newEducation[index] = { ...newEducation[index], degree: e.target.value }
                              setEducation(newEducation)
                            }}
                            placeholder="Degree"
                          />
                          <input
                            type="text"
                            className="p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                            value={edu?.institution || ''}
                            onChange={(e) => {
                              const newEducation = [...education]
                              newEducation[index] = { ...newEducation[index], institution: e.target.value }
                              setEducation(newEducation)
                            }}
                            placeholder="Institution"
                          />
                          <input
                            type="text"
                            className="p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                            value={edu?.graduation_year || ''}
                            onChange={(e) => {
                              const newEducation = [...education]
                              newEducation[index] = { ...newEducation[index], graduation_year: e.target.value }
                              setEducation(newEducation)
                            }}
                            placeholder="Graduation Year"
                          />
                          <input
                            type="text"
                            className="p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                            value={edu?.gpa || ''}
                            onChange={(e) => {
                              const newEducation = [...education]
                              newEducation[index] = { ...newEducation[index], gpa: e.target.value }
                              setEducation(newEducation)
                            }}
                            placeholder="GPA"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      onClick={() => setEducation([...education, { degree: '', institution: '', graduation_year: '', gpa: '' }])}
                    >
                      + Add Education
                    </button>
                  </div>
                </div>

                {/* Projects Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    💼 Projects
                  </h2>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div key={index} className="p-4 bg-green-50/30 rounded-xl border border-green-100">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-gray-700">Project {index + 1}</h3>
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all duration-200 transform hover:scale-105"
                            onClick={() => {
                              const newProjects = projects.filter((_, i) => i !== index)
                              setProjects(newProjects)
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            className="w-full p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                            value={project.name || ''}
                            onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[index] = { ...newProjects[index], name: e.target.value }
                              setProjects(newProjects)
                            }}
                            placeholder="Project Name"
                          />
                          <textarea
                            className="w-full p-3 h-20 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none shadow-sm hover:shadow-md"
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
                            className="w-full p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
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
                            className="w-full p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
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
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      onClick={() => setProjects([...projects, { name: '', description: '', technologies: [], link: '' }])}
                    >
                      + Add Project
                    </button>
                  </div>
                </div>

                {/* Languages Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    🌐 Languages
                  </h2>
                  <div className="space-y-3">
                    {languages.map((language, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <input
                          type="text"
                          className="flex-1 p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
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
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      onClick={() => setLanguages([...languages, ''])}
                    >
                      + Add Language
                    </button>
                  </div>
                </div>

                {/* Work Experience Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    💼 Work Experience
                  </h2>
                  <div className="space-y-4">
                    {workExperience.map((work, index) => (
                      <div key={index} className="p-4 bg-green-50/30 rounded-xl border border-green-100">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-gray-700">Experience {index + 1}</h3>
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all duration-200 transform hover:scale-105"
                            onClick={() => {
                              const newWorkExperience = workExperience.filter((_, i) => i !== index)
                              setWorkExperience(newWorkExperience)
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              className="p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              value={work?.position || ''}
                              onChange={(e) => {
                                const newWorkExperience = [...workExperience]
                                newWorkExperience[index] = { ...newWorkExperience[index], position: e.target.value }
                                setWorkExperience(newWorkExperience)
                              }}
                              placeholder="Position"
                            />
                            <input
                              type="text"
                              className="p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              value={work?.company || ''}
                              onChange={(e) => {
                                const newWorkExperience = [...workExperience]
                                newWorkExperience[index] = { ...newWorkExperience[index], company: e.target.value }
                                setWorkExperience(newWorkExperience)
                              }}
                              placeholder="Company"
                            />
                            <input
                              type="text"
                              className="p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              value={work?.start_date || ''}
                              onChange={(e) => {
                                const newWorkExperience = [...workExperience]
                                newWorkExperience[index] = { ...newWorkExperience[index], start_date: e.target.value }
                                setWorkExperience(newWorkExperience)
                              }}
                              placeholder="Start Date"
                            />
                            <input
                              type="text"
                              className="p-3 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                              value={work?.end_date || ''}
                              onChange={(e) => {
                                const newWorkExperience = [...workExperience]
                                newWorkExperience[index] = { ...newWorkExperience[index], end_date: e.target.value }
                                setWorkExperience(newWorkExperience)
                              }}
                              placeholder="End Date"
                            />
                          </div>
                          <textarea
                            className="w-full p-3 h-20 rounded-lg border border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none shadow-sm hover:shadow-md"
                            value={work?.description || ''}
                            onChange={(e) => {
                              const newWorkExperience = [...workExperience]
                              newWorkExperience[index] = { ...newWorkExperience[index], description: e.target.value }
                              setWorkExperience(newWorkExperience)
                            }}
                            placeholder="Job Description"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      onClick={() => setWorkExperience([...workExperience, { position: '', company: '', start_date: '', end_date: '', description: '' }])}
                    >
                      + Add Work Experience
                    </button>
                  </div>
                </div>

                {/* Generate PDF Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button 
                    className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-xl ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-2xl'
                    }`}
                    onClick={handleGeneratePDF}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating PDF...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        🎨 Generate PDF CV
                      </div>
                    )}
                  </button>
                </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Page