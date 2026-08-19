# BPS InDesign Automation 📊

Sistem otomasi untuk menghasilkan dokumen InDesign berdasarkan data demografis kecamatan di Kabupaten Sanggau.

## 🎯 Tujuan

Project ini mengotomasi proses pembuatan script InDesign (JSX) untuk publikasi statistik Badan Pusat Statistik (BPS) Kabupaten Sanggau dengan cara:

1. **Mengambil data** dari Google Sheets
2. **Memproses dan mengelompokkan** data per kecamatan
3. **Menggenerasi script JSX** yang siap digunakan di InDesign
4. **Mengisi metadata dan tabel** secara otomatis

Hasilnya adalah script JSX yang dapat langsung dijalankan di InDesign untuk mengisi dokumen dengan data yang benar dan terkini.

---

## 📁 Struktur Project

```
bps-indesign-automation/
├── run_all.py                   # Script utama: copy folder + generate JSX + buat runner
├── generate_script.py           # Script generate JSX saja (tanpa copy folder)
├── generate_script.ipynb        # Notebook untuk eksperimen (opsional)
├── table_builders.py            # Fungsi-fungsi untuk membangun struktur tabel
├── table_services.py            # Service untuk inject data tabel ke template
├── metadata_services.py         # Service untuk membangun metadata publikasi
├── template.jsx                 # Template JSX (berisi placeholder + fungsi isiTabel)
├── generate_jsx/                # Output folder script JSX yang sudah di-generate
│   ├── Balai.jsx
│   ├── Beduai.jsx
│   └── ...
└── README.md                    # File ini
```

---

## 🔧 Komponen Utama

### 1. **run_all.py** 🚀
Script utama yang menjalankan **seluruh otomasi dalam satu kali jalan**:

```python
# Alur kerja run_all.py:
1. Ambil data dari Google Sheets (metadata, desa, kesehatan, merge)
2. Kelompokkan data per kecamatan
3. Untuk setiap kecamatan:
   a. Salin folder [Fix] Template KCDA 2026 → {namaKecamatan}/
   b. Build metadata dari data baris pertama
   c. Replace placeholder di template dengan metadata
   d. Inject tabel data
   e. Simpan sebagai "Isi Data {namaKecamatan}.jsx"
4. Generate _RUN_ALL.jsx (master runner untuk InDesign)
```

### 2. **generate_script.py** 📝
Script untuk generate JSX saja (tanpa copy folder). Berguna untuk development/debugging.

**Google Sheets yang digunakan:**
- **Metadata publikasi** (Sheet ID: 903602598): Informasi tentang penulis, layouter, penyunting, dll.
- **Data wilayah** (Sheet ID: 583286261): Data desa/kecamatan dengan info luas wilayah, jarak, dll.

### 2. **table_builders.py** 📋
Modul yang berisi fungsi-fungsi untuk membangun struktur tabel:

| Fungsi | Tujuan | Output |
|--------|--------|--------|
| `build_tabel1_1(group)` | Membuat tabel luas wilayah dengan persentase | Dictionary dengan rows + metadata total |
| `build_tabel1_2(group)` | Membuat tabel jarak (ke kecamatan & kantor bupati) | List data jarak |

**Contoh output `build_tabel1_1`:**
```json
{
  "rows": [
    {"desa": "Desa A", "luas": "1000,50", "persen": "25,50"},
    {"desa": "Desa B", "luas": "2000,75", "persen": "45,25"}
  ],
  "totalLuas": "3001,25",
  "totalPersentase": "100,00"
}
```

### 3. **table_services.py** 💉
Service untuk menginject (memasukkan) data tabel ke dalam template JSX:

- Mengambil hasil dari `table_builders`
- Replace placeholder template dengan data JSON (untuk rows)
- Replace placeholder dengan metadata (total luas, total persentase, dll)

### 4. **metadata_services.py** 📝
Service untuk membangun metadata publikasi dari data baris pertama:

| Field | Deskripsi |
|-------|-----------|
| `namaKecamatan` | Nama kecamatan |
| `namaKec_Kapital` | Nama kecamatan dengan kapitalisasi |
| `nomorVolume` | Nomor volume publikasi |
| `nomorKatalog` | Nomor katalog |
| `nomorPublikasi` | Nomor publikasi |
| `jumlahHalaman` | Jumlah halaman |
| `sumberIlustrasi` | Sumber ilustrasi |
| `namaPenyunting` | Nama penyunting |
| `namaPenulis` | Nama penulis |
| `namaLayouter` | Nama layouter |
| `namaInfografis` | Nama pembuat infografis |
| `namaPenerjemah` | Nama penerjemah |

