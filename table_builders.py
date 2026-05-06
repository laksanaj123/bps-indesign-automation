import re

def to_indo_number(val):
    if val is None or (isinstance(val, float) and pd.isna(val)) or (isinstance(val, str) and val.strip() == ''):
        return ''
    if isinstance(val, (int, float)):
        return '{:,.2f}'.format(val).replace(',', 'X').replace('.', ',').replace('X', '.')
    if isinstance(val, str):
        # Hilangkan spasi, simbol mata uang, dan karakter non-angka kecuali koma/titik
        s = val.replace(' ', '').replace('Rp', '').replace('IDR', '').replace('-', '')
        s = re.sub(r'[^0-9.,]', '', s)
        # Jika sudah format indo (1.234,56), biarkan
        if re.match(r'^\d{1,3}(\.\d{3})*(,\d+)?$', s):
            return s
        # Jika format 1234.56 (dot desimal), ubah ke indo
        if re.match(r'^\d+(\.\d+)?$', s):
            try:
                return '{:,.2f}'.format(float(s)).replace(',', 'X').replace('.', ',').replace('X', '.')
            except:
                pass
        # Jika format 1,234.56 (koma ribuan, dot desimal)
        if re.match(r'^\d{1,3}(,\d{3})+(\.\d+)?$', s):
            try:
                s2 = s.replace(',', '')
                return '{:,.2f}'.format(float(s2)).replace(',', 'X').replace('.', ',').replace('X', '.')
            except:
                pass
        # Jika format 1.234.567 (dot ribuan, tanpa desimal)
        if re.match(r'^\d{1,3}(\.\d{3})+$', s):
            return s
        # Jika format 1234567 (tanpa pemisah)
        if s.isdigit():
            return '{:,}'.format(int(s)).replace(',', '.')
        # Jika format 1234,56 (koma desimal)
        if re.match(r'^\d+(,\d+)?$', s):
            try:
                return '{:,.2f}'.format(float(s.replace(',', '.'))).replace(',', 'X').replace('.', ',').replace('X', '.')
            except:
                pass
        # Jika format campuran lain, ambil angka saja
        s2 = re.sub(r'[^0-9,\.]', '', s)
        try:
            return '{:,.2f}'.format(float(s2.replace(',', '.'))).replace(',', 'X').replace('.', ',').replace('X', '.')
        except:
            return s
    return val

# Fungsi untuk mengubah string angka biasa ke format Indonesia (ribuan titik, desimal koma)
def to_indo_number_without_comma(val):
    val = to_indo_number(val)
    if isinstance(val, str):
        # Hapus koma desimal jika ada
        val = val.replace(',00', '')
    return val

# Fungsi untuk buat tabel
def build_tabel1_1(group, dataDesa, dataKesehatan, dataMerge):
    total_luas = dataDesa["luasWilayahDesa"].sum()

    rows = []
    total_persen = 0

    for _, row in dataDesa.iterrows():
        luas = row["luasWilayahDesa"]
        persen = (luas / total_luas) * 100 if total_luas != 0 else 0
        total_persen += persen

        rows.append({
            "desa": str(row["namaDesa"]),
            "luas": f"{luas:.2f}".replace(".", ","),
            "persen": f"{persen:.2f}".replace(".", ",")
        })

    return {
        "rows": rows,
        "totalLuas": f"{total_luas:.2f}".replace(".", ","),
        "totalPersentase": f"{total_persen:.2f}".replace(".", ",")
    }

def build_tabel1_2(group, dataDesa, dataKesehatan, dataMerge):
    result = []

    for _, row in dataDesa.iterrows():
        result.append({
            "desa": row["namaDesa"],
            "jarak_kec": str(row["jarakkeKecamatan"]).replace(".", ","),
            "jarak_kab": str(row["jarakKeKantorBupati"]).replace(".", ",")
        })

    return result

def build_tabel2_2_2(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "jumlahPnsBerdasarkanTingkatPendidikan"]

    for _, row in dataHasil.iterrows():
        result.append({
            "tingkatPendidikan": str(row["tingkatPendidikan"]),
            "lakiLaki": str(row["lakiLaki"]),
            "perempuan": str(row["perempuan"]),
            "total": str(row["total"])
        })

    return result

TABLE_BUILDERS = {
    "tabel1_1": build_tabel1_1,
    "tabel1_2": build_tabel1_2,
    "tabel2_2_2": build_tabel2_2_2,
}