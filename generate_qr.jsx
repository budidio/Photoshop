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

generateQRToCanvas();
