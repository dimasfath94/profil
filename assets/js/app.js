import PortfolioService from './services/portfolio-services.js';
import ProfilImageService from './services/profilimage-service.js';

async function initPortfolio() {
    try {
        console.log("Menghubungi API Rust untuk mengambil data...");
        
        const [profile, aboutMe, skillsData, whatIDoData, projectsData, educationData, workData, categories, portfolios, certificates] = await Promise.all([
            PortfolioService.getProfile(),
            PortfolioService.getAboutMe(),
            PortfolioService.getSkills(),
            PortfolioService.getWhatIDo(),
            PortfolioService.getProjects(),
            PortfolioService.getEducation(),
            PortfolioService.getExperience(),
            PortfolioService.getCategories(),
            PortfolioService.getPortfolios(),
            PortfolioService.getCertificates()
        ]);

        console.log("Semua data berhasil didapat dari Rust!");

        // ==========================================
        // 1. RENDER HERO SECTION
        // ==========================================
        const nameEl = document.getElementById('hero-name');
        if (nameEl) nameEl.innerText = `${profile.firstname} ${profile.lastname}`;
        
        const titleEl = document.getElementById('hero-title');
        if (titleEl) {
            titleEl.innerText = profile.profesi;
            titleEl.classList.remove('wow', 'fadeInUp');
            void titleEl.offsetWidth;
            titleEl.classList.add('wow', 'fadeInUp');
        }

        const emailEl = document.getElementById('hero-email');
        if (emailEl && profile.email) {
            emailEl.innerText = profile.email;
            emailEl.href = `mailto:${profile.email}`;
        }

        const phoneEl = document.getElementById('hero-phone');
        if (phoneEl && profile.phone1) {
            phoneEl.innerText = profile.phone1;
            phoneEl.href = `tel:${profile.phone1.replace(/\s+/g, '')}`;
        }

        const addressEl = document.getElementById('hero-address');
        if (addressEl && profile.alamat) {
            addressEl.innerText = profile.alamat;
        }

        const avatarEl = document.getElementById('hero-avatar');
        if (avatarEl) {
            avatarEl.src = ProfilImageService.getAvatarUrl();
        }

        const bioEl = document.getElementById('hero-bio');
        if (bioEl && profile.bio) {
            bioEl.innerText = profile.bio;
        }


        // ==========================================
        // 2. RENDER ABOUT ME SECTION
        // ==========================================
        const aboutDescEl = document.getElementById('about-desc');
        if (aboutDescEl && aboutMe.description) {
            aboutDescEl.innerText = aboutMe.description;
        }

        const aboutAvatarEl = document.getElementById('about-avatar');
        if (aboutAvatarEl) {
            aboutAvatarEl.src = ProfilImageService.getAboutMeImageUrl();
        }

        const skillsTagContainer = document.getElementById('about-skills-tag');
        if (skillsTagContainer && skillsData.technical) {
            skillsTagContainer.innerHTML = '';
            skillsData.technical.forEach(skill => {
                skillsTagContainer.innerHTML += `<li><span>${skill.name}</span></li>`;
            });
        }

        renderPortfolioGallery(categories, portfolios);

        renderCertificates(certificates);

        // ==========================================
        // 3. RENDER SKILLS SECTION
        // ==========================================
        if (skillsData) {
            // Render Linear Skills (Bar)
            const skillSections = document.querySelectorAll('#mh-skills .each-skills');
            const renderLinear = (container, data) => {
                if (!container) return;
                container.innerHTML = data.map(s => `
                    <div class="candidatos">
                        <div class="parcial">
                            <div class="info"><div class="nome">${s.name}</div><div class="percentagem-num">${s.score}%</div></div>
                            <div class="progressBar"><div class="percentagem" style="width: ${s.score}%;"></div></div>
                        </div>
                    </div>
                `).join('');
            };

            if (skillSections[0] && skillsData.technical) renderLinear(skillSections[0], skillsData.technical);
            if (skillSections[1] && skillsData.general) renderLinear(skillSections[1], skillsData.general);
            if (skillSections[2] && skillsData.language) renderLinear(skillSections[2], skillsData.language);

            // Render Professional Skills
            const profContainer = document.querySelector('.mh-professional-progress');
            if (profContainer && skillsData.professional) {
                profContainer.innerHTML = skillsData.professional.map(s => `
                <li>
                    <div class="mh-progress-wrapper">
                        <div class="mh-progress-circle-custom" style="--progress: ${s.score}%"></div>
                        <div class="score-text">${s.score}%</div>
                    </div>
                    <div class="pr-skill-name">${s.name}</div>
                </li>
            `).join('');
            }
        }

        // ==========================================
        // 4. RENDER WHAT I DO SECTION
        // ==========================================
        const whatIDoContainer = document.getElementById('what-i-do-container');
        if (whatIDoContainer && whatIDoData) {
            const titleHtml = `<div class="col-sm-12 text-center section-title wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.2s"><h2>What I do</h2></div>`;
            whatIDoContainer.innerHTML = titleHtml;
            whatIDoData.forEach((item, index) => {
                const delay = 0.3 + (index * 0.2);
                whatIDoContainer.innerHTML += `
                    <div class="col-sm-4">
                        <div class="mh-service-item shadow-1 dark-bg wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="${delay}s">
                            <i class="${item.iclasslogo}"></i>
                            <h3>${item.title}</h3>
                            <p>${item.detail}</p>
                        </div>
                    </div>
                `;
            });
        }

        renderPortfolioGallery(categories, portfolios);

        // ==========================================
        // 5. RENDER FEATURED PROJECTS SECTION
        // ==========================================
        const projectsContainer = document.getElementById('featured-projects-container');
        if (projectsContainer && projectsData) {
            projectsContainer.innerHTML = '';
            projectsData.forEach((project) => {
                const projectImgUrl = project.projectpicture ? `http://dimasbox:7777/api/images/projects/${project.projectpicture}` : 'assets/images/comingsoon.jpg'; 
                projectsContainer.innerHTML += `
                    <div class="col-sm-12 mh-featured-item">
                        <div class="row">
                            <div class="col-sm-7">
                                <div class="mh-featured-project-img shadow-2 wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.2s">
                                    <img src="${projectImgUrl}" alt="" class="img-fluid">
                                </div>
                            </div>
                            <div class="col-sm-5">
                                <div class="mh-featured-project-content">
                                    <h4 class="project-category wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.4s">${project.category || 'Web Design'}</h4>
                                    <h2 class="wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.5s">${project.projecttitle || 'Coming Soon'}</h2>
                                    <span class="wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.6s">${project.projectsubtitle || 'XXX'}</span>
                                    <p class="wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.7s">${project.projectdetail || '...'}</p>
                                    <a href="${project.projecturl || '#'}" target="_blank" class="btn btn-fill wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.7s">View Details</a>
                                    <div class="mh-testimonial mh-project-testimonial wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.9s">
                                        <blockquote>
                                            <q>Technology Quotes - You affect the world by what you browse.</q>
                                            <cite>- Tim Berners-Lee</cite>
                                        </blockquote>
                                        <blockquote>
                                            <q>Trovalds Quotes - Intelligence is the ability to avoid doing work, yet getting the work done.</q>
                                            <cite>- Linus Trovalds</cite>
                                        </blockquote>
                                        <blockquote>
                                            <q>Elon Quotes - If something’s important enough, you should try. Even if you the probable outcome is failure.</q>
                                            <cite>- Elon Musk</cite>
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }


        // ==========================================
        // 6. RENDER EDUCATION & WORK EXPERIENCE
        // ==========================================

        const renderSection = (selector, dataList, sortFn, templateFn) => {
            const container = document.querySelector(selector);
            if (!container) return;

            // 1. Ambil data
            let items = Array.isArray(dataList) ? dataList : (dataList?.data || []);

            // 2. Sorting hanya sekali di sini
            if (sortFn) {
                items = [...items].sort(sortFn);
            }

            // 3. Gunakan DocumentFragment untuk performa tinggi
            const fragment = document.createDocumentFragment();
            items.forEach((item, index) => {
                const div = document.createElement('div');
                div.innerHTML = templateFn(item, index);
                fragment.appendChild(div.firstElementChild);
            });

            // 4. Bersihkan dan masukkan semua sekaligus
            container.innerHTML = '';
            container.appendChild(fragment);
        };
        

        // --- Render Education ---
        renderSection(
            '.mh-education-deatils', 
            educationData, 
            (a, b) => parseInt(b.tahun.slice(-4)) - parseInt(a.tahun.slice(-4)),
            (edu, index) => `
                <div class="mh-education-item dark-bg wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="${0.3 + (index * 0.1)}s">
                    <h4>${edu.jenisinstansi} <br> <a href="#">${edu.namainstansi}</a></h4>
                    <div class="mh-eduyear">${edu.wilayah}</div>
                    <div class="mh-eduyear">${edu.tahun}</div>
                    <p>${edu.deskripsi}</p>
                </div>
            `
        );

        // --- Render Work ---
        renderSection(
            '.mh-experience-deatils', 
            workData, 
            (a, b) => {
                const getYear = (str) => parseInt(str.trim().slice(-4));
                return getYear(b.bulantahun) - getYear(a.bulantahun);
            },
            (work, index) => `
                <div class="mh-work-item dark-bg wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="${0.3 + (index * 0.1)}s">
                    <h4>${work.role} <br> <a href="${work.urlinstansi || '#'}" target="_blank">${work.namaperusahaan}</a></h4>
                    <div class="mh-eduyear">${work.wilayahperusahaan}</div>
                    <div class="mh-eduyear">${work.bulantahun}</div>
                    <span>Responsibility :</span>
                    <ul class="work-responsibility">
                        ${work.responsibility ? (typeof work.responsibility === 'string' ? work.responsibility.split(/\n|\\r\\n/).map(item => `
                            <li><i class="fa fa-circle"></i>${item.replace(/^\d+\.\s+/, '')}</li>
                        `).join('') : '') : ''}
                    </ul>
                </div>
            `
        );
        



        // ==========================================
        // RENDER FOOTER SECTION
        // ==========================================
        const footerAddress = document.getElementById('footer-address');
        if (footerAddress && profile.alamat) {
            footerAddress.innerHTML = profile.alamat.replace(/\n/g, '<br>');
        }

        const footerEmail = document.getElementById('footer-email');
        if (footerEmail && profile.email) {
            footerEmail.innerText = profile.email;
            footerEmail.href = `mailto:${profile.email}`;
        }

        const footerPhone1 = document.getElementById('footer-phone1');
        if (footerPhone1 && profile.phone1) {
            footerPhone1.innerText = profile.phone1;
            footerPhone1.href = `tel:${profile.phone1.replace(/\s+/g, '')}`;
        }

        const footerPhone2 = document.getElementById('footer-phone2');
        if (footerPhone2 && profile.phone2) {
            footerPhone2.innerText = profile.phone2;
            footerPhone2.href = `tel:${profile.phone2.replace(/\s+/g, '')}`;
        }

       

        // ==========================================
        // 6. REFRESH ANIMASI & JALANKAN SCRIPT
        // ==========================================
        if (window.WOW) new WOW().init();
        const customScript = document.createElement('script');
        customScript.src = 'assets/js/custom-scripts.js';
        document.body.appendChild(customScript);

    } catch (error) {
        console.error("Terjadi error saat memuat data portofolio:", error);
    }
}


// Letakkan di luar agar bisa diakses kapan saja
const renderPortfolioGallery = (categories, portfolios) => {
    const galleryContainer = document.querySelector('.portfolioContainer');
    const navContainer = document.querySelector('#filter-button ul');
    
    if (!galleryContainer) return;

    // A. Render Filter
    if (navContainer) {
        let navHtml = `<li data-filter="*" class="current wow fadeInUp"><span>All Categories</span></li>`;
        categories.forEach((cat) => {
            navHtml += `<li data-filter=".cat-${cat.id}" class="wow fadeInUp"><span>${cat.category}</span></li>`;
        });
        navContainer.innerHTML = navHtml;
    }

    // B. Render Gallery dengan Fragment untuk Performa
    const fragment = document.createDocumentFragment();
    portfolios.forEach(item => {
        const imageUrl = ProfilImageService.getPortfolioImageUrl(item.portofoliopict);
        const div = document.createElement('div');
        div.className = `grid-item col-md-4 col-sm-6 col-xs-12 cat-${item.categoryid}`;
        div.innerHTML = `
            <figure>
                <img src="${imageUrl}" alt="${item.portofoliotitle}">
                <figcaption class="fig-caption">
                    <i class="fa fa-search"></i>
                    <h5 class="title">${item.portofoliotitle}</h5>
                    <span class="sub-title">${item.category || ''}</span>
                    <a href="${imageUrl}" data-fancybox="gallery"></a>
                </figcaption>
            </figure>`;
        fragment.appendChild(div);
    });

    galleryContainer.innerHTML = '';
    galleryContainer.appendChild(fragment);
};




// ==========================================
// 7. RENDER CERTIFICATE SECTION
// ==========================================
/**
 * Render Certificate Section
 * @param {Array} certs - Data list dari database
 */
function renderCertificates(certs) {
    const indicatorContainer = document.querySelector('.carousel-indicators');
    const innerContainer = document.querySelector('.carousel-inner');
    
    if (!indicatorContainer || !innerContainer) return;

    let indicatorsHtml = '';
    let innerHtml = '';

    certs.forEach((cert, index) => {
        const isActive = index === 0 ? 'active' : '';
        const fileUrl = ProfilImageService.getCertificateUrl(cert.certificatefile);

        // 1. Render Indicators
        indicatorsHtml += `<li data-target="#cc-Indicators" data-slide-to="${index}" class="${isActive}"></li>`;

        // 2. Render Carousel Items
        innerHtml += `
            <div class="carousel-item ${isActive}">
                <div class="row">
                    <div class="col-lg-2 col-md-3 cc-reference-header">
                        <a href="${fileUrl}" target="_blank" title="Klik untuk membuka PDF">
                            <object data="${fileUrl}" type="application/pdf" width="160px" height="160px" style="pointer-events: none;">
                                <div style="display: flex; align-items: center; justify-content: center; height: 100%; border: 1px solid #ccc;">
                                    <span>PDF Preview</span>
                                </div>
                            </object>
                        </a>
                        <div class="h5 pt-2">${cert.titlecertificate}</div>
                        <p class="category">${cert.subtitlecertificate}</p>
                    </div>
                    <div class="col-lg-10 col-md-9">
                        <p>${cert.description}</p>
                    </div>
                </div>
            </div>`;
    });

    indicatorContainer.innerHTML = indicatorsHtml;
    innerContainer.innerHTML = innerHtml;
}



document.addEventListener('DOMContentLoaded', initPortfolio);