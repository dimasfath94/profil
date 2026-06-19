import API_CONFIG from './api-config.js';

const BASE_URL = API_CONFIG.BASE_URL;

// Cache untuk menyimpan nama penulis agar tidak fetch berkali-kali
const authorCache = new Map();

let currentPage = 1; // Variabel untuk melacak halaman saat ini

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
 * Render List Blog Posts
 */
async function loadBlogPosts(page = 1) {
    currentPage = page; // Update state
    try {
        const response = await fetch(`${BASE_URL}/posts?page=${page}&limit=3`);
        const result = await response.json();
        const posts = result.data;

        const container = document.querySelector('#mh-blog .row');
        const titleEl = container.querySelector('.section-title');
        
        container.innerHTML = '';
        container.appendChild(titleEl);

        // Gunakan Promise.all untuk fetch nama penulis secara paralel agar cepat
        const postsWithAuthors = await Promise.all(posts.map(async (post) => {
            const authorName = await getAuthorNameById(post.user_id);
            return { ...post, authorName };
        }));
        postsWithAuthors.forEach(post => {
            const postHTML = `
                <div class="col-sm-12 col-md-4">
                    <div class="mh-blog-item dark-bg wow fadeInUp" data-wow-duration="0.8s">
                        <img src="${BASE_URL}/images/posts/${post.image}" 
                        alt="${post.title}" 
                        style="width: 100%; height: 200px; object-fit: cover; display: block;"
                        onerror="this.src='../assets/images/profile.png';">
                        <div class="blog-inner">
                            <h2><a href="blog-single.html?slug=${post.slug}">${post.title}</a></h2>
                            <div class="mh-blog-post-info">
                                <ul>
                                    <li><strong>Post On</strong><a href="#">${formatDate(post.created_at)}</a></li>
                                    <li><strong>By</strong><a href="#">${post.authorName}</a></li>
                                </ul>
                            </div>
                            <p>${post.synopsis}</p>
                            <a href="blog-single.html?slug=${post.slug}">Read More</a>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', postHTML);
        });
        // Tambahkan tombol Pagination di bawah
        const paginationHTML = `
            <div class="col-sm-12 text-center" style="margin-top: 20px;">
                <button id="prevBtn" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
                <span style="margin: 0 15px;">Page ${currentPage}</span>
                <button id="nextBtn" ${posts.length < 3 ? 'disabled' : ''}>Next</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', paginationHTML);

        // Event Listeners untuk tombol
        document.getElementById('prevBtn')?.addEventListener('click', () => loadBlogPosts(currentPage - 1));
        document.getElementById('nextBtn')?.addEventListener('click', () => loadBlogPosts(currentPage + 1));
    } catch (error) {
        console.error("Gagal memuat blog:", error);
    }
}

/**
 * Render Sidebar Topics
 */
async function loadSidebarTopics() {
    try {
        const response = await fetch(`${BASE_URL}/topics`);
        const result = await response.json();
        const topics = result.data;

        const sidebar = document.getElementById('sidebar-topics-list');
        if (sidebar) {
            sidebar.innerHTML = topics.map(topic => `
                <li>
                    <a href="blog-category.html?topic=${topic.slug}">
                        ${topic.name} <span>(${topic.post_count})</span>
                    </a>
                </li>
            `).join('');
        }
    } catch (error) {
        console.error("Gagal memuat topik:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    loadSidebarTopics();
});