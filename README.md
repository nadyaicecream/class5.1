# Class 5.1 — Our Little Universe

Website kelas statis (HTML, CSS, JavaScript, JSON), siap untuk GitHub Pages.

## Deploy ke GitHub Pages
1. Ekstrak ZIP ini.
2. Buat repository GitHub baru, misalnya `class-51`.
3. Upload semua isi folder project (pastikan `index.html`, `style.css`, `script.js`, dan folder `assets` ada di root repository).
4. Buka **Settings → Pages**.
5. Pada **Build and deployment**, pilih **Deploy from a branch**.
6. Pilih branch `main` dan folder `/ (root)`, lalu Save.
7. Tunggu proses deploy dan buka URL GitHub Pages yang diberikan.

## Edit data kelas
Buka `assets/data.json` untuk mengubah:
- daftar nama dan profil anggota;
- jadwal piket;
- jadwal pelajaran;
- tanggal countdown;
- pengumuman, quotes, dan tanggal ulang tahun.

Catatan roster: daftar jadwal piket yang diberikan berisi 20 nama unik. Karena itu template profil menampilkan 20 nama agar semua nama dari jadwal tercakup. Jika kelas memang beranggotakan 19 orang, hapus nama yang tidak termasuk anggota kelas di bagian `members` dan `birthdays` pada `assets/data.json`.

## Musik
Pemutar memakai YouTube IFrame Player API untuk video resmi **Sheila On 7 – Kita** dari Sony Music Entertainment Indonesia:
https://www.youtube.com/watch?v=oOXba6xE41Q

Musik tidak autoplay saat halaman dibuka. Pengunjung menekan **ENTER CLASS 5.1 🎵** terlebih dahulu. Lagu diputar melalui layanan YouTube, bukan disalin atau di-host ulang. Jika browser atau jaringan memblokir pemutaran, gunakan ikon ↗ pada music dock untuk membuka video resmi.

## Catatan fitur
- Guestbook dan mood tersimpan di browser masing-masing (localStorage), belum tersinkron antar perangkat.
- Foto yang diunggah di album hanya tampil selama tab/sesi browser masih aktif; untuk galeri permanen, upload gambar ke repository atau layanan penyimpanan gambar dan tautkan URL-nya.
- Ganti `assets/og-image.png` untuk preview share dan `assets/favicon.svg` untuk ikon tab.
- Website tidak membutuhkan backend dan ringan untuk GitHub Pages.
