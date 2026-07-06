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
def build_tabel1_1_1(group, dataDesa, dataKesehatan, dataMerge):
    total_luas = dataDesa["luasWilayahDesa"].sum()

    rows = []
    total_persen = 0

    for _, row in dataDesa.iterrows():
        luas = row["luasWilayahDesa"]
        persen = (luas / total_luas) * 100 if total_luas != 0 else 0
        total_persen += persen

        rows.append({
            "namaDesa": str(row["namaDesa"]),
            "luasWilayahDesa": to_indo_number(f"{luas:.2f}"),
            "persentaseLuasWilayahDesa": to_indo_number(f"{persen:.2f}")
        })

    return rows

def build_tabel1_1_2(group, dataDesa, dataKesehatan, dataMerge):
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

def build_tabel2_2_8(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "jumlahPnsBerdasarkanGolongan"]

    for _, row in dataHasil.iterrows():
        result.append({
            "tingkatPendidikan": str(row["tingkatPendidikan"]),
            "lakiLaki": str(to_indo_number_without_comma(row["lakiLaki"])),
            "perempuan": str(to_indo_number_without_comma(row["perempuan"])),
            "total": str(to_indo_number_without_comma(row["total"]))
        })

    return result

def build_tabel2_2_9(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "jumlahPppkBerdasarkanGolongan"]

    for _, row in dataHasil.iterrows():
        result.append({
            "tingkatPendidikan": str(row["tingkatPendidikan"]),
            "lakiLaki": str(to_indo_number_without_comma(row["lakiLaki"])),
            "perempuan": str(to_indo_number_without_comma(row["perempuan"])),
            "total": str(to_indo_number_without_comma(row["total"]))
        })

    return result

def build_tabel3_1_3(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa

    for _, row in dataHasil.iterrows():
        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "wajibKtpDisdukcapil": str(to_indo_number_without_comma(row["wajibKtpDisdukcapil"])),
            "memilikiKtpDisdukcapil": str(to_indo_number_without_comma(row["memilikiKtpDisdukcapil"])),
            "belumMemilikiKtpDisdukcapil": str(to_indo_number_without_comma(row["belumMemilikiKtpDisdukcapil"]))
        })

    return result

def build_tabel3_1_4(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wajibKkDisdukcapil	memilikiKkDisdukcapil	belumMemilikiKkDisdukcapil
    for _, row in dataHasil.iterrows():
        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "wajibKkDisdukcapil": str(to_indo_number_without_comma(row["wajibKkDisdukcapil"])),
            "memilikiKkDisdukcapil": str(to_indo_number_without_comma(row["memilikiKkDisdukcapil"])),
            "belumMemilikiKkDisdukcapil": str(to_indo_number_without_comma(row["belumMemilikiKkDisdukcapil"]))
        })

    return result

def build_tabel3_1_5(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "wniDisdukcapil": str(to_indo_number_without_comma(row["wniDisdukcapil"])),
            "wnaDisdukcapil": str(to_indo_number_without_comma(row["wnaDisdukcapil"]))
        })

    return result

def build_tabel3_1_6(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "islamDisdukcapil": str(to_indo_number_without_comma(row["islamDisdukcapil"])),
            "katholikDisdukcapil": str(to_indo_number_without_comma(row["katholikDisdukcapil"])),
            "kristenDisdukcapil": str(to_indo_number_without_comma(row["kristenDisdukcapil"]))
        })

    return result

def build_tabel3_1_6v2(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "hinduDisdukcapil": str(to_indo_number_without_comma(row["hinduDisdukcapil"])),
            "buddhaDisdukcapil": str(to_indo_number_without_comma(row["buddhaDisdukcapil"])),
            "khonghucuDisdukcapil": str(to_indo_number_without_comma(row["khonghucuDisdukcapil"])),
            "agamaLainnyaDisdukcapil": str(to_indo_number_without_comma(row["agamaLainnyaDisdukcapil"]))
        })

    return result

def build_tabel3_1_7(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        lahirTotal = row["LahirLakiLakiDisdukcapil"] + row["LahirPerempuanDisdukcapil"]
        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "LahirLakiLakiDisdukcapil": str(to_indo_number_without_comma(row["LahirLakiLakiDisdukcapil"])),
            "LahirPerempuanDisdukcapil": str(to_indo_number_without_comma(row["LahirPerempuanDisdukcapil"])),
            "LahirTotalDisdukcapil": str(to_indo_number_without_comma(lahirTotal))
        })

    return result

