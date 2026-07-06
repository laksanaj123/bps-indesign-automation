from table_builders import to_indo_number, to_indo_number_without_comma, zero_to_endash

def build_metadata(nama_kecamatan, first_row, group, dataDesa, dataKesehatan, dataMerge):
    namaKec_Kapital = nama_kecamatan.upper()
    return {
        "namaKecamatan": nama_kecamatan,
        "namaKec_Kapital": namaKec_Kapital,
        "nomorVolume": first_row.get("nomorVolume", ""),
        "nomorKatalog": first_row.get("katalog", ""),
        "nomorPublikasi": first_row.get("noPublikasi", ""),
        "namaPenyunting": first_row.get("namaPembuatPublikasi", ""),
        "namaPenulis": first_row.get("namaPembuatPublikasi", ""),
        "namaLayouter": first_row.get("namaPembuatPublikasi", ""),
        "namaPenerjemah": first_row.get("namaPembuatPublikasi", ""),
        "namaPemeriksa": first_row.get("namaPemeriksa", ""),
        **{
                f'tabel222{col}': to_indo_number_without_comma(str(dataMerge[dataMerge['kategori'] == "jumlahPnsBerdasarkanTingkatPendidikan"][col].sum()))
                for col in [
                    "lakiLaki", "perempuan", "total"
                ]
            },
        **{
                f'tabel223{col}': to_indo_number_without_comma(str(dataMerge[dataMerge['kategori'] == "jumlahPppkBerdasarkanTingkatPendidikan"][col].sum()))
                for col in [
                    "lakiLaki", "perempuan", "total"
                ]
            },
        **{
                f'tabel228{col}': to_indo_number_without_comma(str(dataMerge[dataMerge['kategori'] == "jumlahPnsBerdasarkanGolongan"][col].sum()))
                for col in [
                    "lakiLaki", "perempuan", "total"
                ]
            },
        **{
                f'tabel229{col}': to_indo_number_without_comma(str(dataMerge[dataMerge['kategori'] == "jumlahPppkBerdasarkanGolongan"][col].sum()))
                for col in [
                    "lakiLaki", "perempuan", "total"
                ]
            },
        **{
                f'dataDesa{col}': to_indo_number_without_comma(str(dataDesa[col].sum()))
                for col in [
                    "CeraiPA", "TalakPA", "alokasiDanaDesa", "danaDesa", "LahirLakiLakiDisdukcapil", "LahirPerempuanDisdukcapil", "matiLakiLakiDisdukcapil", "matiPerempuanDisdukcapil", "DatangLakiLakiDisdukcapil", "DatangPerempuanDisdukcapil", "KeluarLakiLakiDisdukcapil", "KeluarPerempuanDisdukcapil", "wniDisdukcapil", "wnaDisdukcapil", "pendudukLakiLakiDisdukcapil", "pendudukPerempuanDisdukcapil", "pendudukJumlahDisdukcapil", "wajibKtpDisdukcapil", "memilikiKtpDisdukcapil", "belumMemilikiKtpDisdukcapil", "persentaseMemilikiKtpDisdukcapil", "wajibKkDisdukcapil", "memilikiKkDisdukcapil", "belumMemilikiKkDisdukcapil", "islamDisdukcapil", "kristenDisdukcapil", "katholikDisdukcapil", "hinduDisdukcapil", "buddhaDisdukcapil", "khonghucuDisdukcapil", "agamaLainnyaDisdukcapil"
                ]
            },
        **{
                f'dataDesa{col}': to_indo_number(f"{dataDesa[col].sum():.2f}")
                    for col in ["luasWilayahDesa", "persentaseLuasWilayahDesa"]
            },
    }