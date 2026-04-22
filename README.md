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
├── generate_script.py           # Script utama yang menjalankan seluruh proses
├── generate_script.ipynb        # Notebook untuk eksperimen (opsional)
├── table_builders.py            # Fungsi-fungsi untuk membangun struktur tabel
├── table_services.py            # Service untuk inject data tabel ke template
├── metadata_services.py         # Service untuk membangun metadata publikasi
├── template.jsx                 # Template JSX lama (backup)
├── template_new.jsx             # Template JSX yang aktif digunakan
├── generate_jsx/                # Output folder dengan script JSX yang sudah di-generate
│   ├── 6105020001.jsx          # Script per desa
│   ├── Balai.jsx               # Script per kecamatan
│   └── ... (lebih banyak file)
└── README.md                    # File ini
```

---

## 🔧 Komponen Utama

### 1. **generate_script.py** 🚀
Script utama yang mengorkestra seluruh proses:

```python
# Alur kerja:
1. Ambil data dari Google Sheets (metadata publikasi)
2. Ambil data dari Google Sheets (data wilayah/desa per kecamatan)
3. Kelompokkan data per kecamatan
4. Untuk setiap kecamatan:
   - Buat metadata dari data baris pertama
   - Replace placeholder di template dengan metadata
   - Inject tabel data
   - Simpan hasil sebagai file JSX
```

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
```

### Instalasi
```bash
# Clone atau download project
cd bps-indesign-automation

# Install dependencies
pip install pandas numpy requests
```

### Menjalankan Script

**Opsi 1: Jalankan Python Script**
```bash
python generate_script.py
```

**Opsi 2: Jalankan dari Jupyter Notebook (untuk development/debugging)**
```bash
jupyter notebook generate_script.ipynb
```

### Output
- Script JSX akan di-generate di folder `generate_jsx/`
- Satu file JSX untuk setiap kecamatan
- File siap digunakan di InDesign

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
│   generate_script.py            │
│   - Ambil data dari Google      │
│   - Kelompokkan per kecamatan   │
└──────────────┬──────────────────┘
               │
               ▼ (Untuk setiap kecamatan)
┌─────────────────────────────────┐
│   metadata_services.py          │  ← Build metadata
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   template_new.jsx              │  ← Replace metadata
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   table_builders.py             │  ← Build tabel data
│   table_services.py             │  ← Inject tabel ke template
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   generate_jsx/[Kecamatan].jsx  │  ◄─ JSX Script siap pakai
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
| `Module not found` | Install dependencies: `pip install -r requirements.txt` |
| `Encoding error` | Pastikan file menggunakan UTF-8 |
| `Placeholder tidak diganti` | Cek format placeholder, pastikan sesuai di template |
| `Data kosong di tabel` | Cek data di Google Sheets, pastikan kolom tersedia |

---

## 📝 Lisensi & Kontribusi

Developed for BPS Kabupaten Sanggau. 

---

## 📞 Kontak & Support

Jika ada pertanyaan atau isu, silakan buat issue atau hubungi tim development.