def build_tabel3_1_8(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        matiTotal = row["matiLakiLakiDisdukcapil"] + row["matiPerempuanDisdukcapil"]
        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "matiLakiLakiDisdukcapil": str(to_indo_number_without_comma(row["matiLakiLakiDisdukcapil"])),
            "matiPerempuanDisdukcapil": str(to_indo_number_without_comma(row["matiPerempuanDisdukcapil"])),
            "matiTotalDisdukcapil": str(to_indo_number_without_comma(matiTotal))
        })

    return result

def build_tabel3_1_9(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        datangTotal = row["DatangLakiLakiDisdukcapil"] + row["DatangPerempuanDisdukcapil"]
        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "DatangLakiLakiDisdukcapil": str(to_indo_number_without_comma(row["DatangLakiLakiDisdukcapil"])),
            "DatangPerempuanDisdukcapil": str(to_indo_number_without_comma(row["DatangPerempuanDisdukcapil"])),
            "DatangTotalDisdukcapil": str(to_indo_number_without_comma(datangTotal))
        })

    return result

def build_tabel3_1_10(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        keluarTotal = row["KeluarLakiLakiDisdukcapil"] + row["KeluarPerempuanDisdukcapil"]
        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "KeluarLakiLakiDisdukcapil": str(to_indo_number_without_comma(row["KeluarLakiLakiDisdukcapil"])),
            "KeluarPerempuanDisdukcapil": str(to_indo_number_without_comma(row["KeluarPerempuanDisdukcapil"])),
            "KeluarTotalDisdukcapil": str(to_indo_number_without_comma(keluarTotal))
        })

    return result

def build_tabel4_1_2(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "jumlah Sekolah"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        total2025 = row["jumlahNegeriTahun2025"] + row["jumlahSwastaTahun2025"]
        total2026 = row["jumlahNegeriTahun2026"] + row["jumlahSwastaTahun2026"]

        result.append({
            "tingkatPendidikan": str(row["tingkatPendidikan"]),
            "jumlahNegeriTahun2025": str(to_indo_number_without_comma(row["jumlahNegeriTahun2025"])),
            "jumlahNegeriTahun2026": str(to_indo_number_without_comma(row["jumlahNegeriTahun2026"])),
            "blank1": "",
            "jumlahSwastaTahun2025": str(to_indo_number_without_comma(row["jumlahSwastaTahun2025"])),
            "jumlahSwastaTahun2026": str(to_indo_number_without_comma(row["jumlahSwastaTahun2026"])),
            "blank2": "",
            "jumlahTahun2025": str(to_indo_number_without_comma(total2025)),
            "jumlahTahun2026": str(to_indo_number_without_comma(total2026)),
        })

    return result

def build_tabel4_1_3(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "jumlah guru"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        total2025 = row["jumlahNegeriTahun2025"] + row["jumlahSwastaTahun2025"]
        total2026 = row["jumlahNegeriTahun2026"] + row["jumlahSwastaTahun2026"]

        result.append({
            "tingkatPendidikan": str(row["tingkatPendidikan"]),
            "jumlahNegeriTahun2025": str(to_indo_number_without_comma(row["jumlahNegeriTahun2025"])),
            "jumlahNegeriTahun2026": str(to_indo_number_without_comma(row["jumlahNegeriTahun2026"])),
            "blank1": "",
            "jumlahSwastaTahun2025": str(to_indo_number_without_comma(row["jumlahSwastaTahun2025"])),
            "jumlahSwastaTahun2026": str(to_indo_number_without_comma(row["jumlahSwastaTahun2026"])),
            "blank2": "",
            "jumlahTahun2025": str(to_indo_number_without_comma(total2025)),
            "jumlahTahun2026": str(to_indo_number_without_comma(total2026)),
        })

    return result

def build_tabel4_1_4(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "jumlah murid"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():
        total2025 = row["jumlahNegeriTahun2025"] + row["jumlahSwastaTahun2025"]
        total2026 = row["jumlahNegeriTahun2026"] + row["jumlahSwastaTahun2026"]

        result.append({
            "tingkatPendidikan": str(row["tingkatPendidikan"]),
            "jumlahNegeriTahun2025": str(to_indo_number_without_comma(row["jumlahNegeriTahun2025"])),
            "jumlahNegeriTahun2026": str(to_indo_number_without_comma(row["jumlahNegeriTahun2026"])),
            "blank1": "",
            "jumlahSwastaTahun2025": str(to_indo_number_without_comma(row["jumlahSwastaTahun2025"])),
            "jumlahSwastaTahun2026": str(to_indo_number_without_comma(row["jumlahSwastaTahun2026"])),
            "blank2": "",
            "jumlahTahun2025": str(to_indo_number_without_comma(total2025)),
            "jumlahTahun2026": str(to_indo_number_without_comma(total2026)),
        })

    return result

def build_tabel4_2_4(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataKesehatan[dataKesehatan["type"] == "dataFaskesNakes"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "jumlahRumahSakitUmumKabupatenSanggau": str(to_indo_number_without_comma(row["jumlahRumahSakitUmumKabupatenSanggau"])),
            "jumlahRumahSakitBersalinKabupatenSanggau": str(to_indo_number_without_comma(row["jumlahRumahSakitBersalinKabupatenSanggau"])),
            "jumlahRumahBersalinPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahRumahBersalinPerDesaKelurahan"])),
        })

    return result

