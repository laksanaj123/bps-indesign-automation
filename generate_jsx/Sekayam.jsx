//target "InDesign"

var doc = app.activeDocument;

// ==========================
// DATA DARI PYTHON
// ==========================
var data = {
    namaKecamatan: "Sekayam",
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

var tabel1_1 = [{"desa": "Sotok", "luas": "92,37", "persen": "10,98"}, {"desa": "Pengadang", "luas": "49,13", "persen": "5,84"}, {"desa": "Kenaman", "luas": "48,87", "persen": "5,81"}, {"desa": "Raut Muara", "luas": "104,52", "persen": "12,43"}, {"desa": "Engkahan", "luas": "82,56", "persen": "9,82"}, {"desa": "Balai Karangan", "luas": "67,03", "persen": "7,97"}, {"desa": "Bungkang", "luas": "79,98", "persen": "9,51"}, {"desa": "Lubuk Sabuk", "luas": "103,29", "persen": "12,28"}, {"desa": "Malenggang", "luas": "116,56", "persen": "13,86"}, {"desa": "Sei Tekam", "luas": "96,70", "persen": "11,50"}];
var tabel1_2 = [{"desa": "Sotok", "jarak_kec": "11,0", "jarak_kab": "124,0"}, {"desa": "Pengadang", "jarak_kec": "5,0", "jarak_kab": "117,0"}, {"desa": "Kenaman", "jarak_kec": "2,0", "jarak_kab": "112,0"}, {"desa": "Raut Muara", "jarak_kec": "10,0", "jarak_kab": "125,0"}, {"desa": "Engkahan", "jarak_kec": "7,0", "jarak_kab": "121,0"}, {"desa": "Balai Karangan", "jarak_kec": "2,0", "jarak_kab": "116,0"}, {"desa": "Bungkang", "jarak_kec": "9,0", "jarak_kab": "122,0"}, {"desa": "Lubuk Sabuk", "jarak_kec": "17,0", "jarak_kab": "128,0"}, {"desa": "Malenggang", "jarak_kec": "40,0", "jarak_kab": "143,0"}, {"desa": "Sei Tekam", "jarak_kec": "36,0", "jarak_kab": "155,0"}];

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