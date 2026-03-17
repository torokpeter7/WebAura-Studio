const SUPABASE_URL = 'https://eycbunhpmqhvnpyxaeuh.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_aN9eIv_JrRhiC4ciZ_jrrg_IHIqjDu5';

    const pages = document.querySelectorAll('.page');
    const links = document.querySelectorAll('[data-link]');
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuBtn');

    function showPage(hash) {
      const target = (hash || '#home').replace('#', '');

      pages.forEach(page => {
        page.classList.toggle('active', page.id === target);
      });

      links.forEach(link => {
        const isActive = link.getAttribute('href') === `#${target}`;
        link.classList.toggle('active', isActive);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      navLinks.classList.remove('show');
    }

    window.addEventListener('hashchange', () => showPage(location.hash));
    window.addEventListener('load', () => showPage(location.hash));

    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    const filterButtons = document.querySelectorAll('[data-filter]');
    const portfolioItems = document.querySelectorAll('[data-category]');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(item => item.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        portfolioItems.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hidden', !match);
        });
      });
    });

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    function setFormStatus(message, type) {
      formStatus.textContent = message;
      formStatus.className = `form-status show ${type}`;
    }

    function isSupabaseConfigured() {
      return !SUPABASE_URL.includes('IDE_IRD') && !SUPABASE_ANON_KEY.includes('IDE_IRD');
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!isSupabaseConfigured()) {
        setFormStatus('Még nem állítottad be a Supabase kulcsokat az index_supabase.html fájlban.', 'error');
        return;
      }

      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get('name')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        phone: formData.get('phone')?.toString().trim(),
        website_type: formData.get('website_type')?.toString().trim() || null,
        message: formData.get('message')?.toString().trim(),
        status: 'uj'
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Küldés...';
      setFormStatus('Az üzenet küldése folyamatban van...', 'success');

      try {
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { error } = await supabase.from('contact_requests').insert([payload]);

        if (error) throw error;

        contactForm.reset();
        setFormStatus('Siker! Az ajánlatkérésedet megkaptuk, hamarosan jelentkezünk.', 'success');
      } catch (error) {
        console.error(error);
        setFormStatus(`Hiba történt küldés közben: ${error.message || 'ismeretlen hiba'}`, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Üzenet küldése';
      }
    });