def build_tabel4_2_4v2(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataKesehatan[dataKesehatan["type"] == "dataFaskesNakes"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "jumlahPuskesmasRawatInapPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahPuskesmasRawatInapPerDesaKelurahan"])),
            "jumlahPuskesmasTanpaRawatInapPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahPuskesmasTanpaRawatInapPerDesaKelurahan"])),
            "jumlahPoliklinikBalaiPengobatanPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahPoliklinikBalaiPengobatanPerDesaKelurahan"])),
        })

    return result

def build_tabel4_2_4v3(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataKesehatan[dataKesehatan["type"] == "dataFaskesNakes"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "jumlahPuskesmasPembantuPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahPuskesmasPembantuPerDesaKelurahan"])),
            "jumlahTempatPraktekDokterPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahTempatPraktekDokterPerDesaKelurahan"])),
            "jumlahTempatPraktekBidanPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahTempatPraktekBidanPerDesaKelurahan"])),
        })

    return result

def build_tabel4_2_4v4(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataKesehatan[dataKesehatan["type"] == "dataFaskesNakes"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "jumlahPoskesdesPolindesPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahPoskesdesPolindesPerDesaKelurahan"])),
            "jumlahApotekPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahApotekPerDesaKelurahan"])),
            "jumlahTokoObatJamuPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahTokoObatJamuPerDesaKelurahan"])),
        })

    return result

def build_tabel4_2_4v5(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataKesehatan[dataKesehatan["type"] == "dataFaskesNakes"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "jumlahDokterUmum": str(to_indo_number_without_comma(row["jumlahPosyanduAktifPerDesaKelurahan"])),
            "jumlahPosPembinaanTerpaduPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahPosPembinaanTerpaduPerDesaKelurahan"])),
        })

    return result

def build_tabel4_2_5(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataKesehatan[dataKesehatan["type"] == "dataFaskesNakes"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "jumlahDokterUmum": str(to_indo_number_without_comma(row["jumlahDokterUmum"])),
            "jumlahDokterSpesialis": str(to_indo_number_without_comma(row["jumlahDokterSpesialis"])),
            "jumlahDokterGigi": str(to_indo_number_without_comma(row["jumlahDokterGigi"])),
        })

    return result

def build_tabel4_2_5v2(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataKesehatan[dataKesehatan["type"] == "dataFaskesNakes"]
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "jumlahPerawatPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahPerawatPerDesaKelurahan"])),
            "jumlahBidanPerDesaKelurahan": str(to_indo_number_without_comma(row["jumlahBidanPerDesaKelurahan"])),
            "jumlahTenagaMedisLainnya": str(to_indo_number_without_comma(row["jumlahTenagaMedisLainnya"])),
        })

    return result

def build_tabel4_4_5(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "nikah": str("..."),
            "CeraiPA": str(to_indo_number_without_comma(row["CeraiPA"])),
            "TalakPA": str(to_indo_number_without_comma(row["TalakPA"])),
            "rujuk": str("..."),
        })

    return result

