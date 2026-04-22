//target "InDesign"

var doc = app.activeDocument;

// ==========================
// DATA DARI PYTHON
// ==========================
var data = {
    namaKecamatan: "Meliau",
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

var tabel1_1 = [{"desa": "Baru Lombak", "luas": "163,17", "persen": "10,91"}, {"desa": "Kunyil", "luas": "142,84", "persen": "9,55"}, {"desa": "Pampang Dua", "luas": "67,04", "persen": "4,48"}, {"desa": "Harapan Makmur", "luas": "13,25", "persen": "0,89"}, {"desa": "Sungai Kembayau", "luas": "85,70", "persen": "5,73"}, {"desa": "Kuala Rosan", "luas": "68,62", "persen": "4,59"}, {"desa": "Kuala Buayan", "luas": "83,02", "persen": "5,55"}, {"desa": "Bhakti Jaya", "luas": "33,20", "persen": "2,22"}, {"desa": "Cupang", "luas": "33,95", "persen": "2,27"}, {"desa": "Mukti Jaya", "luas": "13,47", "persen": "0,90"}, {"desa": "Lalang", "luas": "72,40", "persen": "4,84"}, {"desa": "Enggadai", "luas": "94,68", "persen": "6,33"}, {"desa": "Meranggau", "luas": "76,28", "persen": "5,10"}, {"desa": "Balai Tinggi", "luas": "260,71", "persen": "17,43"}, {"desa": "Meliau Hilir", "luas": "69,10", "persen": "4,62"}, {"desa": "Meliau Hulu", "luas": "39,08", "persen": "2,61"}, {"desa": "Sungai Mayam", "luas": "54,79", "persen": "3,66"}, {"desa": "Melobok", "luas": "108,28", "persen": "7,24"}, {"desa": "Melawi Makmur", "luas": "16,16", "persen": "1,08"}];
var tabel1_2 = [{"desa": "Baru Lombak", "jarak_kec": "25,0", "jarak_kab": "94,0"}, {"desa": "Kunyil", "jarak_kec": "32,0", "jarak_kab": "99,0"}, {"desa": "Pampang Dua", "jarak_kec": "24,0", "jarak_kab": "78,0"}, {"desa": "Harapan Makmur", "jarak_kec": "23,0", "jarak_kab": "88,0"}, {"desa": "Sungai Kembayau", "jarak_kec": "35,0", "jarak_kab": "90,0"}, {"desa": "Kuala Rosan", "jarak_kec": "24,0", "jarak_kab": "94,0"}, {"desa": "Kuala Buayan", "jarak_kec": "14,0", "jarak_kab": "69,0"}, {"desa": "Bhakti Jaya", "jarak_kec": "10,0", "jarak_kab": "70,0"}, {"desa": "Cupang", "jarak_kec": "41,0", "jarak_kab": "96,0"}, {"desa": "Mukti Jaya", "jarak_kec": "8,0", "jarak_kab": "69,0"}, {"desa": "Lalang", "jarak_kec": "17,0", "jarak_kab": "78,0"}, {"desa": "Enggadai", "jarak_kec": "20,0", "jarak_kab": "88,0"}, {"desa": "Meranggau", "jarak_kec": "10,0", "jarak_kab": "76,0"}, {"desa": "Balai Tinggi", "jarak_kec": "16,0", "jarak_kab": "77,0"}, {"desa": "Meliau Hilir", "jarak_kec": "1,0", "jarak_kab": "68,0"}, {"desa": "Meliau Hulu", "jarak_kec": "1,0", "jarak_kab": "68,0"}, {"desa": "Sungai Mayam", "jarak_kec": "9,0", "jarak_kab": "55,0"}, {"desa": "Melobok", "jarak_kec": "14,0", "jarak_kab": "53,0"}, {"desa": "Melawi Makmur", "jarak_kec": "23,0", "jarak_kab": "95,0"}];

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