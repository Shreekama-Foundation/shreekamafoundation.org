

// Wait for DOM and Data
document.addEventListener('DOMContentLoaded', async () => {
    // Ensure data is loaded
    if (typeof NAV_LINKS === 'undefined') {
        console.error('Data not loaded. Check assets/js/data.js');
        return;
    }

    // Initialize Components (Async to wait for fetch)
    await injectComponents();
    
    // Header Scroll Effect - Only for shadow now
    checkScroll();
    window.addEventListener('scroll', checkScroll);
    
    // Dynamic Padding for Header Overlap
    adjustMainPadding();
    window.addEventListener('resize', adjustMainPadding);

    // Page Initializers
    if (document.getElementById('home-programs-grid')) initHome();
    if (document.getElementById('programs-grid')) initPrograms();
    if (document.getElementById('program-detail-container')) initProgramDetail();
    if (document.getElementById('blog-grid')) initBlog();
    if (document.getElementById('events-container')) initEvents();
    if (document.getElementById('impact-stats-container')) initImpact(); 
    
    // Counters initialization
    initCounters();

    // Mobile Menu Toggle Logic
    setupMobileMenu();

    // Inject Favicon centrally
    injectFavicon();

    // Render icons last
    lucide.createIcons();
});

// --- PATH RESOLVER ---
function getRootPath() {
    const path = window.location.pathname;
    if (path.includes('/content/blog/') || path.includes('/content/policies/')) {
        return '../../';
    }
    return '';
}

// --- FAVICON INJECTOR ---
function injectFavicon() {
    const root = getRootPath();
    // Look for favicon.ico in the ROOT directory (standard practice)
    const faviconPath = `${root}favicon.ico`;
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon'; // Specific type helper
        document.head.appendChild(link);
    }
    // Add a timestamp to prevent caching issues during development
    link.href = faviconPath + '?v=' + new Date().getTime();
}

// --- LAYOUT ADJUSTMENT ---
function adjustMainPadding() {
    const header = document.getElementById('main-header');
    const main = document.querySelector('main');
    if (header && main) {
        const height = header.offsetHeight;
        // Apply height as top padding to main to prevent overlap
        main.style.paddingTop = `${height}px`;
    }
}

// --- COMPONENT INJECTION ---

async function injectComponents() {
    const root = getRootPath();
    
    // 1. Inject Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch(`${root}components/header.html`);
            if (!response.ok) throw new Error('Failed to load header');
            let html = await response.text();
            
            html = html.replace(/href="(.*?)"/g, (match, p1) => {
                if(p1.startsWith('http') || p1.startsWith('#')) return match;
                return `href="${root}${p1}"`;
            });
            
            headerPlaceholder.innerHTML = html;
            highlightActiveLink();
            adjustMainPadding(); // Recalculate after injection
            lucide.createIcons();

        } catch (e) {
            console.warn('Fallback: Could not fetch header.html. Using JS fallback.');
            injectHeaderFallback(root);
        }
    }

    // 2. Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const response = await fetch(`${root}components/footer.html`);
            if (!response.ok) throw new Error('Failed to load footer');
            let html = await response.text();
             html = html.replace(/href="(.*?)"/g, (match, p1) => {
                if(p1.startsWith('http') || p1.startsWith('#')) return match;
                return `href="${root}${p1}"`;
            });
            html = html.replace('{{YEAR}}', new Date().getFullYear());
            
            footerPlaceholder.innerHTML = html;
            lucide.createIcons();
        } catch (e) {
            console.warn('Fallback: Could not fetch footer.html. Using JS fallback.');
            injectFooterFallback(root);
        }
    }
}

function highlightActiveLink() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith(filename)) {
            link.classList.add('text-[#E85D04]');
            link.classList.remove('text-gray-600'); 
            link.classList.add('active-page-link');
        }
    });
}

