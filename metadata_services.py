def build_metadata(nama_kecamatan, first_row):
    return {
        "namaKecamatan": nama_kecamatan,
        "namaKec_Kapital": first_row.get("namaKec_Kapital", ""),
        "nomorVolume": first_row.get("nomorVolume", ""),
        "nomorKatalog": first_row.get("nomorKatalog", ""),
        "nomorPublikasi": first_row.get("nomorPublikasi", ""),
        "jumlahHalaman": first_row.get("jumlahHalaman", ""),
        "sumberIlustrasi": first_row.get("sumberIlustrasi", ""),
        "namaPenyunting": first_row.get("namaPenyunting_joint", ""),
        "namaPenulis": first_row.get("namaPenulis_joint", ""),
        "namaLayouter": first_row.get("namaLayouter_joint", ""),
        "namaInfografis": first_row.get("namaInfografis_joint", ""),
        "namaPenerjemah": first_row.get("namaPenerjemah_joint", "")
    }