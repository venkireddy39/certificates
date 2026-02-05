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

    // --- HANDLERS ---
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

    // --- SUB-COMPONENTS ---
    const MessagesView = () => (
        <div className="comm-layout">
            <div className="comm-sidebar">
                <div className="comm-search-wrapper">
                    <Search size={18} className="comm-search-icon" />
                    <input type="text" className="comm-search-input" placeholder="Search chats..." />
                </div>
                <div className="chat-list">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`chat-item d-flex gap-3 align-items-center ${selectedChat === chat.id ? 'active' : ''}`}
                            onClick={() => setSelectedChat(chat.id)}
                        >
                            <div className="position-relative">
                                <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                                {chat.online && <Circle size={10} className="position-absolute bottom-0 end-0 text-success fill-success" fill="currentColor" />}
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 text-truncate fw-bold">{chat.name}</h6>
                                    <span className="x-small text-secondary">{chat.time}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-1">
                                    <p className="mb-0 text-truncate text-secondary x-small">{chat.lastMsg}</p>
                                    {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="comm-main">
                <div className="chat-header">
                    <div className="d-flex align-items-center gap-3">
                        <img src={activeChat.avatar} alt={activeChat.name} className="chat-avatar" style={{ width: '40px', height: '40px' }} />
                        <div>
                            <h6 className="mb-0 fw-bold">{activeChat.name}</h6>
                            <span className={`x-small ${activeChat.online ? 'text-success' : 'text-secondary'}`}>
                                {activeChat.online ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="messages-container">
                    {messages.filter(m => m.chatId === selectedChat).map(m => (
                        <div key={m.id} className={`message-bubble ${m.sender === 'me' ? 'message-sent' : 'message-received'}`}>
                            {m.text}
                            <div className="d-flex align-items-center justify-content-end gap-1 mt-1">
                                <span className="message-time">{m.time}</span>
                                {m.sender === 'me' && <CheckCheck size={14} className={m.status === 'read' ? 'text-info' : 'text-secondary'} />}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <div className="input-wrapper">
                        <button type="button" className="btn btn-link p-0 text-secondary"><Paperclip size={20} /></button>
                        <input type="text" className="message-input" placeholder="Type message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                        <button type="submit" className="send-btn"><Send size={18} /></button>
                    </div>
                </form>
            </div>
        </div>
    );

    const ForumsView = () => (
        <div className="scrollbox">
            <div className="d-flex justify-content-between mb-4 mt-2">
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-2">
                        <Filter size={14} /> Filter
                    </button>
                    <select className="form-select bg-dark border-secondary text-white btn-sm" style={{ width: '150px' }}>
                        <option>All Topics</option>
                        <option>Academic</option>
                        <option>Lifestyle</option>
                    </select>
                </div>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-2">
                    <Plus size={16} /> New Topic
                </button>
            </div>
            <div className="row g-3">
                {forums.map(forum => (
                    <div key={forum.id} className="col-12">
                        <div className="forum-card">
                            <h5 className="fw-bold mb-2">{forum.title}</h5>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <span className="badge bg-primary bg-opacity-10 text-primary">{forum.category}</span>
                            </div>
                            <div className="forum-meta">
                                <span className="d-flex align-items-center gap-1"><User size={14} /> {forum.author}</span>
                                <span className="d-flex align-items-center gap-1"><Clock size={14} /> {forum.time}</span>
                                <span className="ms-auto d-flex align-items-center gap-3">
                                    <span className="d-flex align-items-center gap-1"><MessageSquare size={14} /> {forum.replies}</span>
                                    <span className="d-flex align-items-center gap-1"><ThumbsUp size={14} /> {forum.likes}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const AnnouncementsView = () => (
        <div className="scrollbox">
            <div className="d-flex flex-column gap-3 mt-2">
                {announcements.map(ann => (
                    <div key={ann.id} className={`announcement-card ${ann.urgent ? 'urgent' : ''}`}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className={`fw-bold m-0 ${ann.urgent ? 'text-danger' : 'text-primary'}`}>
                                {ann.urgent && <Megaphone size={18} className="me-2" />}
                                {ann.title}
                            </h5>
                            <span className="x-small text-secondary">{ann.date}</span>
                        </div>
                        <p className="text-secondary small mb-0">{ann.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="student-communication-container">
            <div className="mb-4">
                <h3 className="fw-bold">Communication Hub</h3>
                <p className="text-secondary small">Your central place for DMs, forums, and official updates.</p>
            </div>

            <div className="comm-tabs">
                <button className={`comm-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                    <MessageSquare size={18} /> Messages
                </button>
                <button className={`comm-tab ${activeTab === 'forums' ? 'active' : ''}`} onClick={() => setActiveTab('forums')}>
                    <Users size={18} /> Forums
                </button>
                <button className={`comm-tab ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
                    <Megaphone size={18} /> Announcements
                </button>
                <button className={`comm-tab ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
                    <ShieldQuestion size={18} /> Help Desk
                </button>
            </div>

            {activeTab === 'messages' && <MessagesView />}
            {activeTab === 'forums' && <ForumsView />}
            {activeTab === 'announcements' && <AnnouncementsView />}
            {activeTab === 'support' && (
                <div className="text-center py-5 glass-card">
                    <ShieldQuestion size={48} className="text-secondary opacity-25 mb-3" />
                    <h5>Need Help?</h5>
                    <p className="text-secondary small">Submit a ticket and our support team will get back to you.</p>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/student/support')}>Create Ticket</button>
                </div>
            )}
        </div>
    );
};

export default StudentCommunication;
