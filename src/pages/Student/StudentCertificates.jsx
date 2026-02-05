import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { Award, Download, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import './StudentCertificates.css';

const StudentCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-70">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="student-certificates container-fluid px-0">
            <div className="mb-4">
                <h3 className="fw-bold text-white">My Certificates</h3>
                <p className="text-secondary small">View and download your earned credentials</p>
            </div>

            <div className="row g-4">
                {certificates.length > 0 ? (
                    certificates.map((cert) => (
                        <div className="col-12 col-md-6 col-lg-4" key={cert.id}>
                            <div className="glass-card certificate-card">
                                <div className="cert-badge">
                                    <Award size={32} className="text-primary" />
                                </div>

                                <div className="cert-body">
                                    <h5 className="cert-title text-white">{cert.title}</h5>
                                    <p className="cert-issuer text-secondary small mb-3">
                                        Issued by {cert.issuer}
                                    </p>

                                    <div className="cert-meta mb-4">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <Calendar size={14} className="text-secondary" />
                                            <span className="x-small text-secondary">Issued on: {cert.issueDate}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <ShieldCheck size={14} className="text-secondary" />
                                            <span className="x-small text-secondary">ID: {cert.credentialId}</span>
                                        </div>
                                    </div>

                                    <div className="cert-actions d-flex gap-2">
                                        <button className="btn btn-primary d-flex align-items-center gap-2 flex-grow-1">
                                            <Download size={16} />
                                            <span>Download</span>
                                        </button>
                                        <button className="btn btn-outline-secondary p-2">
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <div className="glass-card p-5">
                            <Award size={48} className="text-secondary opacity-25 mb-3" />
                            <h5 className="text-secondary">No certificates earned yet</h5>
                            <p className="text-secondary small">Complete your courses to receive certification.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCertificates;
