//target "InDesign"

var doc = app.activeDocument;

var data = {
    namaKecamatan: "{namaKecamatan}",
    namaKec_Kapital: "{namaKec_Kapital}",
    nomorVolume: "{nomorVolume}",
    nomorKatalog: "{nomorKatalog}",
    nomorPublikasi: "{nomorPublikasi}",
    jumlahHalaman: "{jumlahHalaman}",
    sumberIlustrasi: "{sumberIlustrasi}",
    namaPenyunting: "{namaPenyunting}",
    namaPenulis: "{namaPenulis}",
    namaLayouter: "{namaLayouter}",
    namaInfografis: "{namaInfografis}",
    namaPenerjemah: "{namaPenerjemah}"
};

var tabel1_1 = {tabel1_1};
var tabel1_2 = {tabel1_2};
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

isiTabel("Tabel_1_1", tabel1_1, ["desa","luas","persen"]);
isiTabel("Tabel_1_2", tabel1_2, ["desa","jarak_kec","jarak_kab"]);
// ... panggil isiTabel untuk tabel lain jika perlu

alert("{namaKecamatan} Selesai!");