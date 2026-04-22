//target "InDesign"

var doc = app.activeDocument;

// ==========================
// DATA DARI PYTHON
// ==========================
var data = {
    namaKecamatan: "Tayan Hilir",
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

var tabel1_1 = [{"desa": "Lalang", "luas": "162,00", "persen": "15,42"}, {"desa": "Kawat", "luas": "51,00", "persen": "4,85"}, {"desa": "Pulau Tayan Utara", "luas": "1,40", "persen": "0,13"}, {"desa": "Pedalaman", "luas": "68,00", "persen": "6,47"}, {"desa": "Tanjung Bunut", "luas": "48,00", "persen": "4,57"}, {"desa": "Sebemban", "luas": "13,50", "persen": "1,29"}, {"desa": "Beginjan", "luas": "25,50", "persen": "2,43"}, {"desa": "Sungai Jaman", "luas": "101,00", "persen": "9,61"}, {"desa": "Emberas", "luas": "85,00", "persen": "8,09"}, {"desa": "Melugai", "luas": "109,10", "persen": "10,39"}, {"desa": "Cempedak", "luas": "62,00", "persen": "5,90"}, {"desa": "Sejotang", "luas": "64,50", "persen": "6,14"}, {"desa": "Subah", "luas": "161,50", "persen": "15,37"}, {"desa": "Tebang Benua", "luas": "20,50", "persen": "1,95"}, {"desa": "Balai Ingin", "luas": "77,50", "persen": "7,38"}];
var tabel1_2 = [{"desa": "Lalang", "jarak_kec": "45,0", "jarak_kab": "129,0"}, {"desa": "Kawat", "jarak_kec": "1,0", "jarak_kab": "98,0"}, {"desa": "Pulau Tayan Utara", "jarak_kec": "2,0", "jarak_kab": "91,0"}, {"desa": "Pedalaman", "jarak_kec": "2,0", "jarak_kab": "99,0"}, {"desa": "Tanjung Bunut", "jarak_kec": "10,0", "jarak_kab": "110,0"}, {"desa": "Sebemban", "jarak_kec": "14,0", "jarak_kab": "997,0"}, {"desa": "Beginjan", "jarak_kec": "12,0", "jarak_kab": "112,0"}, {"desa": "Sungai Jaman", "jarak_kec": "38,0", "jarak_kab": "85,0"}, {"desa": "Emberas", "jarak_kec": "12,0", "jarak_kab": "114,0"}, {"desa": "Melugai", "jarak_kec": "12,0", "jarak_kab": "112,0"}, {"desa": "Cempedak", "jarak_kec": "14,0", "jarak_kab": "88,0"}, {"desa": "Sejotang", "jarak_kec": "22,0", "jarak_kab": "99,0"}, {"desa": "Subah", "jarak_kec": "48,0", "jarak_kab": "129,0"}, {"desa": "Tebang Benua", "jarak_kec": "16,0", "jarak_kab": "83,0"}, {"desa": "Balai Ingin", "jarak_kec": "42,0", "jarak_kab": "60,0"}];

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