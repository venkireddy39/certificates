import React, { useState, useEffect } from 'react';
import QuestionForm from '../../components/QuestionForm';

const MixedQuestionManager = ({ onAdd, initialData, onCancel }) => {
    const [activeTab, setActiveTab] = useState(initialData?.type || "quiz");

    useEffect(() => {
        if (initialData?.type) {
            setActiveTab(initialData.type);
        }
    }, [initialData]);

    return (
        <div>
            <div className="px-3 pt-4 pb-2">
                <div className="nav nav-pills nav-fill bg-light p-1 rounded-pill border overflow-auto flex-nowrap hide-scrollbar" style={{ gap: '4px' }}>
                    {['quiz', 'short', 'long', 'abacus', 'coding'].map(tab => (
                        <button
                            key={tab}
                            className={`nav-link py-1 px-3 rounded-pill fw-bold small text-capitalize transition-all border-0 ${activeTab === tab ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                            onClick={() => setActiveTab(tab)}
                            style={{ minWidth: tab === 'coding' ? '100px' : '80px' }}
                        >
                            {tab === 'coding' ? <><i className="bi bi-code-slash me-1"></i>Coding</> : tab}
                        </button>
                    ))}
                </div>
            </div>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="animate-fade-in">
                <div key={activeTab + (initialData ? '-edit' : '-add')}>
                    <QuestionForm
                        type={activeTab}
                        onAdd={onAdd}
                        initialData={initialData}
                        onCancel={onCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default MixedQuestionManager;
