import pandas as pd
import numpy as np
import os
import requests
from io import StringIO
import json

from table_services import inject_tables
from metadata_services import build_metadata

url = "https://docs.google.com/spreadsheets/d/1UD76pvPEv7q4Fe0o83V3vulwzboGg3fm06YtbMYaUFQ/export?format=csv&gid=903602598"

response = requests.get(url)

if response.status_code != 200:
    raise Exception("Gagal akses spreadsheet. Cek permission / gid.")

csv_data = StringIO(response.text)

df = pd.read_csv(csv_data, encoding='utf-8')
df.head()

df["namaPenyunting_joint"] = df["namaPenyunting"].str.replace(", ", " • ")
df["namaPenulis_joint"] = df["namaPenulis"].str.replace(", ", " • ")
df["namaLayouter_joint"] = df["namaLayouter"].str.replace(", ", " • ")
df["namaInfografis_joint"] = df["namaInfografis"].str.replace(", ", " • ")
df["namaPenerjemah_joint"] = df["namaPenerjemah"].str.replace(", ", " • ")

df.head()

url = "https://docs.google.com/spreadsheets/d/14br7OEiGZJKN_NBUKmDpnWO2P9CsXlruk__m1O29brg/export?format=csv&gid=583286261"

response = requests.get(url)

if response.status_code != 200:
    raise Exception("Gagal akses spreadsheet. Cek permission / gid.")

csv_data = StringIO(response.text)

data_kcda2026 = pd.read_csv(csv_data, encoding='utf-8')
data_kcda2026.head()

data_kcda2026.info()

# grouping desa per kecamatan
grouped = data_kcda2026.groupby("namaKecamatan")

with open("template_new.jsx", "r", encoding="utf-8") as f:
    template = f.read()

output_folder = "generate_jsx"
os.makedirs(output_folder, exist_ok=True)

for nama_kecamatan, group in grouped:

    script = template  # copy template
    first = group.iloc[0]

    metadata = build_metadata(nama_kecamatan, first)

    for key, value in metadata.items():
        script = script.replace(f"{{{key}}}", str(value))

    script = inject_tables(script, group)

    filename = f"{nama_kecamatan}.jsx"
    filepath = os.path.join(output_folder, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(script)

print("✅ Semua Script Kecamatan berhasil dibuat!")