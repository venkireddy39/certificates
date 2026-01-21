import { MockAPI } from './mockData';
export { MockAPI };

/* =========================
   RESOURCE (BOOK) SERVICE
   ========================= */

export const BookService = {
    getAllResources: async () => {
        return MockAPI.resources.getAll();
    },

    getPhysicalResources: async () => {
        const all = await MockAPI.resources.getAll();
        return all.filter(x => x.type === 'PHYSICAL');
    },

    getDigitalResources: async () => {
        const all = await MockAPI.resources.getAll();
        return all.filter(x => x.type === 'DIGITAL');
    },

    createResource: async (resource) => {
        return MockAPI.resources.create(resource);
    },

    updateResource: async (id, updates) => {
        return MockAPI.resources.update(id, updates);
    },

    deleteResource: async (id) => {
        return MockAPI.resources.delete(id);
    }
};

/* =========================
   MEMBER SERVICE
   ========================= */

export const MemberService = {
    getAllMembers: async () => {
        return MockAPI.users.getAll();
    },

    createMember: async (member) => {
        return MockAPI.users.create(member);
    },

    updateMember: async (id, updates) => {
        return MockAPI.users.update(id, updates);
    },

    deleteMember: async (id) => {
        return MockAPI.users.delete(id);
    }
};

/* =========================
   ISSUE / RETURN SERVICE
   ========================= */

export const IssueService = {
    getAllIssues: async () => {
        return MockAPI.issues.getAll();
    },

    // Step 1: Validate Member Eligibility
    validateEligibility: async (memberId) => {
        // Mock check
        const users = await MockAPI.users.getAll();
        const user = users.find(u => u.id === memberId || u.memberId === memberId);

        if (!user) throw new Error('Member not found');
        if (user.status === 'BLOCKED') throw new Error('Member is blocked');

        // Check active issues count vs limit (simplified mock rule)
        const issues = await MockAPI.issues.getAll();
        const activeCount = issues.filter(i => i.userId === user.id && i.status === 'ISSUED').length;

        // Mock limit: This should ideally come from Role/Category settings
        const limit = ['MEMBER', 'STUDENT'].includes(user.role) ? 3 : 10;

        if (activeCount >= limit) {
            throw new Error(`Member limit reached (${activeCount}/${limit})`);
        }

        return { eligible: true, user };
    },

    createIssue: async (issue) => {
        return MockAPI.issues.create(issue);
    },

    // Step 4: Issue Copy
    issueCopy: async ({ memberId, copyId, resourceId }) => {
        // 1. Get Resource & Copy
        const resources = await MockAPI.resources.getAll();
        const res = resources.find(r => r.id === resourceId);
        if (!res) throw new Error('Resource not found');

        const copy = res.copies?.find(c => c.id === copyId || c.uuid === copyId);
        if (!copy) throw new Error('Copy not found');
        if (copy.status !== 'AVAILABLE') throw new Error('Copy is not available');

        // 2. Calculate Due Date (mock rule: 14 days)
        const due = new Date();
        due.setDate(due.getDate() + 14);

        // 3. Create Transaction
        const newIssue = await MockAPI.issues.create({
            resourceId: res.id,
            resourceTitle: res.title, // beneficial for UI
            userId: memberId,
            copyId: copy.uuid,
            barcode: copy.barcode,
            type: 'OFFLINE_ISSUE',
            status: 'ISSUED',
            issueDate: new Date().toISOString(),
            dueDate: due.toISOString(),
            fine: 0
        });

        // 4. Update Copy Status
        copy.status = 'ISSUED';
        await MockAPI.resources.update(res.id, { copies: res.copies });

        return newIssue;
    },

    updateIssue: async (id, updates) => {
        return MockAPI.issues.update(id, updates);
    },

    renewIssue: async (id) => {
        const issues = await MockAPI.issues.getAll();
        const issue = issues.find(i => i.id === id);
        if (!issue) throw new Error('Issue not found');

        const currentDue = new Date(issue.dueDate);
        const newDue = new Date(currentDue.setDate(currentDue.getDate() + 14));

        return MockAPI.issues.update(id, {
            dueDate: newDue.toISOString()
        });
    },

    // RETURN FLOW - Preview
    getReturnPreview: async (issueId) => {
        const issues = await MockAPI.issues.getAll();
        const issue = issues.find(i => i.id === issueId);
        if (!issue) throw new Error('Issue not found');

        const now = new Date();
        const due = new Date(issue.dueDate);

        // Calculate overdue
        const diffTime = now - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const overdueDays = diffDays > 0 ? diffDays : 0;

        // Mock Fine (e.g., 5 per day)
        const fineAmount = overdueDays * 5;

        return {
            issue,
            overdueDays,
            fineAmount,
            returnDate: now.toISOString()
        };
    },

    // RETURN FLOW - Confirm
    returnIssue: async (id, { waiveFine } = {}) => {
        // 1. Get Issue
        const issues = await MockAPI.issues.getAll();
        const issue = issues.find(i => i.id === id);
        if (!issue) throw new Error('Issue not found');

        // Recalculate fine for record keeping (mock)
        const preview = await IssueService.getReturnPreview(id);
        const finalFine = waiveFine ? 0 : preview.fineAmount;

        // 2. Update Issue
        const updatedIssue = await MockAPI.issues.update(id, {
            status: 'RETURNED',
            returnDate: new Date().toISOString(),
            fine: finalFine
        });

        // 3. Update Copy
        if (issue && issue.copyId) {
            const resources = await MockAPI.resources.getAll();
            const res = resources.find(r => r.id === issue.resourceId);
            if (res) {
                const copy = res.copies?.find(c => c.uuid === issue.copyId || c.id === issue.copyId);
                if (copy) {
                    copy.status = 'AVAILABLE';
                    await MockAPI.resources.update(res.id, { copies: res.copies });
                }
            }
        }

        return updatedIssue;
    }
};

