import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiClock } from "react-icons/fi";
import './MNCExamView.css';

// Enhanced Mock Data to simulate Sections if needed
const MOCK_EXAM_DATA = {
    id: "E-MNC-001",
    title: "TCS NQT Simulation - Aptitude & Reasoning",
    candidateName: "John Doe",
    durationMinutes: 60,
    totalQuestions: 10,
    sections: ["General Aptitude"],
    questions: [
        {
            id: 1,
            text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
            options: [
                { id: "A", text: "120 metres" },
                { id: "B", text: "180 metres" },
                { id: "C", text: "324 metres" },
                { id: "D", text: "150 metres" }
            ],
            marks: 1,
            negative: 0.25
        },
        // ... (rest of mock data can remain as fallback)
    ]
};

const MNCExamView = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- State ---
    const [examData, setExamData] = useState(MOCK_EXAM_DATA);
    const [sections, setSections] = useState([]); // [{id, name, questions: []}]
    const [activeSectionId, setActiveSectionId] = useState(null); // Current Section ID
    const [currentQIndex, setCurrentQIndex] = useState(0); // Index relative to the active section

    const [answers, setAnswers] = useState({});
    const [statusMap, setStatusMap] = useState({});
    const [timeLeft, setTimeLeft] = useState(60 * 60);
    const [selectedOption, setSelectedOption] = useState(null);

    // --- Coding Execution State ---
    const [executing, setExecuting] = useState(false);
    const [executionResults, setExecutionResults] = useState(null);

    const handleRunCode = async () => {
        if (!currentQ || currentQ.type !== 'coding') return;
        setExecuting(true);
        setExecutionResults(null);

        // Simulate network/execution delay
        await new Promise(r => setTimeout(r, 1500));

        const userCode = selectedOption || currentQ.starterCode || '';
        const results = [];
        let allPassed = true;

        if (currentQ.testCases && currentQ.testCases.length > 0) {
            // Processing Test Cases
            currentQ.testCases.forEach((tc, idx) => {
                let passed = false;
                let actualOutput = '';

                try {
                    // Primitive JS Evaluation for Demo (Only works if they select JS and write valid accessible code)
                    // For other languages or complex logic, we would need a backend.
                    // This is a SIMULATION for the demo.
                    if (currentQ.language === 'javascript' || currentQ.language === 'all') {
                        // Very unsafe in production, but okay for this local demo to show functionality
                        // We wrap it to return a value. 
                        // Check if code has a function or just script.
                        // We'll simplisticly assume simplistic script for now or mock success if code length > 10
                        if (userCode.length > 10) {
                            passed = Math.random() > 0.2; // Random success for demo unless we implement full runner
                            actualOutput = passed ? tc.output : "Error: Syntax or Logic Mismatch";
                        } else {
                            passed = false;
                            actualOutput = "No code written";
                        }
                    } else {
                        // Mock for Java/Python/etc
                        passed = true;
                        actualOutput = tc.output;
                    }
                } catch (e) {
                    passed = false;
                    actualOutput = e.message;
                }

                results.push({
                    input: tc.input,
                    expected: tc.output,
                    actual: actualOutput,
                    passed: passed
                });
                if (!passed) allPassed = false;
            });
        } else {
            // No test cases defined
            results.push({ input: "-", expected: "-", actual: "Compiled Successfully", passed: true });
        }

        setExecutionResults({ results, allPassed });
        setExecuting(false);
    };

    // Instruction State
    const [isInstructionMode, setIsInstructionMode] = useState(true);
    const [agreed, setAgreed] = useState(false);

    // --- Init Data ---
    useEffect(() => {
        let loadedExam = MOCK_EXAM_DATA;
        if (location.state?.examData) {
            const incoming = location.state.examData;
            const transformedQuestions = incoming.questions.map((q, idx) => ({
                id: idx + 1,
                text: q.question,
                type: q.type,
                starterCode: q.starterCode,
                language: q.language || 'javascript',
                testCases: q.testCases || [],
                options: q.options ? q.options.map((opt, oIdx) => ({
                    id: String.fromCharCode(65 + oIdx),
                    text: opt
                })) : [],
                marks: q.marks || 1,
                negative: incoming.settings?.negativeMarking ? (incoming.settings.negativeMarkingPenalty || 0) : 0,
                // Assign a temporary section if available, else 'Default'
                section: q.section || "General" // Assuming 'section' property might exist or we default
            }));

            loadedExam = {
                id: incoming.id || "PREVIEW",
                title: incoming.title || "Exam Preview",
                candidateName: "Preview Candidate",
                durationMinutes: incoming.duration || 60,
                questions: transformedQuestions,
                course: incoming.course,
                instructions: incoming.instructions // Load instructions
            };
        }

        setExamData(loadedExam);
        setTimeLeft(loadedExam.durationMinutes * 60);

        // Group Questions into Sections
        // If loadedExam.questions has 'section' field, group by it. 
        // Otherwise create one section.
        const grouped = {};
        loadedExam.questions.forEach(q => {
            const secName = q.section || "Section 1";
            if (!grouped[secName]) grouped[secName] = [];
            grouped[secName].push(q);
        });

        const sectionArray = Object.keys(grouped).map((name, idx) => ({
            id: `sec-${idx}`,
            name: name,
            questions: grouped[name]
        }));

        // If mostly default, maybe split completely if user asked for "section wise"?
        // But we stick to data. If only 1 section, so be it. 
        // User can click tabs if we make multiple. 
        // Let's ensure we have at least one.
        if (sectionArray.length === 0) {
            sectionArray.push({ id: 'sec-0', name: 'General', questions: [] });
        }

        setSections(sectionArray);
        setActiveSectionId(sectionArray[0].id);
        setCurrentQIndex(0);

        // Init Status Map
        const initialStatus = {};
        loadedExam.questions.forEach(q => {
            initialStatus[q.id] = 'not-visited';
        });
        setStatusMap(initialStatus);

    }, [location.state]);

    // --- Derived State ---
    const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];
    const currentQ = activeSection?.questions[currentQIndex];

    // --- Effects ---

    // Timer - only run if NOT in instruction mode
    useEffect(() => {
        if (isInstructionMode) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isInstructionMode]); // Depend on instruction mode

    // Update 'not-visited' to 'not-answered' on visit
    useEffect(() => {
        if (isInstructionMode || !currentQ) return;

        setStatusMap(prev => {
            if (prev[currentQ.id] === 'not-visited') {
                return { ...prev, [currentQ.id]: 'not-answered' }; // Red color
            }
            return prev;
        });

        if (answers[currentQ.id]) {
            setSelectedOption(answers[currentQ.id]);
        } else {
            setSelectedOption(null);
        }
    }, [currentQ, activeSectionId, currentQIndex, isInstructionMode]); // Depend on Q change

    // --- Handlers ---

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    };

    const handleStartExam = () => {
        if (agreed) {
            // Need to enter fullscreen usually
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(e => console.log(e));
            }
            setIsInstructionMode(false);
        } else {
            alert("Please accept the terms and conditions to start the exam.");
        }
    };

    const handleOptionSelect = (optId) => {
        setSelectedOption(optId);
    };

    const handleSaveAndNext = () => {
        if (!currentQ) return;

        if (selectedOption) {
            setAnswers(prev => ({ ...prev, [currentQ.id]: selectedOption }));
            setStatusMap(prev => ({ ...prev, [currentQ.id]: 'answered' }));
        } else {
            // If clicked Save & Next without Answer -> Not Answered (Red)
            // Unless it was already marked... but typically Red overrides or stays Red.
            setStatusMap(prev => ({ ...prev, [currentQ.id]: 'not-answered' }));
        }
        moveToNext();
    };

    const handleMarkForReview = () => {
        if (!currentQ) return;

        if (selectedOption) {
            setAnswers(prev => ({ ...prev, [currentQ.id]: selectedOption }));
            setStatusMap(prev => ({ ...prev, [currentQ.id]: 'marked-answered' }));
        } else {
            setStatusMap(prev => ({ ...prev, [currentQ.id]: 'marked' }));
        }
        moveToNext();
    };

    const handleClearResponse = () => {
        if (!currentQ) return;
        setSelectedOption(null);
        setAnswers(prev => {
            const newAns = { ...prev };
            delete newAns[currentQ.id];
            return newAns;
        });
        setStatusMap(prev => ({ ...prev, [currentQ.id]: 'not-answered' }));
    };

    const moveToNext = () => {
        // Check if next question exists in current section
        if (currentQIndex < activeSection.questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            // End of section
            // Find next section index
            const currentSecIdx = sections.findIndex(s => s.id === activeSectionId);
            if (currentSecIdx < sections.length - 1) {
                if (window.confirm("You have reached the end of this section. Move to next section?")) {
                    setActiveSectionId(sections[currentSecIdx + 1].id);
                    setCurrentQIndex(0);
                }
            } else {
                // End of exam
                alert("You have reached the end of the final section. Please click 'Submit Exam' if you are done.");
            }
        }
    };

    const handleSubmit = () => {
        alert("Exam Submitted Successfully!");
        navigate('/exams/dashboard');
    };

    // Calculate Counts (Global)
    const getStatusCounts = () => {
        const counts = { answered: 0, notAnswered: 0, notVisited: 0, marked: 0, markedAnswered: 0 };
        Object.values(statusMap).forEach(s => {
            if (s === 'answered') counts.answered++;
            else if (s === 'not-answered') counts.notAnswered++;
            else if (s === 'not-visited') counts.notVisited++;
            else if (s === 'marked') counts.marked++;
            else if (s === 'marked-answered') counts.markedAnswered++;
        });
        return counts;
    };

    const counts = getStatusCounts();

    // --- Renders ---

    const renderInstructions = () => (
        <div className="mnc-instructions-container">
            <header className="mnc-header">
                <div className="mnc-logo"><span>SYSTEM PREVIEW</span></div>
                <div className="mnc-exam-title">{examData.title}</div>
            </header>
            <div className="mnc-inst-body">
                <div className="inst-card">
                    <h2 className="mb-3">Exam Instructions</h2>

                    <div className="inst-content p-4 bg-light rounded border mb-4" style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {examData.instructions || "No instructions provided for this exam."}
                    </div>

                    <div className="inst-footer">
                        <label className="checkbox-container">
                            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                            <span className="checkmark"></span>
                            I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. in the examination hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future tests / examinations.
                        </label>

                        <div className="inst-actions">
                            <button className="btn-mnc-start" disabled={!agreed} onClick={handleStartExam}>I am ready to begin</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isInstructionMode) return renderInstructions();
    if (!activeSection) return <div>Loading Exam...</div>;

    return (
        <div className="mnc-container">
            {/* Header */}
            <header className="mnc-header">
                <div className="mnc-logo">
                    <span>SYSTEM PREVIEW</span>
                </div>
                <div className="d-flex gap-3">
                    <button className="btn btn-sm btn-light border" onClick={() => setIsInstructionMode(true)}>Instructions</button>
                    <button className="btn btn-sm btn-light border" onClick={() => alert('Question Paper View')}>Question Paper</button>
                    <div className="mnc-exam-title">{examData.title}</div>
                </div>
                <div className="mnc-timer">
                    <span className="timer-label">Time Left:</span>
                    <span className="timer-val">{formatTime(timeLeft)}</span>
                </div>
            </header>

            {/* Layout */}
            <div className="mnc-layout">
                {/* Left: Question Area */}
                <main className="mnc-question-area">
                    {/* Section Bar (Mobile/Desktop) */}
                    <div className="d-none d-md-flex align-items-center bg-light border-bottom px-3 py-2 gap-2"
                        style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <span className="fw-bold fs-6 me-2">Sections:</span>
                        {sections.map(sec => (
                            <button
                                key={sec.id}
                                className={`btn btn-sm ${activeSectionId === sec.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => { setActiveSectionId(sec.id); setCurrentQIndex(0); }}
                            >
                                {sec.name} <span className="badge bg-white text-dark ms-1 opacity-75">i</span>
                            </button>
                        ))}
                    </div>

                    <div className="q-top-bar mt-2">
                        <div className="q-number">Question No. {currentQIndex + 1}</div>
                        <div className="q-marks-info">
                            Marks: <span className="q-mark-val">+{currentQ?.marks}</span>
                            Negative: <span className="q-neg-val">-{currentQ?.negative}</span>
                        </div>
                    </div>

                    <div className="q-scroll-content">
                        <div className="q-text">
                            {currentQ?.text || "Select a question from the palette."}
                        </div>




                        {currentQ && currentQ.type === 'coding' && (
                            <div className="mt-4 d-flex flex-column gap-3">
                                {/* Toolbar */}
                                <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded border">
                                    <div className="d-flex align-items-center gap-2">
                                        <label className="small fw-bold text-muted mb-0">Language:</label>
                                        <select
                                            className="form-select form-select-sm border-0 bg-white"
                                            style={{ width: '150px' }}
                                            disabled={currentQ.language !== 'all'}
                                            defaultValue={currentQ.language}
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="cpp">C++</option>
                                            <option value="csharp">C#</option>
                                            <option value="all">Any</option>
                                        </select>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-success fw-bold d-flex align-items-center gap-2"
                                        onClick={handleRunCode}
                                        disabled={executing}
                                    >
                                        {executing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Running...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-play-fill text-white fs-6"></i> Run Code
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Editor */}
                                <div className="position-relative">
                                    <textarea
                                        className="form-control font-monospace bg-dark text-white border-0"
                                        rows={12}
                                        value={selectedOption || currentQ.starterCode || ''}
                                        onChange={(e) => handleOptionSelect(e.target.value)}
                                        spellCheck="false"
                                        style={{ resize: 'vertical', fontSize: '14px', lineHeight: '1.5' }}
                                        placeholder="// Write your code here..."
                                    ></textarea>
                                </div>

                                {/* Results Panel */}
                                {executionResults && (
                                    <div className="border rounded overflow-hidden">
                                        <div className={`p-2 small fw-bold text-white d-flex justify-content-between align-items-center ${executionResults.allPassed ? 'bg-success' : 'bg-danger'}`}>
                                            <span>
                                                <i className={`bi ${executionResults.allPassed ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                                                {executionResults.allPassed ? 'All Compilations & Tests Passed' : 'Some Test Cases Failed'}
                                            </span>
                                            {executionResults.allPassed && <span className="badge bg-white text-success">Success</span>}
                                        </div>
                                        <div className="bg-light p-3">
                                            {executionResults.results.map((res, i) => (
                                                <div key={i} className="mb-2 p-2 bg-white border rounded small">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="fw-bold text-muted">Test Case {i + 1}</span>
                                                        {res.passed ? (
                                                            <span className="text-success fw-bold"><i className="bi bi-check me-1"></i>Passed</span>
                                                        ) : (
                                                            <span className="text-danger fw-bold"><i className="bi bi-x me-1"></i>Failed</span>
                                                        )}
                                                    </div>
                                                    <div className="row g-2 font-monospace" style={{ fontSize: '0.85rem' }}>
                                                        <div className="col-4">
                                                            <div className="text-muted x-small text-uppercase">Input</div>
                                                            <div className="p-1 bg-light rounded border">{res.input}</div>
                                                        </div>
                                                        <div className="col-4">
                                                            <div className="text-muted x-small text-uppercase">Expected</div>
                                                            <div className="p-1 bg-light rounded border">{res.expected}</div>
                                                        </div>
                                                        <div className="col-4">
                                                            <div className="text-muted x-small text-uppercase">Actual</div>
                                                            <div className={`p-1 rounded border ${res.passed ? 'bg-light text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                                                {res.actual}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentQ && ['short', 'long', 'fill'].includes(currentQ.type) && (
                            <div className="mt-4">
                                <label className="form-label fw-bold text-muted small">Your Answer</label>
                                <textarea
                                    className="form-control"
                                    rows={6}
                                    value={selectedOption || ''}
                                    onChange={(e) => handleOptionSelect(e.target.value)}
                                    placeholder="Type your answer here..."
                                ></textarea>
                            </div>
                        )}

                        {currentQ && (!currentQ.type || currentQ.type === 'quiz') && (
                            <div className="mnc-options">
                                {currentQ.options.map(opt => (
                                    <label key={opt.id} className="mnc-option">
                                        <input
                                            type="radio"
                                            name={`q-${currentQ.id}`}
                                            checked={selectedOption === opt.id}
                                            onChange={() => handleOptionSelect(opt.id)}
                                        />
                                        <span>{opt.text}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mnc-footer-actions">
                        <div className="action-group">
                            <button className="btn-mnc btn-mark-review" onClick={handleMarkForReview}>Mark for Review & Next</button>
                            <button className="btn-mnc btn-clear" onClick={handleClearResponse}>Clear Response</button>
                        </div>
                        <div className="action-group">
                            <button className="btn-mnc btn-save-next" onClick={handleSaveAndNext}>Save & Next</button>
                        </div>
                    </div>
                </main>

                {/* Right: Sidebar */}
                <aside className="mnc-sidebar">
                    <div className="user-info-section">
                        <div className="user-img-placeholder">
                            <FiUser size={24} />
                        </div>
                        <div className="user-name">{examData.candidateName}</div>
                    </div>

                    <div className="palette-legend-grid">
                        <div className="legend-item"><div className="legend-sym sym-ans">{counts.answered}</div> Answered</div>
                        <div className="legend-item"><div className="legend-sym sym-not-ans">{counts.notAnswered}</div> Not Answered</div>
                        <div className="legend-item"><div className="legend-sym sym-not-visit">{counts.notVisited}</div> Not Visited</div>
                        <div className="legend-item"><div className="legend-sym sym-mark">{counts.marked}</div> Marked for Review</div>
                        <div className="legend-item" style={{ gridColumn: 'span 2' }}><div className="legend-sym sym-mark-ans">{counts.markedAnswered}</div> Answered & Marked for Review (will be considered for evaluation)</div>
                    </div>

                    <div className="palette-container">
                        <span className="palette-section-title">Section: {activeSection.name}</span>
                        <div className="grid-buttons">
                            {activeSection.questions.map((q, idx) => {
                                let statusClass = 'not-visited';
                                if (statusMap[q.id]) statusClass = statusMap[q.id];
                                if (currentQIndex === idx) statusClass += ' current';

                                return (
                                    <button
                                        key={q.id}
                                        className={`p-btn ${statusClass}`}
                                        onClick={() => setCurrentQIndex(idx)}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="sidebar-footer">
                        <button className="btn-submit-final" onClick={handleSubmit}>Submit Exam</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default MNCExamView;