def build_tabel4_4_6(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "dataPolres"]
    # bulan	perkosaan	perzinahan	penculikan	penganiayaan	pemerasan
    for _, row in dataHasil.iterrows():

        result.append({
            "bulan": str(row["bulan"]),
            "perkosaan": str(to_indo_number_without_comma(row["perkosaan"])),
            "perzinahan": str(to_indo_number_without_comma(row["perzinahan"])),
            "penculikan": str(to_indo_number_without_comma(row["penculikan"])),
            "penganiayaan": str(to_indo_number_without_comma(row["penganiayaan"])),
            "pemerasan": str(to_indo_number_without_comma(row["pemerasan"])),
        })

    # tambah baris jumlah
    result.append({
        "bulan": "Jumlah",
        "perkosaan": str(to_indo_number_without_comma(dataHasil["perkosaan"].sum())),
        "perzinahan": str(to_indo_number_without_comma(dataHasil["perzinahan"].sum())),
        "penculikan": str(to_indo_number_without_comma(dataHasil["penculikan"].sum())),
        "penganiayaan": str(to_indo_number_without_comma(dataHasil["penganiayaan"].sum())),
        "pemerasan": str(to_indo_number_without_comma(dataHasil["pemerasan"].sum())),
    })

    return result

def build_tabel4_4_6v2(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "dataPolres"]
    # perampokan	penodongan	pembunuhan	lainnyaTerhadapJiwa	jumlahKejahatanTerhadapJiwa
    for _, row in dataHasil.iterrows():

        result.append({
            "bulan": str(row["bulan"]),
            "perampokan": str(to_indo_number_without_comma(row["perampokan"])),
            "penodongan": str(to_indo_number_without_comma(row["penodongan"])),
            "pembunuhan": str(to_indo_number_without_comma(row["pembunuhan"])),
            "lainnyaTerhadapJiwa": str(to_indo_number_without_comma(row["lainnyaTerhadapJiwa"])),
            "jumlahKejahatanTerhadapJiwa": str(to_indo_number_without_comma(row["jumlahKejahatanTerhadapJiwa"])),
        })

    # tambah baris jumlah
    result.append({
        "bulan": "Jumlah",
        "perampokan": str(to_indo_number_without_comma(dataHasil["perampokan"].sum())),
        "penodongan": str(to_indo_number_without_comma(dataHasil["penodongan"].sum())),
        "pembunuhan": str(to_indo_number_without_comma(dataHasil["pembunuhan"].sum())),
        "lainnyaTerhadapJiwa": str(to_indo_number_without_comma(dataHasil["lainnyaTerhadapJiwa"].sum())),
        "jumlahKejahatanTerhadapJiwa": str(to_indo_number_without_comma(dataHasil["jumlahKejahatanTerhadapJiwa"].sum())),
    })

    return result

def build_tabel4_4_7(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "dataPolres"]
    # hasilBumi	ternak	ranmor	ringan dan pemberatan	pembakaran
    for _, row in dataHasil.iterrows():

        result.append({
            "bulan": str(row["bulan"]),
            "hasilBumi": str(to_indo_number_without_comma(row["hasilBumi"])),
            "ternak": str(to_indo_number_without_comma(row["ternak"])),
            "ranmor": str(to_indo_number_without_comma(row["ranmor"])),
            "ringan dan pemberatan": str(to_indo_number_without_comma(row["ringan dan pemberatan"])),
            "pembakaran": str(to_indo_number_without_comma(row["pembakaran"])),
        })

    # tambah baris jumlah
    result.append({
        "bulan": "Jumlah",
        "hasilBumi": str(to_indo_number_without_comma(dataHasil["hasilBumi"].sum())),
        "ternak": str(to_indo_number_without_comma(dataHasil["ternak"].sum())),
        "ranmor": str(to_indo_number_without_comma(dataHasil["ranmor"].sum())),
        "ringan dan pemberatan": str(to_indo_number_without_comma(dataHasil["ringan dan pemberatan"].sum())),
        "pembakaran": str(to_indo_number_without_comma(dataHasil["pembakaran"].sum())),
    })

    return result

