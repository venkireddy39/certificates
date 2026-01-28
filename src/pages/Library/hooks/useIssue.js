import { useState } from 'react';
import { IssueService, MemberService, BookService } from '../services/api';
import { useToast } from '../context/ToastContext';

export const useIssue = () => {
    const toast = useToast();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Data States
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedCopy, setSelectedCopy] = useState(null);
    const [completedIssue, setCompletedIssue] = useState(null);

    // Search Results
    const [memberResults, setMemberResults] = useState([]);
    const [bookResults, setBookResults] = useState([]);

    // --- STEP 1: MEMBER ---
    const searchMembers = async (query) => {
        if (!query) return;
        setLoading(true);
        try {
            // Fetch and filter members by search query
            const all = await MemberService.getAllMembers();
            const filtered = all.filter(m =>
                m.name.toLowerCase().includes(query.toLowerCase()) ||
                m.email.toLowerCase().includes(query.toLowerCase()) ||
                m.memberId?.toLowerCase().includes(query.toLowerCase())
            );
            setMemberResults(filtered);
        } catch {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const selectMember = async (member) => {
        setLoading(true);
        try {
            const { eligible, user } = await IssueService.validateEligibility(member.id);
            if (eligible) {
                setSelectedMember(user);
                setStep(2);
            }
        } catch (err) {
            toast.error(err.message || 'Member not eligible');
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: BOOK ---
    const searchBooks = async (query) => {
        if (!query) return;
        setLoading(true);
        try {
            const all = await BookService.getPhysicalResources();
            const filtered = all.filter(b =>
                b.title.toLowerCase().includes(query.toLowerCase()) ||
                b.author.toLowerCase().includes(query.toLowerCase()) ||
                b.isbn?.includes(query)
            );
            setBookResults(filtered);
        } catch {
            toast.error('Book search failed');
        } finally {
            setLoading(false);
        }
    };

    const selectBook = (book) => {
        setSelectedBook(book);
        setStep(3);
    };

    // --- STEP 3: COPY ---
    const validateBarcode = (barcode) => {
        if (!selectedBook?.copies) return false;
        const copy = selectedBook.copies.find(c => c.barcode === barcode && c.status === 'AVAILABLE');
        if (copy) {
            setSelectedCopy(copy);
            return true;
        }
        return false;
    };

    const selectCopy = (copy) => {
        setSelectedCopy(copy);
        // We stay on step 3 or move to 4 automatically if desired.
        // Let's require a manual "Next" or just move to 4.
        // Let's move to 4 (Confirm)
        setStep(4);
    };

    // --- STEP 4: CONFIRM ---
    const confirmIssue = async () => {
        setLoading(true);
        try {
            const issue = await IssueService.issueCopy({
                memberId: selectedMember.id,
                resourceId: selectedBook.id,
                copyId: selectedCopy.uuid // or id
            });
            setCompletedIssue(issue);
            toast.success('Book Issued Successfully');
            return true;
        } catch (err) {
            toast.error(err.message || 'Issue failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetWizard = () => {
        setStep(1);
        setSelectedMember(null);
        setSelectedBook(null);
        setSelectedCopy(null);
        setCompletedIssue(null);
        setMemberResults([]);
        setBookResults([]);
    };

    return {
        step, setStep,
        loading,

        // Data
        selectedMember,
        selectedBook,
        selectedCopy,
        completedIssue,

        // Results
        memberResults,
        bookResults,

        // Actions
        searchMembers,
        selectMember,
        searchBooks,
        selectBook,
        validateBarcode,
        selectCopy,
        confirmIssue,
        resetWizard
    };
};