/* =========================
   RESERVATION SERVICE
   ========================= */

export const ReservationService = {
    getAllReservations: async () => {
        return MockAPI.reservations.getAll();
    },

    createReservation: async (reservation) => {
        return MockAPI.reservations.create(reservation);
    },

    updateReservation: async (id, updates) => {
        return MockAPI.reservations.update(id, updates);
    },

    cancelReservation: async (id) => {
        return MockAPI.reservations.delete(id);
    },

    fulfillReservation: async (id) => {
        return MockAPI.reservations.update(id, { status: 'FULFILLED' });
    },

    rejectReservation: async (id) => {
        return MockAPI.reservations.update(id, { status: 'REJECTED' });
    }
};

/* =========================
   DASHBOARD SERVICE
   ========================= */

export const DashboardService = {
    getSummary: async () => {
        const [resources, issues] = await Promise.all([
            MockAPI.resources.getAll(),
            MockAPI.issues.getAll()
        ]);

        const now = new Date();
        return {
            totalResources: resources.length,
            activeIssues: issues.filter(i => i.status === 'ISSUED').length,
            overdue: issues.filter(
                i => i.status === 'ISSUED' && i.dueDate && new Date(i.dueDate) < now
            ).length,
            digitalAccess: issues.filter(i => i.type === 'ONLINE_ACCESS').length
        };
    },

    getTrends: async () => {
        return MockAPI.dashboard.getTrends();
    },

    getRecentActivity: async () => {
        return MockAPI.dashboard.getActivity();
    }
};

/* =========================
   SETTINGS SERVICE
   ========================= */

const DEFAULT_SETTINGS = {
    rules: {
        student: { maxBooks: 3, issueDays: 14 },
        faculty: { maxBooks: 10, issueDays: 90 },
        fines: { perDay: 5 },
        reservations: { expiryHours: 48 }
    },
    notifications: {
        'Email Alerts': true,
        'SMS Alerts': false,
        'Overdue Reminders': true,
        'New Arrivals': true
    }
};

export const SettingsService = {
    getSettings: async () => {
        // Mock latency
        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            const stored = localStorage.getItem('lib_settings');
            return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    },

    updateSettings: async (settings) => {
        // Mock latency
        await new Promise(resolve => setTimeout(resolve, 400));

        localStorage.setItem('lib_settings', JSON.stringify(settings));
        return settings;
    }
};