### 5. **template_new.jsx** 🎨
Template InDesign Script (ExtendScript) yang:
- Mengakses dokumen InDesign yang aktif
- Memiliki placeholder dalam format `{fieldName}` untuk data scalar (metadata)
- Memiliki placeholder dalam format `{tableName}` untuk tabel
- Berisi fungsi `isiTabel()` untuk mengisi data ke tabel InDesign

**Struktur placeholder:**
```jsx
// Metadata (akan di-replace dengan nilai string)
var data = {
    namaKecamatan: "{namaKecamatan}",
    nomorVolume: "{nomorVolume}",
    ...
};

// Tabel (akan di-replace dengan JSON array)
var tabel1_1 = {tabel1_1};
var tabel1_2 = {tabel1_2};
```

---

## 🚀 Cara Menggunakan

### Prerequisites
```bash
Python 3.7+
pandas
numpy
requests
Adobe InDesign (untuk langkah ke-2)
```

### Instalasi
```bash
# Clone atau download project
cd bps-indesign-automation

# Install dependencies
pip install pandas numpy requests
```

### Workflow Lengkap (run_all.py)

Script `run_all.py` menjalankan **seluruh proses otomasi dalam satu kali jalan**:

```bash
python run_all.py
```

**Yang dilakukan `run_all.py`:**
1. Mengambil data dari Google Sheets (metadata, desa, kesehatan, merge)
2. Untuk setiap kecamatan:
   - Menyalin folder template `[Fix] Template KCDA 2026` → `Draf Edit Publikasi/{namaKecamatan}/`
   - Membuat file JSX berisi data kecamatan → `Isi Data {namaKecamatan}.jsx`
3. Membuat file `_RUN_ALL.jsx` (master runner untuk InDesign)

**Struktur folder hasil:**
```
Draf Edit Publikasi/
├── [Fix] Template KCDA 2026/          ← Template asli (tidak diubah)
├── Balai/
│   ├── 00 Cover Depan.indd
│   ├── 01 Halaman Depan.indd
│   ├── Bab01.indd ... Bab07.indd
│   ├── Links/
│   ├── Document fonts/
│   └── Isi Data Balai.jsx             ← JSX dengan data Balai
├── Beduai/
│   ├── ... (sama seperti di atas)
│   └── Isi Data Beduai.jsx
├── Bungur/
│   └── ...
├── ... (satu folder per kecamatan)
└── _RUN_ALL.jsx                       ← Master runner
```

### Menjalankan Isi Data ke InDesign

Setelah `run_all.py` selesai, jalankan langkah berikut:

1. Buka **Adobe InDesign**
2. Buka panel **Scripts**: `Window → Utilities → Scripts`
3. Klik kanan di panel Scripts → **Reveal in Explorer** (Windows) / **Reveal in Finder** (Mac)
4. Copy file `_RUN_ALL.jsx` ke folder Scripts Panel yang terbuka
5. **Jalankan `_RUNALL.jsx`** dari panel Scripts

**Yang dilakukan `_RUN_ALL.jsx`:**
- Loop ke semua folder kecamatan di `Draf Edit Publikasi/`
- Untuk setiap folder, buka semua file `.indd`
- Jalankan script `Isi Data {namaKecamatan}.jsx` → mengganti `{{placeholder}}` + mengisi tabel
- **Simpan dan tutup** otomatis
- Menampilkan log hasil di akhir

### Workflow Manual (opsional)

Jika ingin menjalankan per kecamatan secara manual:

**Opsi 1: Generate JSX saja**
```bash
python generate_script.py
```
Output: file JSX di folder `generate_jsx/`

**Opsi 2: Jalankan dari Jupyter Notebook (untuk development/debugging)**
```bash
jupyter notebook generate_script.ipynb
```

**Cara manual jalankan JSX di InDesign:**
1. Buka file `.indd` di InDesign
2. Buka panel Scripts (`Window → Utilities → Scripts`)
3. Drag & drop atau jalankan script `Isi Data {namaKecamatan}.jsx`
4. Simpan dokumen

---

## 📊 Alur Data

