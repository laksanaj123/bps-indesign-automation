//target "InDesign"

var doc = app.activeDocument;

// ==========================
// DATA DARI PYTHON
// ==========================
var data = {
    namaKecamatan: "Tayan Hulu",
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

var tabel1_1 = [{"desa": "Menyabo", "luas": "61,14", "persen": "8,50"}, {"desa": "Binjai", "luas": "60,99", "persen": "8,48"}, {"desa": "Pandan Sembuat", "luas": "176,71", "persen": "24,57"}, {"desa": "Kedakas", "luas": "72,42", "persen": "10,07"}, {"desa": "Sosok", "luas": "43,73", "persen": "6,08"}, {"desa": "Peruan Dalam", "luas": "37,32", "persen": "5,19"}, {"desa": "Mandong", "luas": "46,37", "persen": "6,45"}, {"desa": "Janjang", "luas": "29,96", "persen": "4,17"}, {"desa": "Riyai", "luas": "47,45", "persen": "6,60"}, {"desa": "Berakak", "luas": "47,48", "persen": "6,60"}, {"desa": "Engkasan", "luas": "95,63", "persen": "13,30"}];
var tabel1_2 = [{"desa": "Menyabo", "jarak_kec": "6,0", "jarak_kab": "55,0"}, {"desa": "Binjai", "jarak_kec": "9,0", "jarak_kab": "40,0"}, {"desa": "Pandan Sembuat", "jarak_kec": "14,0", "jarak_kab": "49,0"}, {"desa": "Kedakas", "jarak_kec": "4,0", "jarak_kab": "49,0"}, {"desa": "Sosok", "jarak_kec": "1,0", "jarak_kab": "49,0"}, {"desa": "Peruan Dalam", "jarak_kec": "9,0", "jarak_kab": "58,0"}, {"desa": "Mandong", "jarak_kec": "4,0", "jarak_kab": "54,0"}, {"desa": "Janjang", "jarak_kec": "5,0", "jarak_kab": "54,0"}, {"desa": "Riyai", "jarak_kec": "21,0", "jarak_kab": "68,0"}, {"desa": "Berakak", "jarak_kec": "27,0", "jarak_kab": "68,0"}, {"desa": "Engkasan", "jarak_kec": "35,0", "jarak_kab": "82,0"}];

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