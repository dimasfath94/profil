import API_CONFIG from './api-config.js';

const BASE_URL = API_CONFIG.BASE_URL;
const authorCache = new Map();

/**
 * Helper untuk format tanggal DD.MM.YY
 */
function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
}
function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
/**
 * Fetch nama penulis berdasarkan user_id dengan sistem cache
 */
async function getAuthorNameById(userId) {
    if (authorCache.has(userId)) {
        return authorCache.get(userId);
    }

    try {
        const response = await fetch(`${BASE_URL}/profile/${userId}`);
        const result = await response.json();
        const authorName = `${result.data.firstname} ${result.data.lastname}`;
        
        authorCache.set(userId, authorName);
        return authorName;
    } catch (error) {
        console.warn(`Gagal memuat profil untuk user_id: ${userId}`);
        return "Admin"; 
    }
}

/**
 * Memuat detail artikel berdasarkan slug
 */
async function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        window.location.href = 'bloghome.html';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/posts/${slug}`);
        const result = await response.json();
        const post = result.data;

        // Mendapatkan nama penulis
        const authorName = await getAuthorNameById(post.user_id);

        // Update elemen DOM
        document.getElementById('blog-title').innerText = post.title;
        document.getElementById('blog-date').innerText = formatDate(post.created_at);
        document.getElementById('blog-author').innerText = authorName;
        document.getElementById('blog-content').innerHTML = decodeHtml(post.body);
        
        document.title = `${post.title} - Dimas Fathulyaqin`;

    } catch (error) {
        console.error("Gagal memuat artikel:", error);
        document.getElementById('blog-title').innerText = "Artikel tidak ditemukan";
        document.getElementById('blog-content').innerHTML = `
            <p>Sorry, article not found.</p>
            <a href="bloghome.html">Back to list article</a>
        `;
    }
}
async function loadSidebarTopics() {
    try {
        const response = await fetch(`${BASE_URL}/topics`);
        const result = await response.json();
        const topics = result.data; // Asumsi struktur API: { data: [...] }

        const sidebar = document.getElementById('sidebar-topics-list');
        if (sidebar) {
            sidebar.innerHTML = topics.map(topic => `
                <li>
                    <a href="blog-category.html?topic=${topic.slug}">
                        ${topic.name} <span>(${topic.post_count || 0})</span>
                    </a>
                </li>
            `).join('');
        }
    } catch (error) {
        console.error("Gagal memuat topik:", error);
        document.getElementById('sidebar-topics-list').innerHTML = "<li>Gagal memuat kategori</li>";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSinglePost();
    loadSidebarTopics();
});