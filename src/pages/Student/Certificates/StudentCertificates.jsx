import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../../services/studentService';
import { Award, Download, ExternalLink, Calendar, ShieldCheck, Share2, Search } from 'lucide-react';
import { useToast } from '../../Library/context/ToastContext';
import '../StudentDashboard.css';
import './StudentCertificates.css';

const StudentCertificates = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const data = await studentService.getMyCertificates();
                setCertificates(data || []);
            } catch (error) {
                console.error("Failed to fetch certificates", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, []);

    const handleDownload = (cert) => {
        toast.info(`Preparing ${cert.title} for download...`);
        // Simulate download delay
        setTimeout(() => {
            toast.success("Certificate downloaded successfully!");
        }, 1500);
    };

    const handleShare = async (cert) => {
        const shareData = {
            title: cert.title,
            text: `I just earned my ${cert.title} certification from ${cert.issuer}!`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } else {
                await navigator.clipboard.writeText(`${shareData.text} Verify at: ${shareData.url}`);
                toast.success("Sharing details copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleView = (cert) => {
        toast.info("Opening credential verification page...");
        // Mock opening a verification link
        window.open(`https://verify.lms.edu/${cert.credentialId}`, '_blank');
    };

    const filteredCerts = certificates.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.credentialId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="student-certificates-container animate-fade-in">
            {/* Page Header */}
            <div className="row mb-5 align-items-center g-3">
                <div className="col-12 col-md-8">
                    <h2 className="fw-bold mb-1 text-white">Earned Credentials</h2>
                    <p className="text-secondary mb-0">Your professional portfolio of valid certifications and achievements.</p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                    <div className="search-box-minimal glass-card px-3 py-2 d-flex align-items-center">
                        <Search size={18} className="text-secondary me-2" />
                        <input
                            type="text"
                            placeholder="Search by Title or ID..."
                            className="bg-transparent border-0 text-white smaller outline-none w-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {filteredCerts.length > 0 ? (
                    filteredCerts.map((cert) => (
                        <div className="col-12 col-md-6 col-lg-4" key={cert.id}>
                            <div className="glass-card certificate-card-v2 p-4 h-100 d-flex flex-column border border-white border-opacity-10 transition-all hover-translate-y">
                                <div className="cert-top-accent"></div>
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div className="award-icon-box shadow-glow bg-primary bg-opacity-10 p-3 rounded-4">
                                        <Award size={32} className="text-primary" />
                                    </div>
                                    <button
                                        className="btn btn-sm btn-link p-2 rounded-circle hover-bg-glass text-secondary transition-all"
                                        onClick={() => handleShare(cert)}
                                        title="Share Certificate"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>

                                <h5 className="fw-bold mb-1 text-white line-clamp-1">{cert.title}</h5>
                                <p className="text-secondary smaller mb-4 fw-medium">Issued by <span className="text-primary">{cert.issuer}</span></p>

                                <div className="credential-meta-box mb-4 p-3 bg-white bg-opacity-5 rounded-4 border border-white border-opacity-5">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <Calendar size={14} className="text-secondary opacity-50" />
                                        <span className="smaller text-secondary opacity-75">Verified on {cert.issueDate}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <ShieldCheck size={14} className="text-success opacity-50" />
                                        <span className="smaller text-secondary font-monospace tracking-tighter">ID: {cert.credentialId}</span>
                                    </div>
                                </div>

                                <div className="mt-auto d-flex gap-2">
                                    <button
                                        className="btn btn-primary flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2 small fw-bold shadow-primary transition-all active-scale"
                                        onClick={() => handleDownload(cert)}
                                    >
                                        <Download size={18} /> Download PDF
                                    </button>
                                    <button
                                        className="btn btn-outline-light border-opacity-10 rounded-pill px-3 py-2 transition-all hover-bg-glass"
                                        onClick={() => handleView(cert)}
                                        title="View Online"
                                    >
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 py-5 text-center glass-card border-dashed rounded-4">
                        <div className="p-5">
                            <Award size={64} className="text-secondary opacity-15 mb-4" />
                            <h4 className="fw-bold text-white">No Records Found</h4>
                            <p className="text-secondary max-w-400 mx-auto opacity-75">Complete your assessment modules and score at least 70% to unlock your professional certifications.</p>
                            <button className="btn btn-primary mt-4 px-5 rounded-pill shadow-primary" onClick={() => navigate('/student/courses')}>Go to Courses</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCertificates;
