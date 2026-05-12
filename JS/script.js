  // File preview
    const fileInput = document.getElementById('inp-foto');
    const uploadZone = document.getElementById('upload-zone');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const uploadPreview = document.getElementById('upload-preview');
    const previewImg = document.getElementById('preview-img');
    const previewName = document.getElementById('preview-name');

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewName.textContent = file.name;
        uploadPlaceholder.classList.add('hidden');
        uploadPreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    });

    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragging'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragging'));
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragging');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('change'));
      }
    });

    function formatDate(dateStr) {
      if (!dateStr) return '-';
      const [y, m, d] = dateStr.split('-');
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
      return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
    }

    function calcDurasi(start, end) {
      const s = new Date(start), e = new Date(end);
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
      if (isNaN(diff) || diff < 0) return '-';
      if (diff === 0) return '1 hari';
      return `${diff + 1} hari`;
    }

    function genRef() {
      return 'DE-' + Date.now().toString(36).toUpperCase().slice(-6);
    }

    function generateCard() {
      const nama = document.getElementById('inp-nama').value.trim();
      const tglLahir = document.getElementById('inp-tgl-lahir').value;
      const gender = document.getElementById('inp-gender').value;
      const asal = document.getElementById('inp-asal').value.trim();
      const tglMulai = document.getElementById('inp-tgl-mulai').value;
      const tglSelesai = document.getElementById('inp-tgl-selesai').value;
      const jenisMobil = document.getElementById('inp-jenis-mobil').value;
      const foto = fileInput.files[0];
      const errEl = document.getElementById('form-error');

      if (!nama || !tglLahir || !gender || !asal || !tglMulai || !tglSelesai || !jenisMobil || !foto) {
        errEl.classList.remove('hidden');
        return;
      }
      errEl.classList.add('hidden');

      // Fill card
      document.getElementById('card-nama').textContent = nama;
      document.getElementById('card-tgl-lahir').textContent = formatDate(tglLahir);
      document.getElementById('card-asal').textContent = asal;
      document.getElementById('card-asal-info').textContent = asal;
      document.getElementById('card-jenis-mobil').textContent = jenisMobil;
      document.getElementById('card-tgl-mulai').textContent = formatDate(tglMulai);
      document.getElementById('card-tgl-selesai').textContent = formatDate(tglSelesai);
      document.getElementById('card-durasi').textContent = calcDurasi(tglMulai, tglSelesai);
      document.getElementById('card-ref').textContent = genRef();

      // Gender badge
      const badge = document.getElementById('card-gender-badge');
      badge.textContent = gender;
      if (gender === 'Laki-laki') {
        badge.className = 'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-blue-400/40 text-blue-300 bg-blue-400/10';
      } else {
        badge.className = 'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-pink-400/40 text-pink-300 bg-pink-400/10';
      }

      // Photo
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('card-foto').src = e.target.result;
      };
      reader.readAsDataURL(foto);

      // Show card
      const cardSection = document.getElementById('card-section');
      cardSection.classList.remove('hidden');
      cardSection.classList.add('slide-up');
      setTimeout(() => {
        cardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    function downloadCard() {
      const cardElement = document.getElementById('output-card');
      html2canvas(cardElement, {
        backgroundColor: '#1a1a1a', // Match the dark background
        scale: 2, // Higher resolution
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'kartu-sewa-mobil.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(err => {
        console.error('Error generating canvas:', err);
        alert('Terjadi kesalahan saat mendownload kartu. Silakan screenshot manual.');
      });
    }

    function resetForm() {
      document.getElementById('card-section').classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
