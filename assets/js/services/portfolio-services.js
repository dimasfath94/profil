import API_CONFIG from './api-config.js';

/**
 * Helper fungsi untuk melakukan HTTP GET request standar ke backend Rust
 * @param {string} endpoint - Jalur endpoint (contoh: '/aboutme')
 */
async function fetchFromApi(endpoint) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Sesuai dengan format helper/response.rs di Rust: { status: "success", data: ... }
        if (result.status === "success") {
            return result.data;
        } else {
            throw new Error("Gagal mengambil data: Status response bukan success");
        }
    } catch (error) {
        console.error(`Error pada endpoint ${endpoint}:`, error);
        throw error; // Lempar kembali error agar bisa ditangani di UI (misal menampilkan skeleton/loading error)
    }
}

// Objek service penampung seluruh fungsi fetch data portofolio
const PortfolioService = {
    getProfile: () => fetchFromApi('/profile'),
    getAboutMe: () => fetchFromApi('/aboutme'),
    getSkills: () => fetchFromApi('/skills'),
    getExperience: () => fetchFromApi('/experience'),
    getEducation: () => fetchFromApi('/education'),
    getCertificates: () => fetchFromApi('/certificates'),
    getProjects: () => fetchFromApi('/projects'),
    getWhatIDo: () => fetchFromApi('/whatido'),
    getCategories: () => fetchFromApi('/categories'),
    getPortfolios: () => fetchFromApi('/portfolios')
};

export default PortfolioService;