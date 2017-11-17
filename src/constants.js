export default Object.freeze({ // REALLY constant.
    // Note that this doesn't include default keybindings such as
    // <backspace> for delete-backward-char, arrow keys, C-z and C-y for
    // un/redo, etc.
    defaultKeymap: {
        // movement commands
        "previous-line": ["C-p"],
        "next-line": ["C-n"],
        "previous-char": ["C-b"],
        "next-char": ["C-f"],
        "previous-word": ["M-b"],
        "next-word": ["M-f"],
        "beginning-of-line": ["C-a"],
        "end-of-line": ["C-e"],
        "beginning-of-buffer": ["M-<"],
        "end-of-buffer": ["M->"],
        // commands affecting the mark and region
        "set-mark-command": ["C-SPC", "C-i"],
        "kill-region": ["C-w"],
        "kill-line": ["C-k"],
        "yank": ["C-y"],
        // commands otherwise modifying the buffer
        "delete-char": ["C-d", "DEL"],
        "delete-backward-char": [],
        "kill-word": ["M-DEL"],
        "backward-kill-word": ["M-<backspace>"],
        "undo": ["C-x u", "C-/"],
        "redo": ["C-?"]
    },
});
