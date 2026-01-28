/* =========================
   LIBRARY SERVICE - REAL API
   Connects to backend at /library endpoint
   ========================= */

const API_BASE_URL = "/library";

// Helper function to get token securely
const getToken = () => {
    return localStorage.getItem("authToken") || import.meta.env.VITE_DEV_AUTH_TOKEN;
};

// Helper function to get headers with authorization
const getHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/* =========================
   BOOKS API
   ========================= */

export const booksAPI = {
    // GET /library/books - Get all books
    getAllBooks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error fetching books: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (getAllBooks):", error);
            throw error;
        }
    },

    // POST /library/books - Create a new book
    createBook: async (bookData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(bookData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server Error Response:", errorText);
                throw new Error(`Error creating book: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (createBook):", error);
            throw error;
        }
    },

    // PUT /library/books/{id} - Update a book
    updateBook: async (id, bookData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(bookData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server Error Response:", errorText);
                throw new Error(`Error updating book: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (updateBook):", error);
            throw error;
        }
    },

    // PATCH /library/books/{id} - Partially update a book
    patchBook: async (id, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error patching book: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (patchBook):", error);
            throw error;
        }
    },

    // DELETE /library/books/{id} - Delete a book
    deleteBook: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error deleting book: ${response.status} - ${errorText}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Service Error (deleteBook):", error);
            throw error;
        }
    }
};

/* =========================
   CATEGORIES API
   ========================= */

export const categoriesAPI = {
    // GET /library/categories
    getAllCategories: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error fetching categories: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (getAllCategories):", error);
            throw error;
        }
    },

    // POST /library/categories
    createCategory: async (categoryData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(categoryData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error creating category: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (createCategory):", error);
            throw error;
        }
    },

    // PUT /library/categories/{id}
    updateCategory: async (id, categoryData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(categoryData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error updating category: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (updateCategory):", error);
            throw error;
        }
    },

    // PATCH /library/categories/{id}
    patchCategory: async (id, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error(`Error patching category: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (patchCategory):", error);
            throw error;
        }
    },

    // DELETE /library/categories/{id}
    deleteCategory: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error deleting category: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Service Error (deleteCategory):", error);
            throw error;
        }
    }
};

/* =========================
   MEMBERS API
   ========================= */

export const membersAPI = {
    // GET /library/members
    getAllMembers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/members`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error fetching members: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (getAllMembers):", error);
            throw error;
        }
    },

    // GET /library/members/{id}
    getMemberById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/members/${id}`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error fetching member ${id}: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (getMemberById):", error);
            throw error;
        }
    },

    // POST /library/members
    createMember: async (memberData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/members`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(memberData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error creating member: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (createMember):", error);
            throw error;
        }
    },

    // PUT /library/members/{id}
    updateMember: async (id, memberData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/members/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(memberData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error updating member: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (updateMember):", error);
            throw error;
        }
    },

    // DELETE /library/members/{id}
    deleteMember: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/members/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error deleting member: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Service Error (deleteMember):", error);
            throw error;
        }
    }
};

/* =========================
   ISSUES API (Book Issue/Return)
   ========================= */

export const issuesAPI = {
    // GET /library/issues
    getAllIssues: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/issues`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error fetching issues: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (getAllIssues):", error);
            throw error;
        }
    },

    // POST /library/issue - Issue a book to a member
    issueBook: async (bookId, memberId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/issue`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    bookId: bookId,
                    memberId: memberId
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error issuing book: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (issueBook):", error);
            throw error;
        }
    },

    // PUT /library/return/{id} - Return a book
    returnBook: async (issueId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/return/${issueId}`, {
                method: 'PUT',
                headers: getHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error returning book: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (returnBook):", error);
            throw error;
        }
    },

    // PATCH /library/issues/{id}
    patchIssue: async (id, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error(`Error patching issue: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (patchIssue):", error);
            throw error;
        }
    },

    // DELETE /library/issues/{id}
    deleteIssue: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error deleting issue: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Service Error (deleteIssue):", error);
            throw error;
        }
    }
};

/* =========================
   RESERVATIONS API
   ========================= */

export const reservationsAPI = {
    // GET /library/reservations
    getAllReservations: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error fetching reservations: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (getAllReservations):", error);
            throw error;
        }
    },

    // POST /library/reservations
    createReservation: async (reservationData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(reservationData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error creating reservation: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (createReservation):", error);
            throw error;
        }
    },

    // PUT /library/reservations/{id}
    updateReservation: async (id, reservationData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(reservationData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error updating reservation: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (updateReservation):", error);
            throw error;
        }
    },

    // PATCH /library/reservations/{id}
    patchReservation: async (id, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error(`Error patching reservation: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (patchReservation):", error);
            throw error;
        }
    },

    // DELETE /library/reservations/{id}
    deleteReservation: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error deleting reservation: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Service Error (deleteReservation):", error);
            throw error;
        }
    }
};

/* =========================
   FINES API
   ========================= */

export const finesAPI = {
    // GET /library/fines
    getAllFines: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/fines`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error fetching fines: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (getAllFines):", error);
            throw error;
        }
    },

    // POST /library/fines
    createFine: async (fineData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fines`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(fineData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error creating fine: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (createFine):", error);
            throw error;
        }
    },

    // PUT /library/fines/{id}
    updateFine: async (id, fineData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fines/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(fineData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error updating fine: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (updateFine):", error);
            throw error;
        }
    },

    // PATCH /library/fines/{id}
    patchFine: async (id, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fines/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error(`Error patching fine: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (patchFine):", error);
            throw error;
        }
    },

    // DELETE /library/fines/{id}
    deleteFine: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fines/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error deleting fine: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Service Error (deleteFine):", error);
            throw error;
        }
    }
};

/* =========================
   SETTINGS API
   ========================= */

export const settingsAPI = {
    // GET /library/settings
    getSettings: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/settings`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error fetching settings: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (getSettings):", error);
            throw error;
        }
    },

    // POST /library/settings
    createSettings: async (settingsData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/settings`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(settingsData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error creating settings: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (createSettings):", error);
            throw error;
        }
    },

    // PUT /library/settings/{id}
    updateSettings: async (id, settingsData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/settings/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(settingsData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error updating settings: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Service Error (updateSettings):", error);
            throw error;
        }
    },

    // DELETE /library/settings/{id}
    deleteSettings: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/settings/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Error deleting settings: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Service Error (deleteSettings):", error);
            throw error;
        }
    }
};

// Export unified library service
export const libraryService = {
    books: booksAPI,
    categories: categoriesAPI,
    members: membersAPI,
    issues: issuesAPI,
    reservations: reservationsAPI,
    fines: finesAPI,
    settings: settingsAPI
};
