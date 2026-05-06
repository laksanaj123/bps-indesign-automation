import pandas as pd
import numpy as np
import os
import requests
from io import StringIO

from table_services import inject_tables
from metadata_services import build_metadata

urlDataCamat = "https://docs.google.com/spreadsheets/d/1Af1w1gRUrdC_jCnVJC6B_0jNyv5kkRJJuGxU79849u8/export?format=csv&gid=1534607447"
dfDataCamat = pd.read_csv(urlDataCamat)

urlDataDesa = "https://docs.google.com/spreadsheets/d/1Af1w1gRUrdC_jCnVJC6B_0jNyv5kkRJJuGxU79849u8/export?format=csv&gid=0"
dfDataDesa = pd.read_csv(urlDataDesa)

urlDataKesehatan = "https://docs.google.com/spreadsheets/d/1Af1w1gRUrdC_jCnVJC6B_0jNyv5kkRJJuGxU79849u8/export?format=csv&gid=745448590"
dfDataKesehatan = pd.read_csv(urlDataKesehatan)

urlDataMerge = "https://docs.google.com/spreadsheets/d/1Af1w1gRUrdC_jCnVJC6B_0jNyv5kkRJJuGxU79849u8/export?format=csv&gid=772750983"
dfDataMerge = pd.read_csv(urlDataMerge)

# grouping desa per kecamatan
grouped = dfDataCamat.groupby("namaKecamatan")

with open("template.jsx", "r", encoding="utf-8") as f:
    template = f.read()

output_folder = "generate_jsx"
os.makedirs(output_folder, exist_ok=True)

for nama_kecamatan, group in grouped:
    # Filter Data desa
    dataDesa = dfDataDesa[dfDataDesa["namaKecamatan"] == nama_kecamatan].sort_values(by='kodeDesa')
    dataKesehatan = dfDataKesehatan[dfDataKesehatan["namaKecamatan"] == nama_kecamatan].sort_values(by='kodeDesa')
    dataMerge = dfDataMerge[dfDataMerge["namaKecamatan"] == nama_kecamatan]
    # print(nama_kecamatan)
    script = template  # copy template
    first = group.iloc[0]

    metadata = build_metadata(nama_kecamatan, first, group, dataDesa, dataKesehatan, dataMerge)
    # print(metadata)

    for key, value in metadata.items():
        script = script.replace(f"{{{key}}}", str(value))
        
    # print(dataMerge)
    script = inject_tables(script, group, dataDesa, dataKesehatan, dataMerge)

    filename = f"{nama_kecamatan}.jsx"
    filepath = os.path.join(output_folder, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(script)

print("✅ Semua Script Kecamatan berhasil dibuat!")