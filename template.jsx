//target "InDesign"

var doc = app.activeDocument;

const keys = [
  "namaKecamatan", "namaKec_Kapital", "nomorVolume", "nomorKatalog",
  "nomorPublikasi", "namaPenyunting", "namaPenulis", "namaLayouter",
  "namaPenerjemah", "namaPemeriksa", "tabel222lakiLaki", "tabel222perempuan", "tabel222total", "tabel223lakiLaki", "tabel223perempuan", "tabel223total", "tabel228lakiLaki", "tabel228perempuan", "tabel228total", "tabel229lakiLaki", "tabel229perempuan", "tabel229total", "dataDesaCeraiPA", "dataDesaTalakPA", "dataDesaalokasiDanaDesa", "dataDesadanaDesa", "dataDesaLahirLakiLakiDisdukcapil", "dataDesaLahirPerempuanDisdukcapil", "dataDesamatiLakiLakiDisdukcapil", "dataDesamatiPerempuanDisdukcapil", "dataDesaDatangLakiLakiDisdukcapil", "dataDesaDatangPerempuanDisdukcapil", "dataDesaKeluarLakiLakiDisdukcapil", "dataDesaKeluarPerempuanDisdukcapil", "dataDesawniDisdukcapil", "dataDesawnaDisdukcapil", "dataDesapendudukLakiLakiDisdukcapil", "dataDesapendudukPerempuanDisdukcapil", "dataDesapendudukJumlahDisdukcapil", "dataDesawajibKtpDisdukcapil", "dataDesamemilikiKtpDisdukcapil", "dataDesabelumMemilikiKtpDisdukcapil", "dataDesapersentaseMemilikiKtpDisdukcapil", "dataDesawajibKkDisdukcapil", "dataDesamemilikiKkDisdukcapil", "dataDesabelumMemilikiKkDisdukcapil", "dataDesaislamDisdukcapil", "dataDesakristenDisdukcapil", "dataDesakatholikDisdukcapil", "dataDesahinduDisdukcapil", "dataDesabuddhaDisdukcapil", "dataDesakhonghucuDisdukcapil", "dataDesaagamaLainnyaDisdukcapil", "dataDesaluasWilayahDesa", "dataDesapersentaseLuasWilayahDesa"
];

const data = keys.reduce((acc, key) => {
  acc[key] = `{${key}}`;
  return acc;
}, {});

var tabel1_1_1 = {tabel1_1_1};
var tabel1_1_2 = {tabel1_1_2};
var tabel2_2_2 = {tabel2_2_2};
var tabel2_2_3 = {tabel2_2_3};
var tabel2_2_8 = {tabel2_2_8};
var tabel2_2_9 = {tabel2_2_9};
var tabel3_1_3 = {tabel3_1_3};
var tabel3_1_4 = {tabel3_1_4};
var tabel3_1_5 = {tabel3_1_5};

// ... tambahkan tabel lain jika perlu

app.findTextPreferences = NothingEnum.nothing;
app.changeTextPreferences = NothingEnum.nothing;

for (var key in data) {
    app.findTextPreferences.findWhat = "{{" + key + "}}";
    app.changeTextPreferences.changeTo = data[key];
    doc.changeText();
}

function isiTabel(placeholder, dataArr, colMap) {

    // reset tiap call (WAJIB)
    app.findTextPreferences = NothingEnum.nothing;
    app.changeTextPreferences = NothingEnum.nothing;

    app.findTextPreferences.findWhat = "{{" + placeholder + "}}";
    var found = doc.findText();

    if (found.length === 0) {
        alert("Placeholder " + placeholder + " tidak ditemukan");
        return;
    }

    // HANDLE DATA KOSONG
    if (!dataArr || dataArr.length === 0) {
        alert("Data kosong untuk " + placeholder);
        return;
    }

    try {
        var insertion = found[0].insertionPoints[0];
        var cell = insertion.parent;

        while (cell.constructor.name !== "Cell") {
            cell = cell.parent;
        }

        var row = cell.parentRow;
        var table = row.parent;
        var rowIndex = row.index;

        // hapus placeholder awal
        row.cells[0].contents = "";

        for (var c = 0; c < colMap.length; c++) {
            row.cells[c].contents = dataArr[0][colMap[c]];
        }

        for (var i = 1; i < dataArr.length; i++) {

            var newRow = table.rows.add(
                LocationOptions.AFTER,
                table.rows[rowIndex + i - 1]
            );

            // copy style saja
            newRow.contents = row.contents;

            for (var c = 0; c < colMap.length; c++) {
                newRow.cells[c].contents = dataArr[i][colMap[c]];
            }
        }

    } catch (e) {
        alert("Error " + placeholder + ": " + e);
    }
}

isiTabel("Tabel1_1_1", tabel1_1_1, ["namaDesa","luasWilayahDesa","persentaseLuasWilayahDesa"]);
isiTabel("Tabel1_1_2", tabel1_1_2, ["desa","jarak_kec","jarak_kab"]);
isiTabel("tabel2_2_2", tabel2_2_2, ["tingkatPendidikan","lakiLaki","perempuan","total"]);
isiTabel("tabel2_2_3", tabel2_2_3, ["tingkatPendidikan","lakiLaki","perempuan","total"]);
isiTabel("tabel2_2_8", tabel2_2_8, ["tingkatPendidikan","lakiLaki","perempuan","total"]);
isiTabel("tabel2_2_9", tabel2_2_9, ["tingkatPendidikan","lakiLaki","perempuan","total"]);
isiTabel("tabel3_1_3", tabel3_1_3, ["kodeDesa","namaDesa","wajibKtpDisdukcapil","memilikiKtpDisdukcapil","belumMemilikiKtpDisdukcapil"]);
isiTabel("tabel3_1_4", tabel3_1_4, ["kodeDesa","namaDesa","wajibKkDisdukcapil","memilikiKkDisdukcapil","belumMemilikiKkDisdukcapil"]);
isiTabel("tabel3_1_5", tabel3_1_5, ["kodeDesa","namaDesa","wniDisdukcapil","wnaDisdukcapil"]);
// ... panggil isiTabel untuk tabel lain jika perlu

alert("{namaKecamatan} Selesai!");