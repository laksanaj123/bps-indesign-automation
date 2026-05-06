import pandas as pd
import re

def zero_to_endash(val):
    if val == "0" or val == 0:
        return "–"
    return val

def to_indo_number(val):
    if val is None or (isinstance(val, float) and pd.isna(val)) or (isinstance(val, str) and val.strip() == ''):
        return ''
    if isinstance(val, (int, float)):
        return zero_to_endash('{:,.2f}'.format(val).replace(',', 'X').replace('.', ',').replace('X', '.'))
    if isinstance(val, str):
        s = val.replace(' ', '').replace('Rp', '').replace('IDR', '').replace('-', '')
        s = re.sub(r'[^0-9.,]', '', s)
        if re.match(r'^\d{1,3}(\.\d{3})*(,\d+)?$', s):
            return zero_to_endash(s)
        if re.match(r'^\d+(\.\d+)?$', s):
            try:
                return zero_to_endash('{:,.2f}'.format(float(s)).replace(',', 'X').replace('.', ',').replace('X', '.'))
            except:
                pass
        if re.match(r'^\d{1,3}(,\d{3})+(\.\d+)?$', s):
            try:
                s2 = s.replace(',', '')
                return zero_to_endash('{:,.2f}'.format(float(s2)).replace(',', 'X').replace('.', ',').replace('X', '.'))
            except:
                pass
        if re.match(r'^\d{1,3}(\.\d{3})+$', s):
            return zero_to_endash(s)
        if s.isdigit():
            return zero_to_endash('{:,}'.format(int(s)).replace(',', '.'))
        if re.match(r'^\d+(,\d+)?$', s):
            try:
                return zero_to_endash('{:,.2f}'.format(float(s.replace(',', '.'))).replace(',', 'X').replace('.', ',').replace('X', '.'))
            except:
                pass
        s2 = re.sub(r'[^0-9,\.]', '', s)
        try:
            return zero_to_endash('{:,.2f}'.format(float(s2.replace(',', '.'))).replace(',', 'X').replace('.', ',').replace('X', '.'))
        except:
            return zero_to_endash(s)
    return zero_to_endash(val)

def to_indo_number_without_comma(val):
    val = to_indo_number(val)
    if isinstance(val, str):
        val = val.replace(',00', '')
    return zero_to_endash(val)  # ← diperbaiki: tambah (val)

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
            "luas": to_indo_number(f"{luas:.2f}"),
            "persen": to_indo_number(f"{persen:.2f}")
        })

    return {
        "rows": rows,
        "totalLuas": to_indo_number(f"{total_luas:.2f}"),
        "totalPersentase": to_indo_number(f"{total_persen:.2f}")
    }

def build_tabel1_2(group, dataDesa, dataKesehatan, dataMerge):
    result = []

    for _, row in dataDesa.iterrows():
        result.append({
            "desa": row["namaDesa"],
            "jarak_kec": str(to_indo_number(row["jarakkeKecamatan"])),
            "jarak_kab": str(to_indo_number(row["jarakKeKantorBupati"]))
        })

    return result

def build_tabel2_2_2(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "jumlahPnsBerdasarkanTingkatPendidikan"]

    for _, row in dataHasil.iterrows():
        result.append({
            "tingkatPendidikan": str(row["tingkatPendidikan"]),
            "lakiLaki": str(to_indo_number_without_comma(row["lakiLaki"])),
            "perempuan": str(to_indo_number_without_comma(row["perempuan"])),
            "total": str(to_indo_number_without_comma(row["total"]))
        })

    return result

def build_tabel2_2_3(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "jumlahPppkBerdasarkanTingkatPendidikan"]

    for _, row in dataHasil.iterrows():
        result.append({
            "tingkatPendidikan": str(row["tingkatPendidikan"]),
            "lakiLaki": str(to_indo_number_without_comma(row["lakiLaki"])),
            "perempuan": str(to_indo_number_without_comma(row["perempuan"])),
            "total": str(to_indo_number_without_comma(row["total"]))
        })

    return result

TABLE_BUILDERS = {
    "tabel1_1": build_tabel1_1,
    "tabel1_2": build_tabel1_2,
    "tabel2_2_2": build_tabel2_2_2,
    "tabel2_2_3": build_tabel2_2_3,
}