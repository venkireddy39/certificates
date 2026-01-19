import { addDays, subDays } from 'date-fns';

// --- INITIAL DEFAULT DATA ---

const DEFAULT_USERS = [
    {
        id: 'u1',
        memberId: 'MEM-001',
        name: 'Sarah Connor',
        email: 'sarah@admin.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        joinedDate: '2023-01-01',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=0D8ABC&color=fff',
        membershipValidUntil: '2099-12-31',
        maxBooksAllowed: 100,
        fineAmount: 0
    },
    {
        id: 'u2',
        memberId: 'MEM-002',
        name: 'John Wick',
        email: 'john@library.com',
        role: 'LIBRARIAN',
        status: 'ACTIVE',
        joinedDate: '2023-02-15',
        avatar: 'https://ui-avatars.com/api/?name=John+Wick&background=eb4034&color=fff',
        membershipValidUntil: '2099-12-31',
        maxBooksAllowed: 100,
        fineAmount: 0
    },
    {
        id: 'u3',
        memberId: 'MEM-003',
        name: 'Peter Parker',
        email: 'peter@student.edu',
        role: 'STUDENT',
        status: 'ACTIVE',
        joinedDate: '2023-06-01',
        avatar: 'https://ui-avatars.com/api/?name=Peter+Parker&background=random',
        rollNumber: 'CS-2023-001',
        course: 'Computer Science',
        year: '2nd Year',
        semester: 3,
        membershipValidUntil: '2024-06-01',
        maxBooksAllowed: 3,
        fineAmount: 0,
        booksIssued: 1
    },
    {
        id: 'u4',
        memberId: 'MEM-004',
        name: 'Dr. Stephen Strange',
        email: 'strange@faculty.edu',
        role: 'FACULTY',
        status: 'ACTIVE',
        joinedDate: '2022-03-10',
        avatar: 'https://ui-avatars.com/api/?name=Stephen+Strange&background=random',
        employeeId: 'FAC-007',
        department: 'Mystic Arts (Philosophy)',
        designation: 'Senior Professor',
        membershipValidUntil: '2030-12-31',
        maxBooksAllowed: 10,
        fineAmount: 0,
        booksIssued: 2
    }
];

const DEFAULT_RESOURCES = [
    {
        id: 'b1',
        type: 'PHYSICAL',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0134685991',
        category: 'Software Engineering',
        publisher: 'Prentice Hall',
        cover: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg',
        barcode: 'P-1001',
        shelfLocation: 'A1-B2',
        totalCopies: 5,
        availableCopies: 3,
        copies: [
            { uuid: 'c1', barcode: 'P-1001-1', status: 'AVAILABLE', condition: 'GOOD' },
            { uuid: 'c2', barcode: 'P-1001-2', status: 'AVAILABLE', condition: 'GOOD' },
            { uuid: 'c3', barcode: 'P-1001-3', status: 'ISSUED', condition: 'GOOD' },
            { uuid: 'c4', barcode: 'P-1001-4', status: 'ISSUED', condition: 'GOOD' },
            { uuid: 'c5', barcode: 'P-1001-5', status: 'AVAILABLE', condition: 'GOOD' }
        ],
        condition: 'GOOD',
        status: 'AVAILABLE'
    },
    {
        id: 'b2',
        type: 'PHYSICAL',
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        isbn: '978-0201616224',
        category: 'Software Engineering',
        publisher: 'Addison-Wesley',
        cover: 'https://m.media-amazon.com/images/I/51W1sBPO7tL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg',
        barcode: 'P-1002',
        shelfLocation: 'A1-B3',
        totalCopies: 3,
        availableCopies: 0,
        copies: [
            { uuid: 'c6', barcode: 'P-1002-1', status: 'ISSUED', condition: 'GOOD' },
            { uuid: 'c7', barcode: 'P-1002-2', status: 'ISSUED', condition: 'GOOD' },
            { uuid: 'c8', barcode: 'P-1002-3', status: 'ISSUED', condition: 'GOOD' }
        ],
        condition: 'GOOD',
        status: 'ISSUED'
    },
    {
        id: 'd1',
        type: 'DIGITAL',
        title: 'Advanced React Patterns',
        author: 'Kent C. Dodds',
        category: 'Web Development',
        accessUrl: 'https://learning.portal.com/react-adv',
        cover: 'https://m.media-amazon.com/images/I/41+9g5Q5e+L._SX218_BO1,204,203,200_QL40_FMwebp_.jpg',
        digitalType: 'E-BOOK',
        format: 'PDF',
        licenseExpiry: '2025-12-31',
        concurrentAccessLimit: 50,
        activeAccess: 12
    },
    {
        id: 'd2',
        type: 'DIGITAL',
        title: 'IEEE Trans. on Software Eng.',
        author: 'IEEE',
        category: 'Research',
        accessUrl: 'https://ieee.org/journal/tse-2024',
        cover: 'https://ui-avatars.com/api/?name=IEEE&background=0D8ABC&color=fff',
        digitalType: 'JOURNAL',
        format: 'ONLINE',
        licenseExpiry: '2030-01-01',
        concurrentAccessLimit: 999,
        activeAccess: 45
    }
];

