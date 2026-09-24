// SPDX-FileCopyrightText: 2026 Аполлинария Аверченко
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// header_footer.js

import { getTranslations, applyLanguage, applyVisibility } from './language-switcher.js';

let currentUser = null;

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        return true;
    }
    currentUser = null;
    return false;
}

function showNotification(message) {
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<span>${message}</span><button class="close-notification">Г—</button>`;
        document.body.appendChild(notification);
    } else {
        notification.querySelector('span').textContent = message;
    }
    notification.style.display = 'flex';
    const closeButton = document.querySelector('.close-notification');
    closeButton.addEventListener('click', () => {
        notification.style.display = 'none';
    });
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');

    if (!headerElement || !footerElement) {
        console.error('Р­Р»РµРјРµРЅС‚ header РёР»Рё footer РЅРµ РЅР°Р№РґРµРЅ:', { headerElement, footerElement });
        return;
    }

    // Р—Р°С‰РёС‚Р° РѕС‚ РїРѕРІС‚РѕСЂРЅРѕР№ Р·Р°РіСЂСѓР·РєРё С…РµРґРµСЂР°
    if (headerElement.dataset.loaded) {
        console.log('РҐРµРґРµСЂ СѓР¶Рµ Р·Р°РіСЂСѓР¶РµРЅ, РїСЂРѕРїСѓСЃРєР°РµРј');
        return;
    }
    headerElement.dataset.loaded = 'true';

    fetch('/header_footer/header_footer.html')
        .then(response => {
            if (!response.ok) throw new Error(`РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё header/footer: ${response.status}`);
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const headerContent = doc.querySelector('#header');
            const footerContent = doc.querySelector('.footer');

            if (headerContent && headerElement) headerElement.innerHTML = headerContent.innerHTML;
            if (footerContent && footerElement) footerElement.innerHTML = footerContent.innerHTML;

            initBurgerMenu();
            initFooterSubscription();
            const isLoggedIn = checkAuth();
            updateHeader(isLoggedIn);

            const lang = localStorage.getItem('language') || 'en';
            applyLanguage(lang, 'DOMContentLoaded');
            document.dispatchEvent(new CustomEvent('headerLoaded'));

            const restartToggle = document.querySelector('.restart-toggle');
            if (restartToggle) {                
                const newRestartToggle = restartToggle.cloneNode(true);
                restartToggle.parentNode.replaceChild(newRestartToggle, restartToggle);
                newRestartToggle.addEventListener('click', () => {
                    console.log('РЎР±СЂРѕСЃ РЅР°СЃС‚СЂРѕРµРє С‡РµСЂРµР· restart-toggle');
                    localStorage.setItem('language', 'en');
                    localStorage.setItem('theme', 'light');
                    localStorage.setItem('visibility', 'visible');
                    localStorage.setItem('accessibilityFontSize', 'medium');
                    localStorage.setItem('accessibilityColorScheme', 'white-black');
                    localStorage.setItem('accessibilityImages', 'on');
                    localStorage.removeItem('catalogFilters');


                    const enRadio = document.getElementById('eng');
                    const ruRadio = document.getElementById('rus');
                    const themeToggle = document.getElementById('theme-toggle');
                    const visibilityCheckbox = document.getElementById('visibility');
                    if (enRadio) enRadio.checked = true;
                    if (ruRadio) ruRadio.checked = false;
                    if (themeToggle) themeToggle.checked = false;
                    if (visibilityCheckbox) visibilityCheckbox.checked = false;

                    applyLanguage('en', 'restartToggle');
                    applyVisibility();
                    updateHeader(false);
                    showNotification("Settings are reset");
                });
            }
        })
        .catch(error => console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё header/footer:', error));

    document.addEventListener('languageChanged', () => {
        updateHeader(checkAuth());
    });
});

export function updateHeader(isLoggedIn) {
    const profileLink = document.getElementById('profile-link');
    const authLink = document.getElementById('auth-link');
    const cartIconWrapper = document.querySelector('.cart-icon-wrapper');
    const isAdmin = currentUser && /admin/i.test(currentUser.userName);
    const lang = localStorage.getItem('language') || 'en';
    const translations = getTranslations(lang);

    if (authLink) {
        authLink.textContent = isLoggedIn ? translations.header.logout : translations.header.login;
        authLink.href = isLoggedIn ? '#' : '/log_in/log.html';
        authLink.removeEventListener('click', handleLogout);
        if (isLoggedIn) {
            authLink.addEventListener('click', handleLogout);
        }
    }

    if (profileLink) {
        profileLink.style.display = isLoggedIn && !isAdmin ? 'block' : 'none';
    }


    cartIconWrapper.style.display = isLoggedIn && !isAdmin ? 'block' : 'none';
    if (cartIconWrapper) {
        const badge = cartIconWrapper.querySelector('.cart-badge');
        if (isLoggedIn && !isAdmin && currentUser && currentUser.userName) {
            fetch(`http://localhost:3000/cart?userName=${currentUser.userName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('РћС€РёР±РєР° РїСЂРё Р·Р°РїСЂРѕСЃРµ РєРѕСЂР·РёРЅС‹');
                    }
                    return response.json();
                })
                .then(cartItems => {
                    console.log('РўРѕРІР°СЂС‹ РІ РєРѕСЂР·РёРЅРµ РґР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ', currentUser.userName, ':', cartItems); // Р”Р»СЏ РѕС‚Р»Р°РґРєРё
                    const cartCount = cartItems.length; 
                    badge.textContent = cartCount;
                    badge.setAttribute('data-count', cartCount);
                })
                .catch(error => {
                    console.error('РћС€РёР±РєР° РїСЂРѕРІРµСЂРєРё РєРѕСЂР·РёРЅС‹:', error);
                    badge.textContent = '0';
                    badge.setAttribute('data-count', '0');
                });
        } else {
            badge.textContent = '0';
            badge.setAttribute('data-count', '0');
        }
    }

    const footerLoginLink = document.getElementById('footer-login-link');
    const footerProfileLink = document.getElementById('footer-profile-link');
    if (footerLoginLink) footerLoginLink.style.display = isLoggedIn ? 'none' : 'block';
    if (footerProfileLink) footerProfileLink.style.display = isLoggedIn && !isAdmin ? 'block' : 'none';
}

