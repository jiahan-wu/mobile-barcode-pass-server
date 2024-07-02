# Mobile Barcode Pass Server

## Description

This project is an Express.js-based web service designed to generate Apple Wallet Passes that incorporate mobile barcodes compliant with Taiwan's Ministry of Finance regulations. It seamlessly embeds the officially recognized e-invoice carrier into Apple's mobile pass ecosystem.

## Deployment Steps

1. Clone the repository:

```bash
git clone https://github.com/jiahan-wu/mobile-barcode-pass-server.git
cd mobile-barcode-pass-server
```

2. Install dependencies:

```bash
npm ci
```

3. Set up environment variables:

* `MBP_PORT`: The port number on which the application will run.
* `MBP_APPLE_WWDR_CERTIFICATE`: The Apple Worldwide Developer Relations (WWDR) certificate in PEM format.
* `MBP_CERTIFICATE`: The Apple Wallet Pass certificate in PEM format.
* `MBP_PRIVATE_KEY`: The private key for signing Apple Wallet Passes in PEM format.

4. Start the application:

```bash
npm start
```

## API Usage Example

Here's an example of sending a POST request using cURL to generate an Apple Wallet Pass:

```bash
curl -X "POST" "http://localhost/api/mobile-barcode-passes" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{ "mobile_barcode": "/RDCSMV2" }'
```

This request is sent to the `/api/mobile-barcode-passes` endpoint and includes a JSON object in the request body with a `mobile_barcode` field containing the Ministry of Finance compliant mobile barcode.

On success, the API will directly return a .pkpass file. This file can be added directly to Apple Wallet.

> [!NOTE]  
> Make sure to replace localhost with your actual server address, and adjust the URL if your service is running on a different port.