const DEFAULT_TRANSACTIONS = [
    {
        id: 't1',
        resourceId: 'b2',
        userId: 'u3',
        type: 'OFFLINE_ISSUE',
        issueDate: subDays(new Date(), 5).toISOString(),
        dueDate: addDays(new Date(), 9).toISOString(),
        returnDate: null,
        status: 'ISSUED',
        fine: 0
    },
    {
        id: 't2',
        resourceId: 'd1',
        userId: 'u4',
        type: 'ONLINE_ACCESS',
        accessGrantedAt: subDays(new Date(), 1).toISOString(),
        accessExpiresAt: addDays(new Date(), 1).toISOString(),
        status: 'ACTIVE'
    }
];

const DEFAULT_RESERVATIONS = [
    {
        id: 'r1',
        resourceId: 'b2',
        userId: 'u3',
        reservationDate: subDays(new Date(), 2).toISOString(),
        status: 'PENDING',
        priority: 'HIGH',
        expiryDate: addDays(new Date(), 5).toISOString()
    }
];

// --- STORAGE HELPERS ---

const STORAGE_KEYS = {
    USERS: 'lib_users',
    RESOURCES: 'lib_resources',
    TRANSACTIONS: 'lib_transactions',
    RESERVATIONS: 'lib_reservations'
};

const getStorage = (key, defaultData) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultData;
    } catch (e) {
        console.error('LocalStorage read error', e);
        return defaultData;
    }
};

const setStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('LocalStorage write error', e);
    }
};

