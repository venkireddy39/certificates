import React from 'react';

const StudentPagePlaceholder = ({ title = "Coming Soon", description = "This page is under construction.", icon: Icon }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh',
            textAlign: 'center',
            color: '#94a3b8'
        }}>
            {Icon ? (
                <div style={{
                    padding: '24px',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.1)',
                    marginBottom: '24px',
                    color: '#3b82f6'
                }}>
                    <Icon size={48} />
                </div>
            ) : (
                <div style={{
                    fontSize: '64px',
                    marginBottom: '16px',
                    opacity: 0.5
                }}>
                    🚧
                </div>
            )}
            <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '8px'
            }}>
                {title}
            </h2>
            <p style={{
                fontSize: '16px',
                maxWidth: '400px',
                lineHeight: 1.6
            }}>
                {description}
            </p>
            <div style={{
                marginTop: '32px',
                padding: '12px 24px',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                fontSize: '13px'
            }}>
                Feature coming in future updates
            </div>
        </div>
    );
};

export default StudentPagePlaceholder;