def build_tabel4_4_7v2(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "dataPolres"]
    # penggelapan	pengrusakan	lainnyaTerhadapHartaBenda	jumlahTerhadapHartaBenda
    for _, row in dataHasil.iterrows():

        result.append({
            "bulan": str(row["bulan"]),
            "penggelapan": str(to_indo_number_without_comma(row["penggelapan"])),
            "pengrusakan": str(to_indo_number_without_comma(row["pengrusakan"])),
            "lainnyaTerhadapHartaBenda": str(to_indo_number_without_comma(row["lainnyaTerhadapHartaBenda"])),
            "jumlahTerhadapHartaBenda": str(to_indo_number_without_comma(row["jumlahTerhadapHartaBenda"])),
        })

    # tambah baris jumlah
    result.append({
        "bulan": "Jumlah",
        "penggelapan": str(to_indo_number_without_comma(dataHasil["penggelapan"].sum())),
        "pengrusakan": str(to_indo_number_without_comma(dataHasil["pengrusakan"].sum())),
        "lainnyaTerhadapHartaBenda": str(to_indo_number_without_comma(dataHasil["lainnyaTerhadapHartaBenda"].sum())),
        "jumlahTerhadapHartaBenda": str(to_indo_number_without_comma(dataHasil["jumlahTerhadapHartaBenda"].sum())),
    })

    return result

def build_tabel4_4_8(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataMerge[dataMerge["kategori"] == "dataPolres"]
    # jumlahKorbanMeninggal	jumlahLukaBerat	jumlahLukaRingan	kerugianMaterial
    for _, row in dataHasil.iterrows():

        result.append({
            "bulan": str(row["bulan"]),
            "jumlahKorbanMeninggal": str(to_indo_number_without_comma(row["jumlahKorbanMeninggal"])),
            "jumlahLukaBerat": str(to_indo_number_without_comma(row["jumlahLukaBerat"])),
            "jumlahLukaRingan": str(to_indo_number_without_comma(row["jumlahLukaRingan"])),
            "kerugianMaterial": str(to_indo_number_without_comma(row["kerugianMaterial"])),
        })

    # tambah baris jumlah
    result.append({
        "bulan": "Jumlah",
        "jumlahKorbanMeninggal": str(to_indo_number_without_comma(dataHasil["jumlahKorbanMeninggal"].sum())),
        "jumlahLukaBerat": str(to_indo_number_without_comma(dataHasil["jumlahLukaBerat"].sum())),
        "jumlahLukaRingan": str(to_indo_number_without_comma(dataHasil["jumlahLukaRingan"].sum())),
        "kerugianMaterial": str(to_indo_number_without_comma(dataHasil["kerugianMaterial"].sum())),
    })

    return result

def build_tabel4_4_9(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "namaBhabinkamtibnas": str(row["namaBhabinkamtibnas"]),
        })

    return result

def build_tabel4_4_10(group, dataDesa, dataKesehatan, dataMerge):
    result = []
    
    dataHasil = dataDesa
    # wniDisdukcapil	wnaDisdukcapil
    for _, row in dataHasil.iterrows():

        result.append({
            "kodeDesa": str(row["kodeDesa"]),
            "namaDesa": str(row["namaDesa"]),
            "namaBabinsa": str(row["namaBabinsa"]),
        })

    return result

TABLE_BUILDERS = {
    "tabel1_1_1": build_tabel1_1_1,
    "tabel1_1_2": build_tabel1_1_2,
    "tabel2_2_2": build_tabel2_2_2,
    "tabel2_2_3": build_tabel2_2_3,
    "tabel2_2_8": build_tabel2_2_8,
    "tabel2_2_9": build_tabel2_2_9,
    "tabel3_1_3": build_tabel3_1_3,
    "tabel3_1_4": build_tabel3_1_4,
    "tabel3_1_5": build_tabel3_1_5,
    "tabel3_1_6": build_tabel3_1_6,
    "tabel3_1_6v2": build_tabel3_1_6v2,
    "tabel3_1_7": build_tabel3_1_7,
    "tabel3_1_8": build_tabel3_1_8,
    "tabel3_1_9": build_tabel3_1_9,
    "tabel3_1_10": build_tabel3_1_10,
    "tabel4_1_2": build_tabel4_1_2,
    "tabel4_1_3": build_tabel4_1_3,
    "tabel4_1_4": build_tabel4_1_4,
}