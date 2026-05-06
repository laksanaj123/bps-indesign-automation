def build_metadata(nama_kecamatan, first_row):
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
        "namaPemeriksa": first_row.get("namaPemeriksa", "")
    }