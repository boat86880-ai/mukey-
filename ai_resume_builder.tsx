import React, { useState, useRef } from 'react';
import { FileText, Sparkles, Download, Check, Zap, Crown, Target } from 'lucide-react';

const ResumeBuilder = () => {
  const [step, setStep] = useState('input');
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    jobDescription: ''
  });
  const [optimizedResume, setOptimizedResume] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const resumeRef = useRef();

  const plans = [
    {
      id: 'basic',
      name: 'Single Resume',
      price: 15,
      features: [
        'AI-Optimized Resume',
        '1 Professional Template',
        'ATS Score Analysis',
        'PDF Download',
        'Lifetime Access'
      ],
      recommended: false
    },
    {
      id: 'pro',
      name: 'Career Bundle',
      price: 25,
      features: [
        'AI-Optimized Resume',
        'Custom Cover Letter',
        'LinkedIn Profile Optimizer',
        '5 Premium Templates',
        'ATS Score Analysis',
        'Achievement Quantifier',
        'PDF Download',
        'Lifetime Access'
      ],
      recommended: true
    }
  ];

  const handleInputChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const optimizeResume = async () => {
    if (!resumeData.name || !resumeData.experience) {
      alert('Please fill in at least your name and experience');
      return;
    }

    setIsOptimizing(true);
    setStep('optimizing');

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{
            role: "user",
            content: `You are an expert resume writer. Optimize this resume to be ATS-friendly and impactful.

RESUME DATA:
Name: ${resumeData.name}
Email: ${resumeData.email}
Phone: ${resumeData.phone}
Summary: ${resumeData.summary}
Experience: ${resumeData.experience}
Education: ${resumeData.education}
Skills: ${resumeData.skills}

${resumeData.jobDescription ? `TARGET JOB DESCRIPTION:\n${resumeData.jobDescription}\n\nCustomize the resume to match this job.` : ''}

Respond ONLY with valid JSON (no markdown, no preamble):
{
  "summary": "2-3 sentence optimized professional summary",
  "experience": ["bullet point 1", "bullet point 2", "bullet point 3"],
  "skills": ["skill1", "skill2", "skill3"],
  "atsScore": 85,
  "improvements": ["improvement 1", "improvement 2"]
}`
          }]
        })
      });

      const data = await response.json();
      const text = data.content.map(i => i.text || "").join("\n").trim();
      const cleanText = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanText);

      setOptimizedResume(result);
      setAtsScore(result.atsScore);
      setStep('preview');
    } catch (error) {
      console.error('Optimization error:', error);
      alert('Optimization failed. Please try again.');
      setStep('input');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handlePayment = (planId) => {
    setSelectedPlan(planId);
    alert(`🚀 Payment Integration Ready!\n\nTo complete setup:\n1. Create a Stripe account at stripe.com\n2. Add your Stripe keys to the code\n3. Replace this alert with real payment\n\nFor now, this unlocks the download for demo purposes.`);
    setStep('final');
  };

  const downloadPDF = () => {
    const element = resumeRef.current;
    const content = element.innerHTML;
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.name} - Resume</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px 20px;
              line-height: 1.6;
            }
            h2 { 
              font-size: 28px; 
              margin-bottom: 5px; 
            }
            h3 { 
              font-size: 16px; 
              font-weight: bold;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 4px;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            .skills-tag {
              display: inline-block;
              background: #dbeafe;
              color: #1e40af;
              padding: 4px 12px;
              border-radius: 20px;
              margin: 4px;
              font-size: 14px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-Powered Resume Builder</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Land Your Dream Job
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-optimized resumes that pass ATS systems and impress recruiters
            </p>
          </div>

          {/* Input Form */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={resumeData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={resumeData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Summary</label>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Brief overview of your professional background..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Work Experience *</label>
                <textarea
                  value={resumeData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Software Engineer at Tech Corp (2020-2023)&#10;- Developed scalable applications&#10;- Led team of 5 developers"
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
                <textarea
                  value={resumeData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science&#10;University Name, 2020"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                <input
                  type="text"
                  value={resumeData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  placeholder="Python, JavaScript, React, Node.js, SQL"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-200">
                <div className="flex items-start gap-3 mb-4">
                  <Target className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      🎯 Job Description (Optional - Increases Match Score!)
                    </label>
                    <p className="text-sm text-gray-600 mb-3">Paste the job posting you're applying for. AI will customize your resume to match it.</p>
                  </div>
                </div>
                <textarea
                  value={resumeData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  placeholder="Paste the job description here for AI to tailor your resume..."
                  rows="4"
                  className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={optimizeResume}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Optimize with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'optimizing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI is Optimizing Your Resume</h2>
          <p className="text-gray-600">Analyzing keywords, formatting, and ATS compatibility...</p>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Optimized Resume is Ready!</h1>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
              <Check className="w-5 h-5" />
              <span className="font-semibold">ATS Score: {atsScore}/100</span>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-8" ref={resumeRef}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{resumeData.name}</h2>
                <p className="text-gray-600">{resumeData.email} • {resumeData.phone}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-blue-600 pb-1">Professional Summary</h3>
                <p className="text-gray-700 leading-relaxed">{optimizedResume.summary}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-blue-600 pb-1">Experience</h3>
                <div className="space-y-2">
                  {optimizedResume.experience.map((exp, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <p className="text-gray-700">{exp}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-blue-600 pb-1">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {optimizedResume.skills.map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {resumeData.education && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-blue-600 pb-1">Education</h3>
                  <p className="text-gray-700">{resumeData.education}</p>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        plan.recommended
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onClick={() => handlePayment(plan.id)}
                    >
                      {plan.recommended && (
                        <div className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3 w-fit">
                          <Crown className="w-4 h-4" />
                          Most Popular
                        </div>
                      )}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-gray-600">one-time</span>
                      </div>
                      <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-700">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        plan.recommended
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}>
                        Get Started
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">AI Improvements Made:</h3>
                <ul className="space-y-2">
                  {optimizedResume.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'final') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-8">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-8">Your optimized resume is ready to download</p>
            <button
              onClick={downloadPDF}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg inline-flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Resume PDF
            </button>
            <p className="text-sm text-gray-500 mt-6">You can edit and re-download anytime with your account</p>
          </div>
        </div>
      </div>
    );
  }
};

export default ResumeBuilder;