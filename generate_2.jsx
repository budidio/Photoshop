#target photoshop

function generateQRToCanvas() {
    var qrText = prompt("Masukkan teks/URL QR Code:", "https://contoh.com");
    if (!qrText) return;

    var encodedText = encodeURIComponent(qrText);
    var host = "api.qrserver.com";
    var path = "/v1/create-qr-code/?size=600x600&data=" + encodedText;

    var destFile = new File(Folder.desktop + "/qr_temp.png");

    if (downloadQRImage(host, path, destFile)) {
        var doc = app.activeDocument;
        var qrDoc = app.open(destFile);
        qrDoc.selection.selectAll();
        qrDoc.selection.copy();
        qrDoc.close(SaveOptions.DONOTSAVECHANGES);

        app.activeDocument = doc;
        doc.paste();

        var layer = doc.activeLayer;
        addWhiteOutline(layer);
    } else {
        alert("Gagal mengunduh QR Code.");
    }
}

function downloadQRImage(host, path, file) {
    try {
        var socket = new Socket();
        if (socket.open(host + ":80", "binary")) {
            socket.write("GET " + path + " HTTP/1.0\r\nHost: " + host + "\r\n\r\n");

            var response = socket.read(999999);
            socket.close();

            var splitIndex = response.indexOf("\r\n\r\n");
            if (splitIndex > -1) {
                var body = response.substring(splitIndex + 4);
                var binFile = new File(file.fsName);
                binFile.encoding = "BINARY";
                binFile.open("w");
                binFile.write(body);
                binFile.close();
                return true;
            }
        }
    } catch (e) {
        alert("Gagal unduh QR: " + e);
    }
    return false;
}

function addWhiteOutline(layer) {
    // Aktifkan layer jika belum
    app.activeDocument.activeLayer = layer;

    // Tambahkan efek stroke (outline putih)
    var idsetd = charIDToTypeID("setd");
    var desc1 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref1 = new ActionReference();
    var idPrpr = charIDToTypeID("Prpr");
    var idLefx = charIDToTypeID("Lefx");
    ref1.putProperty(idPrpr, idLefx);
    ref1.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc1.putReference(idnull, ref1);

    var idT = charIDToTypeID("T   ");
    var desc2 = new ActionDescriptor();
    var idScl = charIDToTypeID("Scl ");
    desc2.putUnitDouble(idScl, charIDToTypeID("#Prc"), 100.000000);

    var idFrFX = charIDToTypeID("FrFX");
    var desc3 = new ActionDescriptor();
    desc3.putBoolean(charIDToTypeID("enab"), true);
    desc3.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("OutF"));
    desc3.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    desc3.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 10);
    desc3.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100.000000);

    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 255.000000);
    colorDesc.putDouble(charIDToTypeID("Grn "), 255.000000);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 255.000000);
    desc3.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);

    desc2.putObject(idFrFX, idFrFX, desc3);
    desc1.putObject(idT, idLefx, desc2);
    executeAction(idsetd, desc1, DialogModes.NO);
}

generateQRToCanvas();
