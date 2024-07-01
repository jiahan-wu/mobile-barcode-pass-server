const archiver = require("archiver");
const bodyParser = require("body-parser");
const express = require("express");

const config = require("./config");
const utils = require("./utils");

const app = express();
app.use(bodyParser.json());

app.post("/api/mobile-barcode-passes", (request, response) => {
  const mobileBarcode = request.body["mobile_barcode"];

  Promise.all([
    utils.generateBarcode(mobileBarcode, 1),
    utils.generateBarcode(mobileBarcode, 2),
    utils.generateBarcode(mobileBarcode, 3),
  ])
    .then((barcodes) => {
      response.header("Content-Type", "application/zip");
      response.header(
        "Content-Disposition",
        'attachment; filename="mobile-barcode-pass.pkpass"'
      );

      const archive = archiver("zip");

      archive.pipe(response);

      archive.directory("res/", false, (file) => {
        return utils.allowlist.has(file.name) ? file : false;
      });

      archive.append(barcodes[0], { name: "strip.png" });
      archive.append(barcodes[1], { name: "strip@2x.png" });
      archive.append(barcodes[2], { name: "strip@3x.png" });

      const pass = utils.passTemplate;
      pass["storeCard"] = {
        auxiliaryFields: [
          {
            key: "mobile_barcode",
            value: mobileBarcode,
            label: "Mobile Barcode",
          },
        ],
      };
      const passString = JSON.stringify(pass);
      archive.append(passString, { name: "pass.json" });

      const manifest = utils.manifestTemplate;
      manifest["strip.png"] = utils.generateSha1Hash(barcodes[0]);
      manifest["strip@2x.png"] = utils.generateSha1Hash(barcodes[1]);
      manifest["strip@3x.png"] = utils.generateSha1Hash(barcodes[2]);
      manifest["pass.json"] = utils.generateSha1Hash(passString);
      const manifestString = JSON.stringify(manifest);
      archive.append(manifestString, { name: "manifest.json" });

      const signature = utils.generateSignature(
        manifestString,
        config.appleWWDRCertificatePEM,
        config.certificatePEM,
        config.privateKeyPEM
      );
      archive.append(signature, { name: "signature" });

      archive.finalize();
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send({ error: "Internal Server Error" });
    });
});

const port = config.port;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