function handleLogout(e) {
    e.preventDefault();
    console.log('Р’С‹С…РѕРґ РёР· СЃРёСЃС‚РµРјС‹');
    localStorage.clear();
    localStorage.setItem('language', 'en');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('visibility', 'visible');
    localStorage.setItem('accessibilityFontSize', 'medium');
    localStorage.setItem('accessibilityColorScheme', 'white-black');
    localStorage.setItem('accessibilityImages', 'on');
    const enRadio = document.getElementById('eng');
    const ruRadio = document.getElementById('rus');
    if (enRadio) enRadio.checked = true;
    if (ruRadio) ruRadio.checked = false;
    applyLanguage('en', 'handleLogout');
    applyVisibility();
    updateHeader(false);
    window.location.href = '/log_in/log.html';
}

function initBurgerMenu() {
    const hamMenu = document.querySelector('.ham-menu');
    const header = document.querySelector('#header');
    const menuContainer = document.querySelector('.menu-container');
    if (!hamMenu || !header || !menuContainer) {
        console.warn('Р­Р»РµРјРµРЅС‚С‹ Р±СѓСЂРіРµСЂ-РјРµРЅСЋ РЅРµ РЅР°Р№РґРµРЅС‹, РёРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїСЂРѕРїСѓС‰РµРЅР°');
        return;
    }

    const links = document.querySelectorAll('.links a');
    const shopButton = document.querySelector('.button-cart .shop');
    const cartIconWrapper = document.querySelector('.cart-icon-wrapper');

    hamMenu.addEventListener('click', () => {
        hamMenu.classList.toggle('active');
        header.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamMenu.classList.remove('active');
            header.classList.remove('active');
        });
    });

    if (shopButton) {
        shopButton.addEventListener('click', () => {
            window.location.href = '/catalog/catalog.html';
            hamMenu.classList.remove('active');
            header.classList.remove('active');
        });
    }

    if (cartIconWrapper) {
        cartIconWrapper.addEventListener('click', () => {
            window.location.href = '/cart/cart.html';
            hamMenu.classList.remove('active');
            header.classList.remove('active');
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1160) {
            hamMenu.classList.remove('active');
            header.classList.remove('active');
        }
    });
}

function initFooterSubscription() {
    const subscribeButton = document.querySelector('.subscribe-form button');
    if (subscribeButton) {
        subscribeButton.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = localStorage.getItem('language') || 'en';
            const t = getTranslations(lang);
            showNotification(t.footer.subscribeSuccess || 'РџРѕРґРїРёСЃРєР° РѕС„РѕСЂРјР»РµРЅР°!');
        });
    }
}