// Fallback if fetch fails
function injectHeaderFallback(root) {
    const linksHTML = NAV_LINKS.map(link => {
        return `<a href="${root}${link.path}" class="nav-link text-sm font-bold uppercase tracking-wide transition-colors duration-300 text-gray-600 hover:text-[#E85D04]">${link.name}</a>`;
    }).join('');

    const mobileLinksHTML = NAV_LINKS.map(link => {
        return `<a href="${root}${link.path}" class="block px-4 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-[#E85D04]">${link.name}</a>`;
    }).join('');

    // IMPORTANT: Header tag closes BEFORE the mobile menu div starts.
    // This allows the mobile menu to escape the header's stacking context.
    const html = `
    <header id="main-header" class="fixed top-0 w-full z-[50] transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-between min-h-[5rem] py-4 gap-4">
          <a href="${root}index.html" class="flex-shrink-0 flex items-center gap-2 group">
             <div class="bg-[#E85D04] text-white p-1.5 rounded-lg group-hover:bg-gray-900 transition-colors">
                <i data-lucide="heart-handshake" class="w-6 h-6"></i>
             </div>
            <span id="logo-text" class="text-xl md:text-2xl font-extrabold font-serif tracking-tight text-gray-900 transition-colors duration-300">Shreekama Foundation</span>
          </a>
          
          <nav id="desktop-nav" class="hidden lg:flex flex-wrap justify-center w-full lg:w-auto lg:space-x-8 items-center mt-4 lg:mt-0 order-last lg:order-none">
            ${linksHTML}
          </nav>

          <div class="flex items-center gap-4">
              <div class="hidden lg:block">
                <a href="${root}donate.html" class="inline-block bg-[#E85D04] text-white font-bold py-2.5 px-6 rounded-full hover:bg-[#D95F26] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                  Donate Now
                </a>
              </div>
              <div class="lg:hidden">
                <button id="mobile-menu-btn" class="text-gray-800 hover:text-[#E85D04] transition-colors p-2">
                  <i data-lucide="menu" class="w-8 h-8"></i>
                </button>
              </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- MOBILE MENU IS NOW A SIBLING, NOT A CHILD -->
    <div id="mobile-menu" class="hidden fixed inset-0 z-[9999]">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" id="mobile-menu-backdrop"></div>
        <div class="absolute right-0 top-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-full z-[10000]" id="mobile-menu-panel" style="background-color: white !important; opacity: 1 !important;">
            <div class="p-6 relative z-[10001] bg-white h-full overflow-y-auto">
                <div class="flex justify-between items-center mb-8">
                    <span class="font-serif font-bold text-xl text-gray-800">Menu</span>
                    <button id="mobile-menu-close" class="text-gray-500 hover:text-[#E85D04]">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                <div class="space-y-2">
                    ${mobileLinksHTML}
                    <div class="pt-4 mt-4 border-t border-gray-100">
                        <a href="${root}donate.html" class="block w-full text-center bg-[#E85D04] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#D95F26] transition-colors duration-300">
                            Donate Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    document.getElementById('header-placeholder').innerHTML = html;
    highlightActiveLink();
    adjustMainPadding();
    lucide.createIcons();
}

function injectFooterFallback(root) {
    const year = new Date().getFullYear();
    const html = `
    <footer class="bg-gray-900 text-white mt-auto border-t border-gray-800">
      <div class="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div class="space-y-6">
            <div class="flex items-center gap-2">
                 <div class="bg-[#E85D04] text-white p-1 rounded">
                    <i data-lucide="heart-handshake" class="w-5 h-5"></i>
                 </div>
                 <h3 class="text-xl font-bold font-serif text-white">Shreekama Foundation</h3>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              Transforming lives across India through high-impact programs in education, empowerment, and environmental sustainability.
            </p>
             <!-- Social Icons -->
            <div class="flex items-center gap-4 pt-4">
                <a href="#" class="bg-gray-800 p-2 rounded-full hover:bg-[#E85D04] hover:text-white text-gray-400 transition-all duration-300" aria-label="Twitter">
                    <i data-lucide="twitter" class="w-5 h-5"></i>
                </a>
                <a href="#" class="bg-gray-800 p-2 rounded-full hover:bg-[#E85D04] hover:text-white text-gray-400 transition-all duration-300" aria-label="LinkedIn">
                    <i data-lucide="linkedin" class="w-5 h-5"></i>
                </a>
                <a href="#" class="bg-gray-800 p-2 rounded-full hover:bg-[#E85D04] hover:text-white text-gray-400 transition-all duration-300" aria-label="Facebook">
                    <i data-lucide="facebook" class="w-5 h-5"></i>
                </a>
                <a href="#" class="bg-gray-800 p-2 rounded-full hover:bg-[#E85D04] hover:text-white text-gray-400 transition-all duration-300" aria-label="Instagram">
                    <i data-lucide="instagram" class="w-5 h-5"></i>
                </a>
                <a href="#" class="bg-gray-800 p-2 rounded-full hover:bg-[#E85D04] hover:text-white text-gray-400 transition-all duration-300" aria-label="YouTube">
                    <i data-lucide="youtube" class="w-5 h-5"></i>
                </a>
            </div>
          </div>
    
          <!-- Quick Links -->
          <div>
            <h3 class="text-sm font-bold text-gray-100 tracking-wider uppercase mb-6">Quick Links</h3>
            <ul class="space-y-3">
              <li><a href="${root}about.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">About Us</a></li>
              <li><a href="${root}programs.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">Our Programs</a></li>
              <li><a href="${root}impact.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">Impact Stories</a></li>
              <li><a href="${root}events.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">Events</a></li>
              <li><a href="${root}contact.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">Contact Us</a></li>
            </ul>
          </div>
    
          <!-- Get Involved -->
          <div>
            <h3 class="text-sm font-bold text-gray-100 tracking-wider uppercase mb-6">Get Involved</h3>
            <ul class="space-y-3">
              <li><a href="${root}donate.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">Donate Now</a></li>
              <li><a href="${root}volunteer.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">Volunteer</a></li>
              <li><a href="${root}partners.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">Partner with Us</a></li>
            </ul>
          </div>
    
          <!-- Legal -->
          <div>
            <h3 class="text-sm font-bold text-gray-100 tracking-wider uppercase mb-6">Legal</h3>
            <ul class="space-y-3">
                 <li><a href="${root}content/policies/privacy-policy.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">Privacy Policy</a></li>
                 <li><a href="${root}content/policies/terms.html" class="text-gray-400 text-sm hover:text-[#E85D04] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
    
        <div class="mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; ${year} Shreekama Foundation. All Rights Reserved.</p>
        </div>
      </div>
    </footer>`;
    document.getElementById('footer-placeholder').innerHTML = html;
    lucide.createIcons();
}

// --- UI LOGIC ---

function checkScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const isScrolled = window.scrollY > 10;
    
    // Always keep white background, just toggle shadow intensity
    if (isScrolled) {
        header.classList.add('shadow-md');
        header.classList.remove('shadow-sm');
    } else {
        header.classList.add('shadow-sm');
        header.classList.remove('shadow-md');
    }
}

function setupMobileMenu() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#mobile-menu-btn');
        const closeBtn = e.target.closest('#mobile-menu-close');
        const backdrop = e.target.closest('#mobile-menu-backdrop');
        
        const menu = document.getElementById('mobile-menu');
        const panel = document.getElementById('mobile-menu-panel');

        if (!menu || !panel) return;

        if (btn) {
            menu.classList.remove('hidden');
            // Ensure panel is white
            panel.classList.add('bg-white'); 
            // Small delay to allow display block to render before transition
            requestAnimationFrame(() => {
                 panel.classList.remove('translate-x-full');
            });
        }
        
        if (closeBtn || backdrop) {
            panel.classList.add('translate-x-full');
            setTimeout(() => { menu.classList.add('hidden'); }, 300);
        }
    });
}

// --- RENDERERS ---

function createProgramCard(program) {
    const CAUSE_ICONS = { "Women’s Empowerment": "heart", "Child Education": "book-open", "Animal Welfare": "paw-print", "Environment": "leaf" };
    const iconName = CAUSE_ICONS[program.cause] || 'circle';
    const root = getRootPath();
    
    return `
    <a href="${root}program-detail.html?slug=${program.slug}" class="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 group h-full flex flex-col">
        <div class="relative h-56 overflow-hidden">
          <img src="${program.imageUrl}" alt="${program.imageAlt}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" loading="lazy" />
          <div class="absolute bottom-0 left-0 bg-[#E85D04] text-white text-xs font-bold px-4 py-1.5 rounded-tr-lg shadow-md">
            ${program.location}
          </div>
        </div>
        <div class="p-6 flex-grow flex flex-col">
          <div class="flex items-center gap-2 mb-3">
            <i data-lucide="${iconName}" class="w-4 h-4 text-[#E85D04]"></i>
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500">${program.cause}</h4>
          </div>
          <h3 class="text-xl font-bold font-serif mb-3 text-gray-900 group-hover:text-[#E85D04] transition-colors">${program.title}</h3>
          <p class="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">${program.shortDescription}</p>
          <span class="text-[#E85D04] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <i data-lucide="arrow-right" class="w-4 h-4"></i></span>
        </div>
    </a>`;
}

function createBlogCard(post) {
    const root = getRootPath();
    const url = post.url ? (root + post.url) : '#';
    
    return `
    <a href="${url}" class="block group h-full">
        <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
            <div class="overflow-hidden h-56 relative">
                 <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <p class="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">${post.date}</p>
                <h3 class="text-xl font-bold font-serif text-gray-900 group-hover:text-[#E85D04] transition-colors mb-3 line-clamp-2">${post.title}</h3>
                <p class="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">${post.excerpt}</p>
                <div class="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <span>Read Story</span>
                    <i data-lucide="arrow-up-right" class="w-4 h-4 text-[#E85D04]"></i>
                </div>
            </div>
        </div>
    </a>`;
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-value');
    if (counters.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'), 10);
                const suffix = counter.getAttribute('data-suffix') || '';
                let count = 0;
                const update = () => {
                    const inc = target / 50;
                    if(count < target) {
                        count += inc;
                        counter.innerText = Math.ceil(count).toLocaleString() + suffix;
                        requestAnimationFrame(update);
                    } else {
                        counter.innerText = target.toLocaleString() + suffix;
                    }
                };
                update();
                observer.unobserve(counter);
            }
        });
    });
    counters.forEach(c => observer.observe(c));
}

// --- INIT FUNCTIONS ---
function initHome() {
    const root = getRootPath();
    const statsContainer = document.getElementById('impact-stats-container');
    if (statsContainer) {
        statsContainer.innerHTML = IMPACT_STATS.map(stat => `
            <div class="text-center group p-4 rounded-lg hover:bg-orange-50 transition-colors duration-300">
                <p class="stat-value text-3xl md:text-5xl font-extrabold text-[#E85D04] font-serif mb-2 break-words" data-target="${stat.value}" data-suffix="${stat.suffix}">0${stat.suffix}</p>
                <p class="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-700 transition-colors">${stat.label}</p>
            </div>
        `).join('');
        initCounters();
    }
    const progGrid = document.getElementById('home-programs-grid');
    if (progGrid) {
        progGrid.innerHTML = PROGRAMS_DATA.slice(0, 4).map(program => createProgramCard(program)).join('');
    }
    const eventGrid = document.getElementById('home-events-grid');
    if (eventGrid) {
        eventGrid.innerHTML = EVENTS_DATA.filter(e => !e.isPast).slice(0, 2).map(event => `
            <div class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row group hover:shadow-xl transition-all duration-300">
                <div class="sm:w-2/5 overflow-hidden">
                    <img src="${event.imageUrl}" alt="${event.title}" class="w-full h-64 sm:h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div class="p-6 flex flex-col justify-between self-start w-full sm:w-3/5">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="calendar" class="w-4 h-4 text-[#E85D04]"></i>
                            <p class="text-sm font-bold text-[#E85D04] uppercase">${new Date(event.date).toLocaleDateString()}</p>
                        </div>
                        <h3 class="text-xl font-bold font-serif text-gray-900 group-hover:text-[#E85D04] transition-colors">${event.title}</h3>
                    </div>
                    <a href="${root}events.html" class="inline-block mt-4 text-sm font-bold text-gray-900 underline decoration-[#E85D04] underline-offset-4 hover:text-[#E85D04]">Event Details</a>
                </div>
            </div>
        `).join('');
    }
    const blogGrid = document.getElementById('home-blog-grid');
    if (blogGrid) {
        blogGrid.innerHTML = BLOG_POSTS_DATA.slice(0, 3).map(post => createBlogCard(post)).join('');
    }
}

function initPrograms() {
    const filterContainer = document.getElementById('cause-filters');
    let filtersHTML = `<button onclick="filterPrograms('All')" class="px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-300 shadow-sm bg-[#E85D04] text-white" id="filter-all">All Causes</button>`;
    filtersHTML += CAUSES.map(cause => 
        `<button onclick="filterPrograms('${cause}')" class="px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-300 shadow-sm bg-white text-gray-600 hover:bg-gray-50 filter-btn" data-cause="${cause}">${cause}</button>`
    ).join('');
    filterContainer.innerHTML = filtersHTML;
    filterPrograms('All');
}

function filterPrograms(cause) {
    const filtered = cause === 'All' ? PROGRAMS_DATA : PROGRAMS_DATA.filter(p => p.cause === cause);
    document.getElementById('programs-grid').innerHTML = filtered.map(p => createProgramCard(p)).join('');
    
    // Update active button state
    document.querySelectorAll('#cause-filters button').forEach(btn => {
        if((cause === 'All' && btn.id === 'filter-all') || btn.getAttribute('data-cause') === cause) {
            btn.classList.remove('bg-white', 'text-gray-600', 'hover:bg-gray-50');
            btn.classList.add('bg-[#E85D04]', 'text-white');
        } else {
            btn.classList.add('bg-white', 'text-gray-600', 'hover:bg-gray-50');
            btn.classList.remove('bg-[#E85D04]', 'text-white');
        }
    });

    lucide.createIcons();
}

function initProgramDetail() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const program = PROGRAMS_DATA.find(p => p.slug === slug);
    if (!program) return;
    document.getElementById('detail-hero-img').src = program.imageUrl;
    document.getElementById('detail-cause').textContent = program.cause;
    document.getElementById('detail-title').textContent = program.title;
    document.getElementById('detail-long-desc').textContent = program.longDescription;
}

function initBlog() {
    document.getElementById('blog-grid').innerHTML = BLOG_POSTS_DATA.map(p => createBlogCard(p)).join('');
}

function initEvents() {
    const upcoming = EVENTS_DATA.filter(e => !e.isPast);
    const past = EVENTS_DATA.filter(e => e.isPast);
    const renderEvent = (e) => `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div class="overflow-hidden h-56 relative">
            <img src="${e.imageUrl}" class="w-full h-full object-cover" />
        </div>
        <div class="p-6">
            <p class="text-sm font-semibold text-[#E85D04] mb-1">${e.date} • ${e.location}</p>
            <h3 class="text-xl font-bold font-serif text-gray-900 mb-3">${e.title}</h3>
            <p class="text-gray-600 text-sm">${e.description}</p>
        </div>
    </div>`;
    document.getElementById('upcoming-events-grid').innerHTML = upcoming.map(renderEvent).join('');
    document.getElementById('past-events-grid').innerHTML = past.map(renderEvent).join('');
}

function initImpact() {
    const container = document.getElementById('impact-stats-container');
    if(container && container.children.length === 0) {
        // Updated to remove individual card styling (bg-white/shadow) as container now provides it
        // Added responsive text sizing and overflow protection
        container.innerHTML = IMPACT_STATS.map(stat => `
            <div class="text-center group p-4 rounded-lg hover:bg-orange-50 transition-colors duration-300">
                <p class="stat-value text-3xl md:text-5xl font-extrabold text-[#E85D04] font-serif mb-2 break-words" data-target="${stat.value}" data-suffix="${stat.suffix}">0${stat.suffix}</p>
                <p class="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-700 transition-colors">${stat.label}</p>
            </div>
        `).join('');
        initCounters();
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const webhookUrl = form.getAttribute('data-webhook-url');
    if (btn) { btn.innerText = 'Processing...'; btn.disabled = true; }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) { window.location.href = 'thank-you.html'; }
        else { alert('Submission failed.'); }
    } catch (error) { alert('Network error.'); }
    
    if (btn) { btn.innerText = 'Submit'; btn.disabled = false; }
}

window.filterPrograms = filterPrograms;
window.handleFormSubmit = handleFormSubmit;