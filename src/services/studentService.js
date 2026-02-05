/**
 * STUDENT SERVICE (MOCK / DEMO ONLY)
 * 
 * Provides static data for UI demonstrations without requiring a running backend.
 */

export const studentService = {
    // 1. Get My Enrollment (Mocked)
    getMyBatches: async () => {
        return [
            {
                id: "batch-101",
                studentBatchId: "batch-101",
                batchId: "batch-101",
                batchName: "Advanced Full Stack Development",
                instructorName: "Dr. Sarah Johnson",
                startDate: "2024-01-10",
                courseId: "course-202"
            }
        ];
    },

    // 2. Get My Courses (Mocked)
    getMyCourses: async () => {
        return [
            {
                id: "course-202",
                courseId: "course-202",
                title: "Advanced Full Stack Development",
                courseName: "Advanced Full Stack Development",
                progress: 65,
                thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
                category: "Programming",
                totalLessons: 24,
                completedLessons: 16
            },
            {
                id: "course-205",
                courseId: "course-205",
                title: "UI/UX Design Masterclass",
                courseName: "UI/UX Design Masterclass",
                progress: 30,
                thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=60",
                category: "Design",
                totalLessons: 18,
                completedLessons: 5
            }
        ];
    },

    // 3. Get My Attendance (Mocked)
    getMyAttendance: async () => {
        return [
            { date: "2024-02-01", status: "Present" },
            { date: "2024-02-02", status: "Present" },
            { date: "2024-02-03", status: "Absent" },
            { date: "2024-02-04", status: "Present" },
            { date: "2024-02-05", status: "Present" }
        ];
    },

    // 4. Get Course Content (Mocked)
    getCourseContent: async (courseId) => {
        return {
            course: {
                id: courseId,
                title: "Advanced Full Stack Development",
                progress: 65
            },
            lessons: [
                {
                    id: "l1",
                    title: "Introduction to React",
                    duration: "12:30",
                    isCompleted: true,
                    type: "video",
                    fileUrl: "demo.mp4"
                },
                {
                    id: "l2",
                    title: "Component Lifecycle Live Session",
                    duration: "60:00",
                    isCompleted: false,
                    type: "live",
                    joinUrl: "https://zoom.us/j/123456789"
                },
                {
                    id: "l3",
                    title: "React Hooks Cheatsheet",
                    duration: "5 pgs",
                    isCompleted: false,
                    type: "pdf",
                    fileUrl: "/docs/hooks-cheatsheet.pdf"
                },
                {
                    id: "l4",
                    title: "Official React Documentation",
                    duration: "Link",
                    isCompleted: false,
                    type: "link",
                    fileUrl: "https://react.dev"
                },
                {
                    id: "l5",
                    title: "Advanced Redux Toolkit Patterns",
                    duration: "45:20",
                    isCompleted: false,
                    type: "video",
                    fileUrl: "demo.mp4"
                }
            ]
        };
    },

    // 5. Get My Certificates (Mocked)
    getMyCertificates: async () => {
        return [
            {
                id: "cert-901",
                title: "Full Stack Web Development",
                issueDate: "2024-01-20",
                credentialId: "LMS-FS-2024-XP9",
                issuer: "ClassX360 Academy",
                type: "Completion"
            }
        ];
    },

    // 6. Get Profile (Mocked)
    getProfile: async () => {
        return {
            id: "STU-123456",
            userId: "STU-123456",
            name: "Ajay Kumar",
            firstName: "Ajay",
            lastName: "Kumar",
            email: "student@gmail.com",
            studentId: "STU2024001",
            phone: "+91 98765 43210",
            address: "LMS Learning Campus, Bangalore",
            enrollmentDate: "2024-01-15",
            avatar: null,
            level: "Silver Learner",
            xp: 750,
            nextLevelXp: 1000
        };
    },

    // 7. Update Profile (Mocked)
    updateProfile: async (profileData) => {
        console.log("Mock updateProfile with:", profileData);
        // Simulate local storage update for session consistency if needed
        const current = JSON.parse(localStorage.getItem('auth_user') || '{}');
        const updated = { ...current, ...profileData };
        localStorage.setItem('auth_user', JSON.stringify(updated));
        return { success: true, user: updated };
    },

    // 8. Get Calendar Events (Mocked)
    getCalendarEvents: async () => {
        return [
            {
                id: 1,
                title: 'React Workshop',
                date: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
                type: 'workshop',
                description: 'Deep dive into React Hooks and Performance'
            },
            {
                id: 2,
                title: 'Project Submission',
                date: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
                type: 'deadline',
                description: 'Final submission for Full Stack Course'
            },
            {
                id: 3,
                title: 'Live Q&A Session',
                date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
                type: 'webinar',
                description: 'Open floor for questions with instructors'
            },
            {
                id: 4,
                title: 'UI/UX Design Review',
                date: new Date(new Date().setDate(new Date().getDate() + 10)),
                type: 'meeting',
                description: 'Reviewing student design portfolios'
            }
        ];
    },

    // 9. Get Grades (Mocked)
    getMyGrades: async () => {
        return {
            gpa: 3.8,
            totalCredits: 24,
            courses: [
                {
                    id: "c1",
                    courseName: "Advanced Full Stack Development",
                    grade: "A",
                    percentage: 92,
                    credits: 4,
                    status: "Completed",
                    semester: "Fall 2023",
                    breakdown: [
                        { name: "Midterm Exam", score: 88, weight: "30%" },
                        { name: "Final Project", score: 95, weight: "40%" },
                        { name: "Assignments", score: 92, weight: "30%" }
                    ]
                },
                {
                    id: "c2",
                    courseName: "UI/UX Design Masterclass",
                    grade: "A-",
                    percentage: 88,
                    credits: 3,
                    status: "In Progress",
                    semester: "Spring 2024",
                    breakdown: [
                        { name: "Wire-framing", score: 90, weight: "20%" },
                        { name: "User Research", score: 85, weight: "30%" },
                        { name: "Prototyping", score: 89, weight: "50%" }
                    ]
                },
                {
                    id: "c3",
                    courseName: "Database Management Systems",
                    grade: "B+",
                    percentage: 85,
                    credits: 4,
                    status: "Completed",
                    semester: "Fall 2023",
                    breakdown: [
                        { name: "SQL Queries", score: 82, weight: "40%" },
                        { name: "Normalization", score: 88, weight: "60%" }
                    ]
                }
            ]
        };
    },


    // 11. Get Assignments (Mocked)
    getMyAssignments: async () => {
        return [
            {
                id: "a1",
                title: "Build a Todo App",
                courseName: "Advanced Full Stack Development",
                dueDate: "2024-02-20",
                status: "Pending",
                totalMarks: 50,
                instructions: "Create a fully functional Todo App using React and LocalStorage."
            },
            {
                id: "a2",
                title: "UI Kit Design System",
                courseName: "UI/UX Design Masterclass",
                dueDate: "2024-02-15",
                status: "Submitted",
                submittedDate: "2024-02-14",
                grade: "A",
                totalMarks: 100,
                obtainedMarks: 95,
                feedback: "Excellent use of typography and color variables."
            },
            {
                id: "a3",
                title: "Database Schema Deviation",
                courseName: "Database Management Systems",
                dueDate: "2024-02-10",
                status: "Overdue",
                totalMarks: 30,
                instructions: "Analyze the provided ERD and find normalization errors."
            }
        ];
    },

    // 12. Get Notifications (Mocked)
    getNotifications: async () => {
        return [
            {
                id: "n1",
                title: "Class Rescheduled",
                message: "The 'Advanced React Patterns' class scheduled for today at 10:00 AM has been moved to 2:00 PM.",
                time: "2 hours ago",
                type: "warning",
                read: false
            },
            {
                id: "n2",
                title: "Assignment Graded",
                message: "Your submission for 'UI Kit Design System' has been graded. You scored 95/100.",
                time: "1 day ago",
                type: "success",
                read: true
            },
            {
                id: "n3",
                title: "New Course Available",
                message: "Check out the new 'Introduction to AI' course added to your catalog.",
                time: "2 days ago",
                type: "info",
                read: true
            },
            {
                id: "n4",
                title: "System Maintenance",
                message: "The LMS will be down for scheduled maintenance on Saturday from 11 PM to 3 AM.",
                time: "3 days ago",
                type: "alert",
                read: true
            }
        ];
    },

    // 13. Get Webinars (Mocked)
    getWebinars: async () => {
        return [
            {
                id: "w1",
                title: "Future of AI in Web Development",
                host: "Dr. Alan Turing",
                date: "2024-03-10",
                startTime: "05:00 PM",
                duration: "90 Mins",
                status: "Upcoming",
                thumbnail: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&auto=format&fit=crop&q=60",
                attendees: 120,
                isRegistered: true
            },
            {
                id: "w2",
                title: "Mastering Flexbox & Grid",
                host: "Sarah Conner",
                date: "2024-03-05",
                startTime: "10:00 AM",
                duration: "60 Mins",
                status: "Live",
                thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60",
                attendees: 340,
                isRegistered: true
            },
            {
                id: "w3",
                title: "Career Paths in DevOps",
                host: "John Doe",
                date: "2024-02-28",
                startTime: "02:00 PM",
                duration: "60 Mins",
                status: "Ended",
                thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
                attendees: 85,
                recordingUrl: "demo.mp4"
            }
        ];
    }
};
