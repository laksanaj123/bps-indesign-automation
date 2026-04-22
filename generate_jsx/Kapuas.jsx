//target "InDesign"

var doc = app.activeDocument;

// ==========================
// DATA DARI PYTHON
// ==========================
var data = {
    namaKecamatan: "Kapuas",
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

var tabel1_1 = [{"desa": "Penyalimau Jaya", "luas": "26,95", "persen": "1,98"}, {"desa": "Penyalimau", "luas": "43,30", "persen": "3,19"}, {"desa": "Rambin", "luas": "95,90", "persen": "7,06"}, {"desa": "Nanga Biang", "luas": "63,72", "persen": "4,69"}, {"desa": "Lintang Pelaman", "luas": "46,85", "persen": "3,45"}, {"desa": "Sei Alai", "luas": "55,00", "persen": "4,05"}, {"desa": "Semerangkai", "luas": "65,51", "persen": "4,82"}, {"desa": "Sungai Batu", "luas": "61,36", "persen": "4,52"}, {"desa": "Sungai Muntik", "luas": "47,26", "persen": "3,48"}, {"desa": "Lintang Kapuas", "luas": "44,89", "persen": "3,30"}, {"desa": "Belangin", "luas": "19,51", "persen": "1,44"}, {"desa": "Penyeladi", "luas": "59,71", "persen": "4,40"}, {"desa": "Tanjung Kapuas", "luas": "58,75", "persen": "4,33"}, {"desa": "Tanjung Sekayam", "luas": "22,53", "persen": "1,66"}, {"desa": "Ilir Kota", "luas": "17,55", "persen": "1,29"}, {"desa": "Beringin", "luas": "52,52", "persen": "3,87"}, {"desa": "Bunut", "luas": "81,81", "persen": "6,02"}, {"desa": "Lape", "luas": "88,04", "persen": "6,48"}, {"desa": "Sungai Mawang", "luas": "59,70", "persen": "4,40"}, {"desa": "Sungai Sengkuang", "luas": "79,60", "persen": "5,86"}, {"desa": "Pana", "luas": "60,40", "persen": "4,45"}, {"desa": "Mengkiang", "luas": "53,75", "persen": "3,96"}, {"desa": "Entakai", "luas": "36,35", "persen": "2,68"}, {"desa": "Kambong", "luas": "78,23", "persen": "5,76"}, {"desa": "Tapang Dulang", "luas": "12,81", "persen": "0,94"}, {"desa": "Botuh Lintang", "luas": "26,29", "persen": "1,94"}];
var tabel1_2 = [{"desa": "Penyalimau Jaya", "jarak_kec": "80,0", "jarak_kab": "81,0"}, {"desa": "Penyalimau", "jarak_kec": "85,0", "jarak_kab": "86,0"}, {"desa": "Rambin", "jarak_kec": "39,0", "jarak_kab": "38,0"}, {"desa": "Nanga Biang", "jarak_kec": "27,0", "jarak_kab": "26,0"}, {"desa": "Lintang Pelaman", "jarak_kec": "39,0", "jarak_kab": "40,0"}, {"desa": "Sei Alai", "jarak_kec": "56,0", "jarak_kab": "56,0"}, {"desa": "Semerangkai", "jarak_kec": "50,0", "jarak_kab": "51,0"}, {"desa": "Sungai Batu", "jarak_kec": "17,0", "jarak_kab": "18,0"}, {"desa": "Sungai Muntik", "jarak_kec": "24,0", "jarak_kab": "24,0"}, {"desa": "Lintang Kapuas", "jarak_kec": "14,0", "jarak_kab": "15,0"}, {"desa": "Belangin", "jarak_kec": "18,0", "jarak_kab": "18,0"}, {"desa": "Penyeladi", "jarak_kec": "11,0", "jarak_kab": "10,0"}, {"desa": "Tanjung Kapuas", "jarak_kec": "2,0", "jarak_kab": "2,0"}, {"desa": "Tanjung Sekayam", "jarak_kec": "3,0", "jarak_kab": "3,0"}, {"desa": "Ilir Kota", "jarak_kec": "1,0", "jarak_kab": "1,0"}, {"desa": "Beringin", "jarak_kec": "1,0", "jarak_kab": "1,0"}, {"desa": "Bunut", "jarak_kec": "6,0", "jarak_kab": "6,0"}, {"desa": "Lape", "jarak_kec": "13,0", "jarak_kab": "14,0"}, {"desa": "Sungai Mawang", "jarak_kec": "9,0", "jarak_kab": "10,0"}, {"desa": "Sungai Sengkuang", "jarak_kec": "5,0", "jarak_kab": "4,0"}, {"desa": "Pana", "jarak_kec": "11,0", "jarak_kab": "10,0"}, {"desa": "Mengkiang", "jarak_kec": "24,0", "jarak_kab": "24,0"}, {"desa": "Entakai", "jarak_kec": "17,0", "jarak_kab": "16,0"}, {"desa": "Kambong", "jarak_kec": "25,0", "jarak_kab": "24,0"}, {"desa": "Tapang Dulang", "jarak_kec": "90,0", "jarak_kab": "90,0"}, {"desa": "Botuh Lintang", "jarak_kec": "31,0", "jarak_kab": "30,0"}];

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