```
┌─────────────────────────────────┐
│   Google Sheets (Metadata)      │  ← Informasi penulis, layouter, dll
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Google Sheets (Data Wilayah)  │  ← Data luas wilayah, jarak, dll
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   run_all.py                    │
│   - Ambil data dari Google      │
│   - Kelompokkan per kecamatan   │
└──────────────┬──────────────────┘
               │
               ▼ (Untuk setiap kecamatan)
┌─────────────────────────────────┐
│   1. Copy template folder       │  ← Salin [Fix] Template KCDA 2026
│      → {namaKecamatan}/         │     ke Draf Edit Publikasi/
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   2. Generate JSX               │  ← metadata + tabel di-inject
│      → Isi Data {nama}.jsx      │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   3. Buat _RUN_ALL.jsx          │  ← Master runner untuk InDesign
└──────────────┬──────────────────┘
               │
               ▼ (Jalankan di InDesign)
┌─────────────────────────────────┐
│   _RUN_ALL.jsx                  │
│   - Buka setiap folder kecamatan│
│   - Buka setiap file .indd      │
│   - Jalankan Isi Data JSX       │  ← Replace {{placeholder}} + isi tabel
│   - Simpan & tutup              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Dokumen InDesign siap pakai   │  ◄─ Data sudah terisi semua
└─────────────────────────────────┘
```

---

## 🔍 Detail Teknis

### Format Data dari Google Sheets

**Sheet Metadata:**
- `namaDesa`: Nama desa
- `namaPenyunting`: Nama penyunting (format: "Nama1, Nama2")
- `namaPenulis`: Nama penulis
- `namaLayouter`: Nama layouter
- `namaInfografis`: Nama pembuat infografis
- `namaPenerjemah`: Nama penerjemah

**Sheet Data Wilayah:**
- `namaKecamatan`: Nama kecamatan
- `namaDesa`: Nama desa
- `luasWilayahDesa`: Luas dalam satuan tertentu (numeric)
- `jarakKecamatan`: Jarak ke kecamatan (numeric)
- `jarakKantorBupati`: Jarak ke kantor bupati (numeric)

### Format Penggabungan Nama
```python
# Input: "Nama1, Nama2, Nama3"
# Output: "Nama1 • Nama2 • Nama3"

df["namaPenyunting_joint"] = df["namaPenyunting"].str.replace(", ", " • ")
```

### Format Angka Indonesia
- Desimal menggunakan koma (`,`) bukan titik (`.`)
- Contoh: `1234.56` → `"1234,56"`

---

## ⚠️ Catatan Penting

1. **Google Sheets URL**: Pastikan URL dan Sheet ID di `generate_script.py` sudah benar
2. **Akses Google Sheets**: Spreadsheet harus bersifat publik atau akses dibagikan
3. **Encoding**: Semua file menggunakan encoding UTF-8
4. **Placeholder di Template**: Harus sesuai dengan key di `metadata` dan `table_builders`
5. **Konvensi Placeholder**: 
   - Metadata/scalar: `{fieldName}`
   - Array/Tabel: `{tabel1_1}`, `{tabel1_2}`

---

## 🛠️ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `Gagal akses spreadsheet` | Cek URL dan Sheet ID, pastikan spreadsheet publik |
| `Module not found` | Install dependencies: `pip install pandas numpy requests` |
| `Encoding error` | Pastikan file menggunakan UTF-8 |
| `Placeholder tidak diganti` | Cek format placeholder di .indd, pastikan pakai `{{namaKecamatan}}` (double curly brace) |
| `Data kosong di tabel` | Cek data di Google Sheets, pastikan kolom tersedia |
| `Folder sudah ada, skip copy` | Normal. Folder kecamatan yang sudah ada tidak akan ditimpa |
| `_RUN_ALL.jsx tidak jalan` | Pastikan file di-copy ke folder Scripts Panel InDesign, bukan dijalankan dari Explorer |
| `JSX error di InDesign` | Buka file .indd dulu sebelum jalankan JSX. Pastikan dokumen aktif |
| `File .indd tidak terbuka` | Pastikan tidak ada file .indd yang sedang terbuka di InDesign sebelum jalankan _RUN_ALL |

---

## 📝 Lisensi & Kontribusi

Developed for BPS Kabupaten Sanggau. 

---

## 📞 Kontak & Support

Jika ada pertanyaan atau isu, silakan buat issue atau hubungi tim development.
