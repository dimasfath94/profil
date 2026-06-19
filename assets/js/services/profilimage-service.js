import API_CONFIG from './api-config.js';

class ProfilImageService {
    /**
     * Mengambil URL gambar matang untuk Foto Profil Utama (Avatar)
     * @returns {string} URL endpoint gambar avatar
     */
    getAvatarUrl() {
        // Menghasilkan: http://dimasbox:7777/api/images/avatar
        return `${API_CONFIG.BASE_URL}/images/avatar/x`;
    }

    /**
     * Mengambil URL gambar matang untuk Foto Section About Me
     * @returns {string} URL endpoint gambar aboutme
     */
    getAboutMeImageUrl() {
        // Menghasilkan: http://dimasbox:7777/api/images/aboutme
        return `${API_CONFIG.BASE_URL}/images/aboutme/x`;
    }

    /**
     * Mengambil URL gambar matang untuk Item Portfolio
     * @param {string} filename - Nama file gambar dari database
     * @returns {string} URL endpoint gambar portfolio
     */
    getPortfolioImageUrl(filename) {
        // Menghasilkan: http://dimasbox:7777/api/images/portfolio/nama_file.jpg
        return `${API_CONFIG.BASE_URL}/images/portfolio/${filename}`;
    }

    /**
     * Mengambil URL file sertifikat (PDF)
     * @param {string} filename - Nama file dari database
     * @returns {string} URL endpoint sertifikat
     */
    getCertificateUrl(filename) {
        // Menghasilkan: http://dimasbox:7777/api/images/certificates/nama_file.pdf
        return `${API_CONFIG.BASE_URL}/images/certificates/${filename}`;
    }
}

export default new ProfilImageService();