/* --- Code39 Barcode --- */

const bwipjs = require("bwip-js");

/**
 * Generates a Code39 barcode.
 * @param {string} text - The text to encode in the barcode.
 * @param {number} scale - The scale factor for the barcode.
 * @returns {Promise<Buffer>} - A promise that resolves with the barcode image buffer.
 */
function generateBarcode(text, scale) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code39",
        text: text,
        includetext: false,
        backgroundcolor: "#ffffff",
        height: 36.7,
        paddingtop: 20,
        paddingbottom: 20,
        paddingleft: 28.5,
        paddingright: 28.5,
        scaleX: 2 * scale,
        scaleY: 1 * scale,
      },
      function (error, barcode) {
        if (error) {
          console.error("Barcode generation error:", error);
          reject(error);
        } else {
          resolve(barcode);
        }
      }
    );
  });
}

/* --- SHA-1 --- */

const crypto = require("crypto");

/**
 * Generates a SHA-1 hash.
 * @param {Buffer|string} data - The input data to hash.
 * @returns {string} - The resulting SHA-1 hash as a hexadecimal string.
 */
function generateSha1Hash(data) {
  return crypto.createHash("sha1").update(data).digest("hex");
}

/* --- Allowlist --- */

const allowlist = new Set([
  "en.lproj",
  "en.lproj/pass.strings",
  "zh-Hant.lproj",
  "zh-Hant.lproj/pass.strings",
  "icon.png",
  "icon@2x.png",
  "icon@3x.png",
  "logo.png",
  "logo@2x.png",
  "logo@3x.png",
]);

/* --- Templates --- */

const manifestTemplate = {
  "icon.png": "679d880e9b6a5b7c211677511cd25a13d9548332",
  "icon@2x.png": "48aaa513200ff8518e0ca84f9f2715c49fef5d88",
  "icon@3x.png": "795246607c7232c2a787e73067a101e35487ad81",
  "logo.png": "eaa0f624b30cf036aee396b2037daec11928c087",
  "logo@2x.png": "0663da59e8795c1f57d61056a3c882eba96b8b1c",
  "logo@3x.png": "343903630b0ba59c9217bcb3acc526422b3753c1",
  "en.lproj/pass.strings": "87fda3320f3ada67b3754d549e501d1277651852",
  "zh-Hant.lproj/pass.strings": "0b35b30dbb52ac5ee71e0351f00d85ceed4497f7",
};

const passTemplate = {
  description: "Mobile Barcode Pass",
  formatVersion: 1,
  organizationName: "Bit Loom Studio",
  passTypeIdentifier: "pass.io.bitloom.mobilebarcode",
  serialNumber: "1",
  teamIdentifier: "HVF94R44Q6",
  backgroundColor: "rgb(255, 255, 255)",
  foregroundColor: "rgb(0, 0, 0)",
  associatedStoreIdentifiers: [6502254130],
  logoText: "Mobile Barcode Pass",
};

/* --- Signature --- */

const forge = require("node-forge");

/**
 * Generates a digital signature.
 * @param {string} manifest - The manifest to sign.
 * @param {string} appleWWDRCertificatePEM - The Apple WWDR certificate in PEM format.
 * @param {string} certificatePEM - The signer's certificate in PEM format.
 * @param {string} privateKeyPEM - The signer's private key in PEM format.
 * @returns {Buffer} - The generated signature.
 */
function generateSignature(
  manifestString,
  appleWWDRCertificatePEM,
  certificatePEM,
  privateKeyPEM
) {
  const p7 = forge.pkcs7.createSignedData();

  p7.content = manifestString;

  p7.addCertificate(forge.pki.certificateFromPem(appleWWDRCertificatePEM));

  const certificate = forge.pki.certificateFromPem(certificatePEM);
  p7.addCertificate(certificate);

  p7.addSigner({
    key: forge.pki.privateKeyFromPem(privateKeyPEM),
    certificate: certificate,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      {
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data,
      },
      {
        type: forge.pki.oids.messageDigest,
      },
      {
        type: forge.pki.oids.signingTime,
      },
    ],
  });

  p7.sign({ detached: true });

  return Buffer.from(forge.asn1.toDer(p7.toAsn1()).getBytes(), "binary");
}

/* --- Exports --- */

module.exports = {
  generateBarcode,
  generateSha1Hash,
  generateSignature,
  allowlist,
  manifestTemplate,
  passTemplate,
};
