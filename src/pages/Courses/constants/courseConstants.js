/* Course Status */
export const COURSE_STATUS = {
    ALL: "ALL",
    ACTIVE: "ACTIVE",
    DISABLED: "DISABLED",
};

/**
 * Initial Form State — mirrors the Course entity exactly.
 *
 * Entity fields:
 *   courseName, description, duration, toolsCovered, courseFee,
 *   certificateProvided, status, showValidity, validityInDays,
 *   allowOfflineMobile, allowBookmark, courseImageUrl,
 *   shareCode (read-only), shareEnabled
 */
export const INITIAL_FORM_DATA = {
    // ── Basic ─────────────────────────────
    courseName: "",
    description: "",
    duration: "",
    toolsCovered: "",

    // ── Pricing ───────────────────────────
    courseFee: "",

    // ── Image ─────────────────────────────
    img: null,           // File object for upload
    imgPreview: null,    // Preview URL (data:// or https://)

    // ── Validity ──────────────────────────
    showValidity: false,
    validityInDays: "",

    // ── Access ────────────────────────────
    allowOfflineMobile: false,
    allowBookmark: false,

    // ── Certificate ───────────────────────
    certificateProvided: false,

    // ── Sharing ───────────────────────────
    shareEnabled: true,
    shareCode: null,    // Read-only; set by backend

    // ── Status ────────────────────────────
    status: COURSE_STATUS.ACTIVE,
};
