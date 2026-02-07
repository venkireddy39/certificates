import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    Search,
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    Circle,
    User,
    CheckCheck,
    Image as ImageIcon,
    MessageSquare,
    Megaphone,
    Users,
    ShieldQuestion,
    Filter,
    Plus,
    Clock,
    ThumbsUp
} from 'lucide-react';
import '../StudentDashboard.css';
import './StudentCommunication.css';

const StudentCommunication = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('messages');
    const [selectedChat, setSelectedChat] = useState(1);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    // --- MOCK DATA ---
    const chats = [
        {
            id: 1,
            name: "Prof. Sarah Johnson",
            role: "Instructor (UI/UX)",
            avatar: "https://i.pravatar.cc/150?u=sarah",
            lastMsg: "Don't forget to submit the assignment by tomorrow.",
            time: "10:24 AM",
            unread: 2,
            online: true
        },
        {
            id: 2,
            name: "Project Group - Alpha",
            role: "Student Group",
            avatar: "https://ui-avatars.com/api/?name=Alpha&background=6366f1&color=fff",
            lastMsg: "Let's meet at the library at 4 PM.",
            time: "Yesterday",
            unread: 0,
            online: false
        },
        {
            id: 3,
            name: "David Smith",
            role: "Student",
            avatar: "https://i.pravatar.cc/150?u=david",
            lastMsg: "Can you share the notes for today's class?",
            time: "Yesterday",
            unread: 0,
            online: true
        }
    ];

    const [messages, setMessages] = useState([
        { id: 1, chatId: 1, text: "Hello Prof, I had a question regarding the typography module.", sender: "me", time: "10:15 AM", status: "read" },
        { id: 2, chatId: 1, text: "Sure, go ahead. What's bothering you?", sender: "them", time: "10:18 AM" },
        { id: 3, chatId: 1, text: "Don't forget to submit the assignment by tomorrow.", sender: "them", time: "10:24 AM" }
    ]);

    const forums = [
        { id: 1, title: "Best resources for learning React Hooks?", author: "John Doe", replies: 12, likes: 24, category: "React Development", time: "2h ago" },
        { id: 2, title: "Help with CSS Grid layout in my project", author: "Alice Wong", replies: 5, likes: 8, category: "Web Design", time: "5h ago" },
        { id: 3, title: "Internship opportunities for Summer 2024", author: "Career Center", replies: 45, likes: 120, category: "Career", time: "1d ago" }
    ];

    const announcements = [
        { id: 1, title: "Mid-Term Examination Schedule Released", body: "The mid-term exams will start from Feb 20th. Please check the portal for your specific slot.", date: "Today, 09:00 AM", urgent: true },
        { id: 2, title: "Guest Lecture: AI in Healthcare", body: "Join us this Friday for an exclusive talk by Dr. Smith from HealthTech AI.", date: "Yesterday", urgent: false },
        { id: 3, title: "Library Hours Extended", body: "Due to the exam season, the campus library will remain open until 2 AM.", date: "2 days ago", urgent: false }
    ];

    const activeChat = chats.find(c => c.id === selectedChat);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeTab === 'messages') scrollToBottom();
    }, [messages, activeTab]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            chatId: selectedChat,
            text: message,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sent"
        };

        setMessages([...messages, newMessage]);
        setMessage('');

        setTimeout(() => {
            const reply = {
                id: messages.length + 2,
                chatId: selectedChat,
                text: "Thanks! I'll check it out.",
                sender: "them",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    return (
        <div className="student-communication-container animate-fade-in h-100 d-flex flex-column">
            {/* Sticky Nav Header */}
            <div className="row mb-4 align-items-center g-3">
                <div className="col-12 col-lg-5">
                    <h2 className="fw-bold mb-1">Comm Center</h2>
                    <p className="text-secondary mb-0">Direct messages, community forums, and broadcasts.</p>
                </div>
                <div className="col-12 col-lg-7">
                    <div className="nav nav-pills gap-2 justify-content-lg-end bg-glass-dark p-1 rounded-pill d-inline-flex w-100 w-lg-auto">
                        <button className={`pill-btn border-0 ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                            <MessageSquare size={16} className="me-2" /> DMs
                        </button>
                        <button className={`pill-btn border-0 ${activeTab === 'forums' ? 'active' : ''}`} onClick={() => setActiveTab('forums')}>
                            <Users size={16} className="me-2" /> Forums
                        </button>
                        <button className={`pill-btn border-0 ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
                            <Megaphone size={16} className="me-2" /> Updates
                        </button>
                        <button className={`pill-btn border-0 ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
                            <ShieldQuestion size={16} className="me-2" /> Help
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'messages' && (
                <div className="communication-chat-wrapper glass-card overflow-hidden flex-grow-1 d-flex">
                    {/* Contacts List */}
                    <div className="chat-contacts-list border-end border-white border-opacity-5 d-none d-md-flex flex-column" style={{ width: '320px' }}>
                        <div className="p-3 border-bottom border-white border-opacity-5">
                            <div className="search-box-minimal glass-card px-3 py-2 d-flex align-items-center">
                                <Search size={16} className="text-secondary me-2" />
                                <input type="text" placeholder="Search direct messages..." className="bg-transparent border-0 text-white smaller outline-none w-100" />
                            </div>
                        </div>
                        <div className="flex-grow-1 overflow-auto p-2">
                            {chats.map(chat => (
                                <div
                                    key={chat.id}
                                    className={`contact-item p-3 mb-1 rounded-3 d-flex gap-3 align-items-center cursor-pointer transition-all ${selectedChat === chat.id ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20' : 'hover-bg-glass'}`}
                                    onClick={() => setSelectedChat(chat.id)}
                                >
                                    <div className="position-relative flex-shrink-0">
                                        <img src={chat.avatar} alt={chat.name} className="contact-avatar rounded-circle border border-white border-opacity-10" width="44" height="44" />
                                        {chat.online && <span className="online-status-dot"></span>}
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className={`contact-name text-truncate small fw-600 ${selectedChat === chat.id ? 'text-white' : 'text-secondary'}`}>{chat.name}</div>
                                            <span className="smaller opacity-50">{chat.time}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-1">
                                            <div className="contact-preview smaller text-truncate opacity-75">{chat.lastMsg}</div>
                                            {chat.unread > 0 && <span className="badge bg-primary rounded-circle smaller px-1 py-0">{chat.unread}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="chat-content-view flex-grow-1 d-flex flex-column bg-white bg-opacity-1">
                        <div className="p-3 border-bottom border-white border-opacity-5 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <img src={activeChat.avatar} className="rounded-circle" width="36" height="36" alt="" />
                                <div>
                                    <div className="small fw-600 text-white">{activeChat.name}</div>
                                    <div className="smaller text-success">Online Now</div>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn-icon-glass"><Phone size={16} /></button>
                                <button className="btn-icon-glass"><Video size={16} /></button>
                                <button className="btn-icon-glass"><MoreVertical size={16} /></button>
                            </div>
                        </div>

                        <div className="messages-stream flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3">
                            {messages.filter(m => m.chatId === selectedChat).map(m => (
                                <div key={m.id} className={`message-bundle d-flex ${m.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <div className={`message-pill p-3 px-4 ${m.sender === 'me' ? 'bg-primary text-white my-message shadow-primary' : 'bg-white bg-opacity-5 text-secondary their-message'}`}>
                                        <div className="message-text small">{m.text}</div>
                                        <div className={`message-meta d-flex align-items-center gap-1 mt-1 ${m.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}>
                                            <span className="smaller opacity-50">{m.time}</span>
                                            {m.sender === 'me' && <CheckCheck size={12} className={m.status === 'read' ? 'text-info' : 'opacity-25'} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-control-box p-3 border-top border-white border-opacity-5">
                            <form className="input-group glass-input-group rounded-pill overflow-hidden" onSubmit={handleSendMessage}>
                                <button className="btn btn-link py-2 ps-3 border-0 text-secondary" type="button"><Paperclip size={18} /></button>
                                <input
                                    type="text"
                                    className="form-control border-0 bg-transparent text-white smaller py-3 shadow-none"
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button className="btn btn-primary rounded-circle m-1 p-2 shadow-primary" type="submit"><Send size={18} /></button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'forums' && (
                <div className="forums-explorer-view animate-fade-in">
                    <div className="glass-card mb-4 p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div className="d-flex gap-3">
                            <div className="search-box-minimal glass-card px-3 py-2 d-flex align-items-center">
                                <Search size={16} className="text-secondary me-2" />
                                <input type="text" placeholder="Search topics..." className="bg-transparent border-0 text-white smaller outline-none" style={{ width: '250px' }} />
                            </div>
                            <button className="btn-icon-glass"><Filter size={18} /></button>
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 py-2 small fw-bold d-flex align-items-center gap-2 shadow-primary">
                            <Plus size={18} /> New Discussion
                        </button>
                    </div>

                    <div className="row g-4">
                        {forums.map(forum => (
                            <div key={forum.id} className="col-12">
                                <div className="glass-card forum-topic-v2 p-4 transition-all hover-bg-glass cursor-pointer border-opacity-5">
                                    <div className="row align-items-center">
                                        <div className="col-lg-8">
                                            <div className="badge bg-primary bg-opacity-10 text-primary smaller rounded-pill mb-3">{forum.category}</div>
                                            <h5 className="fw-bold mb-2 text-white">{forum.title}</h5>
                                            <div className="d-flex align-items-center gap-3 text-secondary smaller">
                                                <span className="d-flex align-items-center gap-1"><User size={14} /> Created by {forum.author}</span>
                                                <span className="d-flex align-items-center gap-1"><Clock size={14} /> {forum.time}</span>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                                            <div className="d-flex gap-4 justify-content-lg-end">
                                                <div className="text-center">
                                                    <div className="fw-bold text-white small">{forum.replies}</div>
                                                    <div className="smaller text-secondary">REPLIES</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="fw-bold text-white small">{forum.likes}</div>
                                                    <div className="smaller text-secondary">LIKES</div>
                                                </div>
                                                <button className="btn btn-link text-primary p-0 ms-2"><Plus size={24} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'announcements' && (
                <div className="broadcast-center-view animate-fade-in">
                    <div className="row g-4">
                        {announcements.map(ann => (
                            <div key={ann.id} className="col-12">
                                <div className={`glass-card p-4 announcement-item-v2 border-opacity-10 ${ann.urgent ? 'border-start border-4 border-danger bg-danger bg-opacity-5' : 'border-start border-4 border-primary'}`}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className={`p-2 rounded-circle ${ann.urgent ? 'bg-danger bg-opacity-10 text-danger' : 'bg-primary bg-opacity-10 text-primary'}`}>
                                                <Megaphone size={20} />
                                            </div>
                                            <h5 className="fw-bold m-0 text-white">{ann.title}</h5>
                                        </div>
                                        <span className="badge bg-white bg-opacity-5 text-secondary smaller py-2 px-3 rounded-pill">{ann.date}</span>
                                    </div>
                                    <p className="text-secondary small mb-0 mt-3">{ann.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'support' && (
                <div className="support-helpdesk-view text-center py-5 animate-fade-in">
                    <div className="max-w-400 mx-auto">
                        <div className="support-glow-icon mx-auto mb-4">
                            <ShieldQuestion size={64} className="text-primary" />
                        </div>
                        <h4 className="fw-bold mb-3">Professional Support</h4>
                        <p className="text-secondary small mb-4">Experiencing technical issues or have academic queries? Our dedicated support team is available 24/7 to assist you.</p>
                        <button className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-primary" onClick={() => navigate('/student/support')}>
                            Open New Support Ticket
                        </button>
                        <div className="mt-5 pt-3 d-flex justify-content-center gap-4 border-top border-white border-opacity-5">
                            <div className="smaller text-secondary d-flex align-items-center gap-2"><div className="dot bg-success"></div> Response time &lt; 2h</div>
                            <div className="smaller text-secondary d-flex align-items-center gap-2"><div className="dot bg-primary"></div> Premium support active</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCommunication;
