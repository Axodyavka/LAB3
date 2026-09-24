// SPDX-FileCopyrightText: 2026 Аполлинария Аверченко
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// РЎРѕР·РґР°РµРј РїСЂРѕСЃС‚РѕР№ PDF С„Р°Р№Р» РґР»СЏ СЃРєР°С‡РёРІР°РЅРёСЏ
function createSamplePDF() {
    const pdfContent = `
        %PDF-1.3
        1 0 obj
        << /Type /Catalog /Pages 2 0 R >>
        endobj
        2 0 obj
        << /Type /Pages /Kids [3 0 R] /Count 1 >>
        endobj
        3 0 obj
        << /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
        endobj
        4 0 obj
        << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
        endobj
        5 0 obj
        << /Length 73 >>
        stream
        BT
        /F1 24 Tf
        100 700 Td
        (Live Life at the Full Potential) Tj
        ET
        endstream
        endobj
        xref
        0 6
        0000000000 65535 f 
        0000000009 00000 n 
        0000000058 00000 n 
        0000000111 00000 n 
        0000000223 00000 n 
        0000000278 00000 n 
        trailer
        << /Size 6 /Root 1 0 R >>
        startxref
        364
        %%EOF
    `;

    return new Blob([pdfContent], { type: 'application/pdf' });
}

// РћР±СЂР°Р±РѕС‚С‡РёРєРё СЃРѕР±С‹С‚РёР№ РґР»СЏ РєРЅРѕРїРѕРє
document.addEventListener('DOMContentLoaded', function () {
    // РљРЅРѕРїРєР° "Read more books" - РѕС‚РєСЂС‹РІР°РµС‚ РєР°С‚Р°Р»РѕРі СЃ С„РёР»СЊС‚СЂР°С†РёРµР№ РїРѕ РєРЅРёРіР°Рј
    const readMoreBooksBtn = document.querySelector('.block4 .btn');
    if (readMoreBooksBtn) {
        readMoreBooksBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // РЎРѕС…СЂР°РЅСЏРµРј С„РёР»СЊС‚СЂ РїРѕ РєРЅРёРіР°Рј РІ localStorage
            localStorage.setItem('catalogFilters', JSON.stringify({
                typeFilter: 'book',
                currentPage: 1
            }));
            window.location.href = '/catalog/catalog.html';
        });
    }

    // РљРЅРѕРїРєР° "Download my free guide" - СЃРєР°С‡РёРІР°РЅРёРµ С„Р°Р№Р»Р°
    const downloadGuideBtn = document.querySelector('.block5 .btn');
    if (downloadGuideBtn) {
        downloadGuideBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // РЎРѕР·РґР°РµРј Рё СЃРєР°С‡РёРІР°РµРј С„Р°Р№Р» СЃСЂР°Р·Сѓ Р±РµР· РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ
            const pdfBlob = createSamplePDF();
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Live-Life-at-the-Full-Potential.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // РљРЅРѕРїРєР° "Book now" - РѕС‚РєСЂС‹РІР°РµС‚ РєР°С‚Р°Р»РѕРі СЃ С„РёР»СЊС‚СЂР°С†РёРµР№ РїРѕ РёРЅРґРёРІРёРґСѓР°Р»СЊРЅРѕРјСѓ РєРѕСѓС‡РёРЅРіСѓ
    const bookNowBtn = document.querySelector('.block6 .btn');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // РЎРѕС…СЂР°РЅСЏРµРј С„РёР»СЊС‚СЂ РїРѕ РёРЅРґРёРІРёРґСѓР°Р»СЊРЅРѕРјСѓ РєРѕСѓС‡РёРЅРіСѓ РІ localStorage
            // РСЃРїСЂР°РІР»РµРЅРѕ РЅР°РїРёСЃР°РЅРёРµ РЅР° "individual coaching" (Р±С‹Р»Рѕ РѕРїРµС‡Р°С‚РєР°)
            localStorage.setItem('catalogFilters', JSON.stringify({
                typeFilter: 'individual coaching',
                currentPage: 1
            }));
            window.location.href = '/catalog/catalog.html';
        });
    }
});


const shopButton = document.querySelector('.block1 .btn');
if (shopButton) {
    shopButton.addEventListener('click', () => {
        window.location.href = '/catalog/catalog.html';
        hamMenu.classList.remove('active');
        header.classList.remove('active');
    });
}
