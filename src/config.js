const port = process.env.MBP_PORT;

const appleWWDRCertificatePEM = process.env.MBP_APPLE_WWDR_CERTIFICATE;

const certificatePEM = process.env.MBP_CERTIFICATE;

const privateKeyPEM = process.env.MBP_PRIVATE_KEY;

module.exports = {
  port,
  appleWWDRCertificatePEM,
  certificatePEM,
  privateKeyPEM,
};
