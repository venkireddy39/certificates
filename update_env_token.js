const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const secret = 'lms_prod_jwt_secret_change_this_very_long_random_string_987654321';

const permissions = [
    "COURSE_CREATE", "COURSE_UPDATE", "COURSE_DELETE", "COURSE_VIEW",
    "TOPIC_CREATE", "TOPIC_UPDATE", "TOPIC_DELETE", "TOPIC_VIEW",
    "CONTENT_ADD", "CONTENT_UPDATE", "CONTENT_DELETE", "CONTENT_VIEW", "CONTENT_ACCESS",
    "MANAGE_USERS", "MANAGE_COURSES", "VIEW_CONTENT", "VIEW_PROFILE",
    "BATCH_CREATE", "BATCH_UPDATE", "BATCH_DELETE", "BATCH_VIEW",
    "SESSION_CREATE", "SESSION_UPDATE", "SESSION_DELETE", "SESSION_VIEW",
    "SESSION_CONTENT_CREATE", "SESSION_CONTENT_UPDATE", "SESSION_CONTENT_DELETE", "SESSION_CONTENT_VIEW",
    "STUDENT_BATCH_CREATE", "STUDENT_BATCH_UPDATE", "STUDENT_BATCH_DELETE", "STUDENT_BATCH_VIEW",
    "MANAGE_PERMISSIONS", "VIEW_PERMISSIONS"
];

const authorities = [
    "ROLE_ADMIN",
    ...permissions
];

const token = jwt.sign({
    sub: 'admin@gmail.com',
    userId: 1,
    roleName: 'ROLE_ADMIN',
    roles: ['ROLE_ADMIN'],
    permissions: permissions,
    authorities: authorities,
    iat: Math.floor(Date.now() / 1000)
}, secret, { algorithm: 'HS512', expiresIn: '365d' });

const envPath = path.join(__dirname, '.env.local');
const content = `VITE_DEV_AUTH_TOKEN=${token}`;

fs.writeFileSync(envPath, content);
console.log("Updated .env.local with new token");
