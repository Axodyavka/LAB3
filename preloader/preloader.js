// SPDX-FileCopyrightText: 2026 Аполлинария Аверченко
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
    });
});
