//target "InDesign"

var doc = app.activeDocument;

// ==========================
// DATA DARI PYTHON
// ==========================
var data = {
    namaKecamatan: "Bonti",
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

var tabel1_1 = [{"desa": "Upe", "luas": "118,82", "persen": "10,59"}, {"desa": "Bahta", "luas": "103,04", "persen": "9,19"}, {"desa": "Tunggul Boyok", "luas": "89,92", "persen": "8,02"}, {"desa": "Sami", "luas": "47,71", "persen": "4,25"}, {"desa": "Empodis", "luas": "66,33", "persen": "5,91"}, {"desa": "Bonti", "luas": "59,24", "persen": "5,28"}, {"desa": "Kampuh", "luas": "126,00", "persen": "11,23"}, {"desa": "Bantai", "luas": "284,37", "persen": "25,35"}, {"desa": "Majel", "luas": "226,37", "persen": "20,18"}];
var tabel1_2 = [{"desa": "Upe", "jarak_kec": "3,0", "jarak_kab": "43,0"}, {"desa": "Bahta", "jarak_kec": "22,0", "jarak_kab": "72,0"}, {"desa": "Tunggul Boyok", "jarak_kec": "12,0", "jarak_kab": "60,0"}, {"desa": "Sami", "jarak_kec": "4,0", "jarak_kab": "53,0"}, {"desa": "Empodis", "jarak_kec": "4,0", "jarak_kab": "53,0"}, {"desa": "Bonti", "jarak_kec": "1,0", "jarak_kab": "50,0"}, {"desa": "Kampuh", "jarak_kec": "20,0", "jarak_kab": "60,0"}, {"desa": "Bantai", "jarak_kec": "16,0", "jarak_kab": "64,0"}, {"desa": "Majel", "jarak_kec": "24,0", "jarak_kab": "71,0"}];

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