// --- API IMPLEMENTATION ---

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const MockAPI = {
    reservations: {
        getAll: async () => {
            await delay(300);
            return getStorage(STORAGE_KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
        },
        create: async (res) => {
            await delay(400);
            const list = getStorage(STORAGE_KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
            const newRes = { ...res, id: Math.random().toString(36).substr(2, 9) };
            list.push(newRes);
            setStorage(STORAGE_KEYS.RESERVATIONS, list);
            return newRes;
        },
        update: async (id, updates) => {
            await delay(400);
            const list = getStorage(STORAGE_KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
            const index = list.findIndex(r => r.id === id);
            if (index === -1) throw new Error('Reservation not found');
            list[index] = { ...list[index], ...updates };
            setStorage(STORAGE_KEYS.RESERVATIONS, list);
            return list[index];
        },
        delete: async (id) => {
            await delay(400);
            const list = getStorage(STORAGE_KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
            const filtered = list.filter(r => r.id !== id);
            setStorage(STORAGE_KEYS.RESERVATIONS, filtered);
            return true;
        }
    },
    users: {
        getAll: async () => {
            await delay(300);
            return getStorage(STORAGE_KEYS.USERS, DEFAULT_USERS);
        },
        create: async (user) => {
            await delay(400);
            const users = getStorage(STORAGE_KEYS.USERS, DEFAULT_USERS);
            const newUser = {
                ...user,
                id: Math.random().toString(36).substr(2, 9),
                memberId: user.memberId || `MEM-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
            };
            users.push(newUser);
            setStorage(STORAGE_KEYS.USERS, users);
            return newUser;
        },
        update: async (id, updates) => {
            await delay(400);
            const users = getStorage(STORAGE_KEYS.USERS, DEFAULT_USERS);
            const index = users.findIndex(u => u.id === id);
            if (index === -1) throw new Error('User not found');
            users[index] = { ...users[index], ...updates };
            setStorage(STORAGE_KEYS.USERS, users);
            return users[index];
        },
        delete: async (id) => {
            await delay(400);
            const users = getStorage(STORAGE_KEYS.USERS, DEFAULT_USERS);
            const filtered = users.filter(u => u.id !== id);
            setStorage(STORAGE_KEYS.USERS, filtered);
            return true;
        }
    },
    resources: {
        getAll: async () => {
            await delay(200);
            return getStorage(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);
        },
        create: async (resource) => {
            await delay(500);
            const resources = getStorage(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);

            let finalResource = { ...resource };
            finalResource.id = Math.random().toString(36).substr(2, 9); // Generate ID

            // Backend Requirement: Generate Copies & Barcodes
            if (finalResource.type === 'PHYSICAL') {
                const count = parseInt(finalResource.totalCopies) || 1;
                const copies = [];
                // Simple unique generation for mock
                const timestamp = Date.now().toString().slice(-6);

                for (let i = 0; i < count; i++) {
                    copies.push({
                        uuid: Math.random().toString(36).substr(2, 9),
                        barcode: `LIB-2026-${timestamp}-${i + 100}`, // Example format
                        status: 'AVAILABLE',
                        condition: 'GOOD',
                        shelfLocation: finalResource.shelfLocation || 'Unassigned'
                    });
                }
                finalResource.copies = copies;
                finalResource.availableCopies = count;
                // Legacy support property if needed
                if (!finalResource.barcode && copies.length > 0) {
                    finalResource.barcode = copies[0].barcode;
                }
            }

            resources.push(finalResource);
            setStorage(STORAGE_KEYS.RESOURCES, resources);
            return finalResource;
        },
        update: async (id, updates) => {
            await delay(400);
            const resources = getStorage(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);
            const index = resources.findIndex(r => r.id === id);
            if (index === -1) throw new Error('Resource not found');
            resources[index] = { ...resources[index], ...updates };
            setStorage(STORAGE_KEYS.RESOURCES, resources);
            return resources[index];
        },
        delete: async (id) => {
            await delay(400);
            const resources = getStorage(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);
            const filtered = resources.filter(r => r.id !== id);
            setStorage(STORAGE_KEYS.RESOURCES, filtered);
            return true;
        }
    },
    issues: {
        getAll: async () => {
            await delay(300);
            return getStorage(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
        },
        create: async (txn) => {
            await delay(400);
            const txns = getStorage(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
            const newTxn = { ...txn, id: Math.random().toString(36).substr(2, 9) };
            txns.push(newTxn);
            setStorage(STORAGE_KEYS.TRANSACTIONS, txns);
            return newTxn;
        },
        update: async (id, updates) => {
            await delay(400);
            const txns = getStorage(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
            const index = txns.findIndex(t => t.id === id);
            if (index === -1) throw new Error('Transaction not found');
            txns[index] = { ...txns[index], ...updates };
            setStorage(STORAGE_KEYS.TRANSACTIONS, txns);
            return txns[index];
        }
    },
    dashboard: {
        getTrends: async () => {
            await delay(500);
            // Mock trend data
            return [
                { name: 'Jan', issues: 120, returns: 100, fines: 50 },
                { name: 'Feb', issues: 150, returns: 130, fines: 80 },
                { name: 'Mar', issues: 200, returns: 160, fines: 120 },
                { name: 'Apr', issues: 180, returns: 170, fines: 90 },
                { name: 'May', issues: 220, returns: 190, fines: 150 },
                { name: 'Jun', issues: 250, returns: 200, fines: 200 }
            ];
        },
        getActivity: async () => {
            await delay(400);
            const txns = getStorage(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
            const users = getStorage(STORAGE_KEYS.USERS, DEFAULT_USERS);
            const resources = getStorage(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);

            return txns
                .sort((a, b) => new Date(b.issueDate || b.accessGrantedAt || 0) - new Date(a.issueDate || a.accessGrantedAt || 0))
                .slice(0, 5)
                .map(txn => {
                    const user = users.find(u => u.id === txn.userId) || { name: 'Unknown' };
                    const res = resources.find(r => r.id === txn.resourceId) || { title: 'Unknown Resource' };

                    let type = 'ISSUE';
                    if (txn.status === 'RETURNED') type = 'RETURN';
                    if (txn.type === 'ONLINE_ACCESS') type = 'ACCESS';

                    return {
                        id: txn.id,
                        type,
                        user: user.name,
                        resource: res.title,
                        time: txn.issueDate || txn.accessGrantedAt || new Date().toISOString(),
                        status: txn.status,
                        meta: type === 'ISSUE' ? `Due: ${new Date(txn.dueDate).toLocaleDateString()}` :
                            type === 'ACCESS' ? 'Online Session' : 'Returned'
                    };
                });
        }
    },
    // Compat Helpers
    books: {
        getAll: async () => {
            await delay(300);
            const all = getStorage(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);
            return all.filter(r => r.type === 'PHYSICAL');
        }
    }
};
