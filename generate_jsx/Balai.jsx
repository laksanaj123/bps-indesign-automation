//target "InDesign"

var doc = app.activeDocument;

// ==========================
// DATA DARI PYTHON
// ==========================
var data = {
    namaKecamatan: "Balai",
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

var tabel1_1 = [{"desa": "Semoncol", "luas": "55,86", "persen": "14,12"}, {"desa": "Mak Kawing", "luas": "43,03", "persen": "10,88"}, {"desa": "Cowet", "luas": "37,65", "persen": "9,52"}, {"desa": "Bulu Bala", "luas": "47,55", "persen": "12,02"}, {"desa": "Temiang Taba", "luas": "21,22", "persen": "5,36"}, {"desa": "Senyabang", "luas": "31,21", "persen": "7,89"}, {"desa": "Kebadu", "luas": "30,11", "persen": "7,61"}, {"desa": "Hilir", "luas": "7,20", "persen": "1,82"}, {"desa": "Temiang Mali", "luas": "25,05", "persen": "6,33"}, {"desa": "Tae", "luas": "15,78", "persen": "3,99"}, {"desa": "Padi Kaye", "luas": "32,44", "persen": "8,20"}, {"desa": "Empirang Ujung", "luas": "48,50", "persen": "12,26"}];
var tabel1_2 = [{"desa": "Semoncol", "jarak_kec": "13,0", "jarak_kab": "86,0"}, {"desa": "Mak Kawing", "jarak_kec": "5,0", "jarak_kab": "79,0"}, {"desa": "Cowet", "jarak_kec": "6,0", "jarak_kab": "79,0"}, {"desa": "Bulu Bala", "jarak_kec": "5,0", "jarak_kab": "79,0"}, {"desa": "Temiang Taba", "jarak_kec": "13,0", "jarak_kab": "62,0"}, {"desa": "Senyabang", "jarak_kec": "8,0", "jarak_kab": "64,0"}, {"desa": "Kebadu", "jarak_kec": "3,0", "jarak_kab": "71,0"}, {"desa": "Hilir", "jarak_kec": "3,0", "jarak_kab": "71,0"}, {"desa": "Temiang Mali", "jarak_kec": "2,0", "jarak_kab": "76,0"}, {"desa": "Tae", "jarak_kec": "6,0", "jarak_kab": "80,0"}, {"desa": "Padi Kaye", "jarak_kec": "7,0", "jarak_kab": "79,0"}, {"desa": "Empirang Ujung", "jarak_kec": "6,0", "jarak_kab": "77,0"}];

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