// /assets/js/functionality.js
import { loginUser, registerUser, loginWithGoogle } from './auth.js';

/* ---------- Custom Inputs ---------- */
const customInputs = Array.from(document.querySelectorAll(".custom-input"));
let activeInput = null;
export const values = {}; // exportado para auth.js

/* ---------- Selection / caret helpers ---------- */
function getSelectionOffsetsWithin(el) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return { start: el.textContent.length, end: el.textContent.length, collapsed: true };
    const range = sel.getRangeAt(0);
    if (!el.contains(range.startContainer) || !el.contains(range.endContainer))
        return { start: el.textContent.length, end: el.textContent.length, collapsed: true };

    const offsetOf = (node, nodeOffset) => {
        const r = document.createRange();
        r.setStart(el, 0);
        r.setEnd(node, nodeOffset);
        return r.toString().length;
    };

    const start = offsetOf(range.startContainer, range.startOffset);
    const end = offsetOf(range.endContainer, range.endOffset);
    return { start: Math.min(start, end), end: Math.max(start, end), collapsed: start === end };
}

function setCaretIndex(el, index) {
    el.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();

    let remaining = index;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    let node = walker.nextNode();
    while (node) {
        const nodeLen = node.textContent.length;
        if (remaining <= nodeLen) {
            const range = document.createRange();
            range.setStart(node, remaining);
            range.collapse(true);
            sel.addRange(range);
            return;
        } else remaining -= nodeLen;
        node = walker.nextNode();
    }
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.addRange(range);
}

/* ---------- Initialize Inputs ---------- */
customInputs.forEach(el => {
    if (!el.hasAttribute('contenteditable')) el.setAttribute('contenteditable', 'true');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');

    const key = el.dataset.key;
    if (key) values[key] = el.dataset.value || el.textContent || "";

    // Focus handling
    el.addEventListener('click', () => { customInputs.forEach(x => x.classList.remove('focused')); el.classList.add('focused'); activeInput = el; });
    el.addEventListener('focus', () => { customInputs.forEach(x => x.classList.remove('focused')); el.classList.add('focused'); activeInput = el; });
    el.addEventListener('blur', () => { el.classList.remove('focused'); activeInput = null; });

    // Input & Paste
    el.addEventListener('input', () => {
        const name = el.dataset.key;
        if (!name) return;
        const isPassword = el.dataset.password === "true";
        values[name] = el.textContent;
        if (isPassword) el.textContent = "*".repeat(values[name].length);
        el.classList.toggle('has-value', values[name].length > 0);
    });

    el.addEventListener('paste', () => setTimeout(() => {
        const name = el.dataset.key;
        if (!name) return;
        const isPassword = el.dataset.password === "true";
        values[name] = el.textContent;
        if (isPassword) el.textContent = "*".repeat(values[name].length);
        el.classList.toggle('has-value', values[name].length > 0);
    }, 0));
});

/* ---------- Key handling ---------- */
document.addEventListener('keydown', (e) => {
    if (!activeInput) return;
    const el = activeInput;
    const name = el.dataset.key;
    if (!name) return;

    const key = e.key;
    const sel = getSelectionOffsetsWithin(el);
    values[name] = values[name] || "";

    // Backspace / Delete
    if (key === "Backspace" || key === "Delete") {
        e.preventDefault();
        if (!sel.collapsed) values[name] = values[name].slice(0, sel.start) + values[name].slice(sel.end);
        else if (key === "Backspace" && sel.start > 0) values[name] = values[name].slice(0, sel.start - 1) + values[name].slice(sel.start);
        else if (key === "Delete" && sel.start < values[name].length) values[name] = values[name].slice(0, sel.start) + values[name].slice(sel.start + 1);
        el.textContent = (el.dataset.password === "true") ? "*".repeat(values[name].length) : values[name];
        setCaretIndex(el, sel.start);
        el.classList.toggle('has-value', values[name].length > 0);
        return;
    }

    // Printable characters
    if (key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const before = values[name].slice(0, sel.start);
        const after = values[name].slice(sel.end);
        values[name] = before + key + after;
        el.textContent = (el.dataset.password === "true") ? "*".repeat(values[name].length) : values[name];
        setCaretIndex(el, before.length + 1);
        el.classList.add('has-value');
        return;
    }
});

/* ---------- DOM Loaded: Buttons ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnLoginGoogle = document.getElementById('btn-login-google');
    const btnRegisterGoogle = document.getElementById('btn-register-google');
    const btnLoginPage = document.getElementById('btn-login-page');
    const btnRegisterPage = document.getElementById('btn-register-page');

    // Login
    if (btnLogin) btnLogin.addEventListener('click', async () => {
        try { await loginUser(values); } catch (err) { alert(err.message); }
    });

    // Register
    if (btnRegister) btnRegister.addEventListener('click', async () => {
        try { await registerUser(values); } catch (err) { alert(err.message); }
    });

    // Google
    if (btnLoginGoogle) btnLoginGoogle.addEventListener('click', async () => {
        try { await loginWithGoogle(); } catch (err) { alert(err.message); }
    });
    if (btnRegisterGoogle) btnRegisterGoogle.addEventListener('click', async () => {
        try { await loginWithGoogle(); } catch (err) { alert(err.message); }
    });

    // Navigation
    if (btnLoginPage) btnLoginPage.addEventListener('click', () => window.location.replace('/logueo'));
    if (btnRegisterPage) btnRegisterPage.addEventListener('click', () => window.location.replace('/registro'));
});