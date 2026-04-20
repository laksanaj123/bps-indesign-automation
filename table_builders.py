def build_tabel1_1(group):
    total_luas = group["luasWilayahDesa"].sum()

    rows = []
    total_persen = 0

    for _, row in group.iterrows():
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

def build_tabel1_2(group):
    result = []

    for _, row in group.iterrows():
        result.append({
            "desa": row["namaDesa"],
            "jarak_kec": str(row["jarakKecamatan"]).replace(".", ","),
            "jarak_kab": str(row["jarakKantorBupati"]).replace(".", ",")
        })

    return result

TABLE_BUILDERS = {
    "tabel1_1": build_tabel1_1,
    "tabel1_2": build_tabel1_2,
}