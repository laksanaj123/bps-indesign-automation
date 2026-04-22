//target "InDesign"

var doc = app.activeDocument;

// ==========================
// DATA DARI PYTHON
// ==========================
var data = {
    namaKecamatan: "Jangkang",
    namaKec_Kapital: "",
    nomorVolume: "",
    nomorKatalog: "",
    nomorPublikasi: "",
    jumlahHalaman: "",
    sumberIlustrasi: "",
    namaPenyunting: "",
    namaPenulis: "",
    namaLayouter: "",
    namaInfografis: "",
    namaPenerjemah: ""
};

var tabel1_1 = [{"desa": "Terati", "luas": "83,86", "persen": "5,28"}, {"desa": "Selampung", "luas": "130,30", "persen": "8,20"}, {"desa": "Sape", "luas": "199,32", "persen": "12,54"}, {"desa": "Semirau", "luas": "130,01", "persen": "8,18"}, {"desa": "Balai Sebut", "luas": "87,27", "persen": "5,49"}, {"desa": "Semombat", "luas": "81,73", "persen": "5,14"}, {"desa": "Empiyang", "luas": "187,75", "persen": "11,81"}, {"desa": "Jangkang Benua", "luas": "138,27", "persen": "8,70"}, {"desa": "Tanggung", "luas": "165,98", "persen": "10,44"}, {"desa": "Pisang", "luas": "210,57", "persen": "13,25"}, {"desa": "Ketori", "luas": "174,14", "persen": "10,96"}];
var tabel1_2 = [{"desa": "Terati", "jarak_kec": "26,0", "jarak_kab": "82,0"}, {"desa": "Selampung", "jarak_kec": "29,0", "jarak_kab": "62,0"}, {"desa": "Sape", "jarak_kec": "16,0", "jarak_kab": "61,0"}, {"desa": "Semirau", "jarak_kec": "13,0", "jarak_kab": "87,0"}, {"desa": "Balai Sebut", "jarak_kec": "1,0", "jarak_kab": "72,0"}, {"desa": "Semombat", "jarak_kec": "15,0", "jarak_kab": "91,0"}, {"desa": "Empiyang", "jarak_kec": "21,0", "jarak_kab": "73,0"}, {"desa": "Jangkang Benua", "jarak_kec": "12,0", "jarak_kab": "86,0"}, {"desa": "Tanggung", "jarak_kec": "9,0", "jarak_kab": "74,0"}, {"desa": "Pisang", "jarak_kec": "12,0", "jarak_kab": "70,0"}, {"desa": "Ketori", "jarak_kec": "46,0", "jarak_kab": "122,0"}];

// ==========================
// REPLACE TEXT GLOBAL
// ==========================
app.findTextPreferences = NothingEnum.nothing;
app.changeTextPreferences = NothingEnum.nothing;

for (var key in data) {
    app.findTextPreferences.findWhat = "{{" + key + "}}";
    app.changeTextPreferences.changeTo = data[key];
    doc.changeText();
}

// ==========================
// HELPER: SPLIT ARRAY
// ==========================
function chunkArray(arr, size) {
    var result = [];
    for (var i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

// ==========================
// HELPER: CARI FRAME TABEL
// ==========================
function getTableFrame(placeholder) {

    app.findTextPreferences = NothingEnum.nothing;
    app.findTextPreferences.findWhat = "{{" + placeholder + "}}";

    var found = doc.findText();

    if (found.length === 0) {
        alert("Placeholder " + placeholder + " tidak ditemukan");
        return null;
    }

    return found[0].parentTextFrames[0];
}

// ==========================
// FUNGSI UTAMA MULTI PAGE
// ==========================
function isiTabelMultiPage(placeholder, dataArr, colMap, maxRows) {

    if (!dataArr || dataArr.length === 0) return;

    var chunks = chunkArray(dataArr, maxRows);

    // ambil frame awal
    var baseFrame = getTableFrame(placeholder);
    if (!baseFrame) return;

    for (var p = 0; p < chunks.length; p++) {

        var dataChunk = chunks[p];

        // ======================
        // DUPLICATE HALAMAN
        // ======================
        if (p > 0) {

            var newPage = doc.pages.add(LocationOptions.AFTER, doc.pages[p - 1]);

            // duplicate hanya frame tabel
            baseFrame.duplicate(newPage);
        }

        // ======================
        // CARI PLACEHOLDER KE-p
        // ======================
        app.findTextPreferences = NothingEnum.nothing;
        app.findTextPreferences.findWhat = "{{" + placeholder + "}}";

        var found = doc.findText();

        if (found.length <= p) continue;

        var target = found[p];

        try {

            var insertion = target.insertionPoints[0];
            var cell = insertion.parent;

            while (cell.constructor.name !== "Cell") {
                cell = cell.parent;
            }

            var row = cell.parentRow;
            var table = row.parent;
            var rowIndex = row.index;

            // ======================
            // ISI DATA
            // ======================

            // baris pertama
            for (var c = 0; c < colMap.length; c++) {
                row.cells[c].contents = dataChunk[0][colMap[c]];
            }

            // baris berikutnya
            for (var i = 1; i < dataChunk.length; i++) {

                var newRow = table.rows.add(
                    LocationOptions.AFTER,
                    table.rows[rowIndex + i - 1]
                );

                for (var c = 0; c < colMap.length; c++) {
                    newRow.cells[c].contents = dataChunk[i][colMap[c]];
                }
            }

        } catch (e) {
            alert("Error " + placeholder + ": " + e);
        }
    }

    // ======================
    // HAPUS HALAMAN EXTRA
    // ======================
    while (doc.pages.length > chunks.length) {
        doc.pages[-1].remove();
    }
}

// ==========================
// EKSEKUSI
// ==========================

isiTabelMultiPage("Tabel_1_1", tabel1_1, ["desa","luas","persen"], 20);
isiTabelMultiPage("Tabel_1_2", tabel1_2, ["desa","jarak_kec","jarak_kab"], 20);

alert(data.namaKecamatan + " selesai!");