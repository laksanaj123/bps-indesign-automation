import pandas as pd
import os
import shutil

from table_services import inject_tables
from metadata_services import build_metadata

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

TEMPLATE_FOLDER = r"G:\My Drive\IPDS 2026\01 Publikasi\02 KCDA\Draf Edit Publikasi\[Fix] Template KCDA 2026"
TARGET_BASE = r"G:\My Drive\IPDS 2026\01 Publikasi\02 KCDA\Draf Edit Publikasi"

urlDataCamat = "https://docs.google.com/spreadsheets/d/1Af1w1gRUrdC_jCnVJC6B_0jNyv5kkRJJuGxU79849u8/export?format=csv&gid=1534607447"
dfDataCamat = pd.read_csv(urlDataCamat)

urlDataDesa = "https://docs.google.com/spreadsheets/d/1Af1w1gRUrdC_jCnVJC6B_0jNyv5kkRJJuGxU79849u8/export?format=csv&gid=0"
dfDataDesa = pd.read_csv(urlDataDesa)

urlDataKesehatan = "https://docs.google.com/spreadsheets/d/1Af1w1gRUrdC_jCnVJC6B_0jNyv5kkRJJuGxU79849u8/export?format=csv&gid=745448590"
dfDataKesehatan = pd.read_csv(urlDataKesehatan)

urlDataMerge = "https://docs.google.com/spreadsheets/d/1Af1w1gRUrdC_jCnVJC6B_0jNyv5kkRJJuGxU79849u8/export?format=csv&gid=772750983"
dfDataMerge = pd.read_csv(urlDataMerge)

grouped = dfDataCamat.groupby("namaKecamatan")

with open(os.path.join(SCRIPT_DIR, "template.jsx"), "r", encoding="utf-8") as f:
    template = f.read()

jsx_folder = os.path.join(SCRIPT_DIR, "generate_jsx")
os.makedirs(jsx_folder, exist_ok=True)

print(f"📂 Template : {TEMPLATE_FOLDER}")
print(f"📂 Target   : {TARGET_BASE}")
print(f"📊 Kecamatan: {len(grouped)}")
print()

for nama_kecamatan, group in grouped:
    dataDesa = dfDataDesa[dfDataDesa["namaKecamatan"] == nama_kecamatan].sort_values(
        by=['statusDesKel', 'kodeDesa'], ascending=[False, True])
    dataKesehatan = dfDataKesehatan[dfDataKesehatan["namaKecamatan"] == nama_kecamatan].sort_values(by='kodeDesa')
    dataMerge = dfDataMerge[dfDataMerge["namaKecamatan"] == nama_kecamatan]

    first = group.iloc[0]
    metadata = build_metadata(nama_kecamatan, first, group, dataDesa, dataKesehatan, dataMerge)

    script = template
    for key, value in metadata.items():
        script = script.replace(f"{{{key}}}", str(value))
    script = inject_tables(script, group, dataDesa, dataKesehatan, dataMerge)

    dest_folder = os.path.join(TARGET_BASE, nama_kecamatan)

    if os.path.exists(dest_folder):
        print(f"⏭  {nama_kecamatan} sudah ada, skip copy.")
    else:
        shutil.copytree(TEMPLATE_FOLDER, dest_folder)
        print(f"📁 {nama_kecamatan} folder disalin.")

    jsx_dest = os.path.join(dest_folder, f"Isi Data {nama_kecamatan}.jsx")
    with open(jsx_dest, "w", encoding="utf-8") as f:
        f.write(script)
    print(f"📝 {nama_kecamatan} JSX disimpan.")

# --- Generate master runner JSX untuk InDesign ---
runner_lines = [
    '//target InDesign',
    '// Master runner: buka semua .indd di tiap folder kecamatan, jalankan JSX, simpan, tutup.',
    '',
    'var targetBase = new Folder("' + TARGET_BASE.replace("\\", "\\\\") + '");',
    'var kecamatanFolders = targetBase.getFiles(function(f) { return f instanceof Folder && f.name !== "[Fix] Template KCDA 2026"; });',
    '',
    'var log = [];',
    '',
    'for (var k = 0; k < kecamatanFolders.length; k++) {',
    '    var kFolder = kecamatanFolders[k];',
    '    var namaKec = kFolder.name;',
    '',
    '    // cari JSX di folder ini',
    '    var jsxFiles = kFolder.getFiles(function(f) { return f instanceof File && f.name.indexOf("Isi Data") === 0 && f.name.endsWith(".jsx"); });',
    '    if (jsxFiles.length === 0) { log.push("SKIP " + namaKec + ": JSX tidak ditemukan"); continue; }',
    '    var jsxFile = jsxFiles[0];',
    '',
    '    // cari semua .indd',
    '    var inddFiles = kFolder.getFiles(function(f) { return f instanceof File && f.name.endsWith(".indd"); });',
    '    if (inddFiles.length === 0) { log.push("SKIP " + namaKec + ": .indd tidak ditemukan"); continue; }',
    '',
    '    for (var i = 0; i < inddFiles.length; i++) {',
    '        try {',
    '            var doc = app.open(inddFiles[i]);',
    '            app.doScript(jsxFile, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.FAST_ENTIRE_SCRIPT);',
    '            doc.save();',
    '            doc.close();',
    '            log.push("OK " + namaKec + " / " + inddFiles[i].name);',
    '        } catch (e) {',
    '            log.push("ERR " + namaKec + " / " + inddFiles[i].name + ": " + e);',
    '        }',
    '    }',
    '}',
    '',
    'alert("Selesai!\\n\\n" + log.join("\\n"));',
]

runner_path = os.path.join(TARGET_BASE, "_RUN_ALL.jsx")
with open(runner_path, "w", encoding="utf-8") as f:
    f.write("\n".join(runner_lines))

print(f" runner JSX → {runner_path}")
print()
print("✅ Selesai!")
print(f"   1. Buka Adobe InDesign")
print(f"   2. Window → Utilities → Scripts")
print(f"   3. Klik kanan → Reveal in Explorer → copy _RUN_ALL.jsx ke folder Scripts")
print(f"   4. Jalankan _RUN_ALL.jsx → otomatis proses semua kecamatan")
