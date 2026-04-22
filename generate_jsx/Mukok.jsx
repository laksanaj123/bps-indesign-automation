//target "InDesign"

var doc = app.activeDocument;

// ==========================
// DATA DARI PYTHON
// ==========================
var data = {
    namaKecamatan: "Mukok",
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

var tabel1_1 = [{"desa": "Inggis", "luas": "57,00", "persen": "11,38"}, {"desa": "Semanggis Raya", "luas": "21,24", "persen": "4,24"}, {"desa": "Semuntai", "luas": "35,10", "persen": "7,01"}, {"desa": "Kedukul", "luas": "48,10", "persen": "9,60"}, {"desa": "Engkode", "luas": "79,70", "persen": "15,91"}, {"desa": "Sungai Mawang", "luas": "80,60", "persen": "16,09"}, {"desa": "Tri Mulya", "luas": "24,40", "persen": "4,87"}, {"desa": "Layak Omang", "luas": "51,62", "persen": "10,30"}, {"desa": "Serambai Jaya", "luas": "103,24", "persen": "20,61"}];
var tabel1_2 = [{"desa": "Inggis", "jarak_kec": "23,0", "jarak_kab": "22,0"}, {"desa": "Semanggis Raya", "jarak_kec": "21,0", "jarak_kab": "30,0"}, {"desa": "Semuntai", "jarak_kec": "10,0", "jarak_kab": "19,0"}, {"desa": "Kedukul", "jarak_kec": "2,0", "jarak_kab": "27,0"}, {"desa": "Engkode", "jarak_kec": "8,0", "jarak_kab": "34,0"}, {"desa": "Sungai Mawang", "jarak_kec": "16,0", "jarak_kab": "46,0"}, {"desa": "Tri Mulya", "jarak_kec": "12,0", "jarak_kab": "41,0"}, {"desa": "Layak Omang", "jarak_kec": "16,0", "jarak_kab": "46,0"}, {"desa": "Serambai Jaya", "jarak_kec": "20,0", "jarak_kab": "49,0"}];

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