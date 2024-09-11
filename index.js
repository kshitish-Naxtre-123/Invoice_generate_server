const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: "dffvqcoin",
  api_key: "967494288262447",
  api_secret: "SmuqM-8vynRBZc0ayT0t05-MinY",
});

const app = express();
const port = 5550; // Make sure this matches your fetch URL

app.use(express.json());

// Connect to MongoDB (update the connection string as needed)
mongoose.connect(
  "mongodb+srv://kshitishkumar:Kshitish2002@cluster0.grbfcvd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/form",
  console.log("connect to mongodb database"),
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Define a Mongoose schema and model
const invoiceSchema = new mongoose.Schema({
  invoice_type: String,
  client: String,
  company: String,
  bank: String,
  invoice_id: String,
  invoice_no: String,
  reoccurring: String,
  issue_date: Date,
  due_date: Date,
  payment_received: String,
  fees: String,
  gst: String,
  items: [
    {
      title: String,
      description: String,
      quantity: Number,
      unit_price: String,
      total_price: String,
    },
  ],
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS

// Serve static files (e.g., HTML)
app.use(express.static("public"));

// API endpoint to handle form submissions
app.post("/submit-form", async (req, res) => {
  try {
    const invoiceData = req.body;
    const invoice = new Invoice({
      invoice_type: invoiceData.invoice_type,
      client: invoiceData.client,
      company: invoiceData.company,
      bank: invoiceData.bank,
      invoice_id: invoiceData["invoice-id"],
      invoice_no: invoiceData["invoice-no"],
      reoccurring: invoiceData.reoccurring,
      issue_date: new Date(invoiceData["issue-date"]),
      due_date: new Date(invoiceData["due-date"]),
      payment_received: invoiceData["payment-received"],
      fees: invoiceData.fees,
      gst: invoiceData.gst,
      items: invoiceData.items,
    });
    await invoice.save();
    res.json({ message: "Invoice saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save invoice" });
  }
});

app.post("/generate-invoice", async (req, res) => {
  const invoiceData = req.body;

  const htmlContent = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tax Invoice</title>

    <style>
      body {
        background-color: #ffff;
        font-family: sans-serif;
        /* padding: 20px 0px; */
      }
      /* .background-container {
        background-image: url("invoice-header.jpg");
        background-repeat: no-repeat;
        background-size: 680px;
        margin-left: 20rem;
      } */

      p {
        font-size: 14px;
        padding-left: 5px;
        font-weight: 500;
        line-height: 1.4;
      }

      .invoice-box {
        max-width: 700px;
        margin: auto;
        /* padding: 10px; */
        /* border: 1px solid #1a1717; */
        background-color: #fff;
        /* padding-top: 15rem; */
        border-top: 0;
      }

      .invoice-title {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        /* border: 2px solid #000; */
      }

      .table td,
      .table th {
        padding: 4px;
        vertical-align: middle;
        border: 2px solid #000;
        border-left: 0;
      }

      .table th {
        font-weight: 500;
      }
      /* 
      .table-bordered {
      } */

      .text-right {
        text-align: right;
      }

      .text-center {
        text-align: center;
      }

      .bank-details,
      .receiver-info {
        font-size: 14px;
        margin-top: 20px;
      }
      table td{
        font-size: 15px;
      }

      .amount-words {
        margin-top: 20px;
        font-weight: bold;
      }
      .bill-section-border {
        border-bottom: 2px solid #000;
        border-right: 2px solid #000;
      }
      .bill-div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .image-container {
        display: flex; /* Enables flexbox layout */
        justify-content: center; /* Centers the image horizontally */
        align-items: center; /* Centers the image vertically */
        height: 195px; /* Makes the container take the full height of the viewport */
      }

      img {
        width: 736px;
        height: 195px;
      }
      .footer {
        text-align: center; /* Center the text */
              padding: 20px 20px 0 20px;
        margin-top: 20px;
      }

      .footer hr {
        border: none;
        border-top: 5px solid #2196f3d4; /* Blue line similar to the image */
        width: 650px; /* Line width */
        margin: 0 auto 10px; /* Center the line */
      }

      .footer p {
        color: #2196f3; /* Blue color text */
        font-size: 14px;
        font-weight: 600;
      }

      .footer a {
        color: #2196f3; /* Match the link color to the text color */
        text-decoration: none; /* Remove underline from links */
      }
    </style>
  </head>

  <body>
    <div class="background-container">
      <div class="image-container">
        <img
          src="https://naxtre.s3.ap-south-1.amazonaws.com/Screenshot+2024-09-10+100214.png"
          alt="Centered Image"
        />
      </div>

      <div class="invoice-box">
        <div style="border: 2px solid black; margin-top: 5px">
          <div class="bill-div" style="padding-bottom: 10px">
            <div
              class="col-md-5 bill-section-border"
              style="padding-left: 0px; padding-right: 0; padding-top: 5px"
            >
              <h6 style="border-bottom: 2px solid #000; margin-top: 0;margin-bottom: 2px;">
                <span
                  style="padding-left: 6px; font-size: 18px; font-weight: 500;"
                  >Bill to:</span
                >
              </h6>
              <p style="padding-left: 6px;margin: 0;">
                Kind Attn: Webomaze Pty Ltd<br />
                <span style="font-weight: 600;"> Webomaze Pty Ltd</span><br />
                Level 2/1 Southbank Blvd, Southbank, Victoria, Australia
              </p>
              <p style="font-weight: 600; padding-left: 6px">GST Number :</p>
            </div>

            <div>
              <h6
                style="
                  font-size: 18px;
                  margin-top: 5px;
                  margin-bottom: 6px;
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;
                "
              >
                <span style="padding-right: 8px; padding-top: 8px;font-weight: 500;"
                  >Tax Invoice</span
                >
              </h6>
              <table style="border-collapse: collapse">
                <tr>
                  <td style="border: 2px solid #000; padding: 5px">
                    Invoice Number:
                  </td>
                  <td
                    style="
                      border: 2px solid #000;
                      border-right: none;
                      padding: 5px;
                    "
                  >
                   ${invoiceData["invoice-no"]}
                  </td>
                </tr>
                <tr>
                  <td style="border: 2px solid #000; padding: 5px">
                    Issue Date:
                  </td>
                  <td
                    style="
                      border: 2px solid #000;
                      border-right: none;
                      padding: 5px;
                    "
                  >
                         ${new Date(
                           invoiceData["issue-date"]
                         ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td style="border: 2px solid #000; padding: 5px">
                    Due Date:
                  </td>
                  <td
                    style="
                      border: 2px solid #000;
                      border-right: none;
                      padding: 5px;
                    "
                  >
                         ${new Date(
                           invoiceData["due-date"]
                         ).toLocaleDateString()}
                  </td>
                </tr>
                <tr style="border-left: 2px solid #000">
                  <td style="padding-left: 3px">Ref: 23</td>
                </tr>
                <tr
                  style="
                    border-left: 2px solid #000;
                    border-bottom: 2px solid #000;
                  "
                >
                  <td style="padding-left: 3px">Dated: ${new Date(
                    invoiceData["issue-date"]
                  ).toLocaleDateString()}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12" style="padding: 0">
              <table class="table table-bordered">
                <thead style="text-align: center">
                  <tr>
                    <th>S.No.</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price(USD)</th>
                    <th style="border-right: 0; width: 174px">Total (USD)</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr style="text-align: center">
                  ${invoiceData.items
                    .map(
                      (item, index) => `
                       <tr style="text-align: center">
                           <td>${index + 1}</td>
                           <td> <strong>${item.title}</strong><br>${
                        item.description
                      }</td>
                           <td style="font-weight: 500">${item.quantity}</td>
                           <td>$${item.unit_price}</td>
                           <td style="font-weight: 500; border-right: 0">$${
                             item.total_price
                           }</td>
                       </tr>
                       `
                    )
                    .join("")}

                </tbody>
              </table>
            </div>
          </div>

          <div class="row mt-3" style="margin-top: 30px">
            <div class="col-md-12" style="padding: 0">
              <table class="table table-bordered">
                <tbody class="table-body">
                  <tr style="text-align: center">
                    <td colspan="4" class="text-right">
                      <span>Sub Total(USD)</span>
                    </td>
                    <td style="text-align: center; width: 150px">HSN/SAC</td>
                    <td style="width: 174px; border-right: 0">$${invoiceData.items
                      .reduce(
                        (acc, item) => acc + parseFloat(item.total_price),
                        0
                      )
                      .toFixed(2)}</td>
                  </tr>
                  <tr style="text-align: center">
                    <td colspan="5" class="text-right" style="height: 10px">
                      <strong>Total Amount(USD)</strong>
                    </td>
                    <td style="width: 174px; border-right: 0">
                      <strong>$${invoiceData.items
                        .reduce(
                          (acc, item) => acc + parseFloat(item.total_price),
                          0
                        )
                        .toFixed(2)}</strong>
                    </td>
                  </tr>
                  <tr style="text-align: center">
                    <td colspan="5" class="text-right">
                      <span>Payment Received(USD)</span>
                    </td>
                    <td style="border-right: 0">${
                      invoiceData.payment_received || "-"
                    }</td>
                  </tr>
                  <tr style="text-align: center">
                    <td colspan="5" class="text-right">
                      <span>Amount Due(USD)</span>
                    </td>
                    <td style="width: 174px; border-right: 0">$${invoiceData.items
                      .reduce(
                        (acc, item) => acc + parseFloat(item.total_price),
                        0
                      )
                      .toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <p style="font-size: 15px; font-weight: 600">
                Total Amount (in words): ${convertNumberToWords(
                  invoiceData.items.reduce(
                    (acc, item) => acc + parseFloat(item.total_price),
                    0
                  )
                )}Dollars only

              </p>
            </div>
          </div>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <p>For Naxtrre Technologies Private Limited</p>
            <div style="text-align: right; padding: 0">
              <table
                style="
                  border: 1px solid black;
                  border-collapse: collapse;
                  display: inline-block;
                  border-right: 0;
                "
              >
                <tr>
                  <td
                    style="
                      border: 1px solid black;
                      padding: 5px;
                      font-size: 15px;
                    "
                  >
                    PAN Number:
                  </td>
                  <td
                    style="
                      border: 1px solid black;
                      padding: 5px;
                      border-right: none;
                      font-size: 15px;
                      text-align: center;
                    "
                  >
                    AAICN9805F
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      border: 1px solid black;
                      padding: 5px;
                      font-size: 15px;
                    "
                  >
                    GST Number:
                  </td>
                  <td
                    style="
                      border: 1px solid black;
                      padding: 5px;
                      border-right: none;
                      font-size: 15px;
                    "
                  >
                    03AAICN9805F1ZL
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <p style="margin-bottom: 0.2rem">
                Payment by direct bank transfer is preferred and remittance
                shall be made to:
              </p>
              <p style="margin-top: 7px;">
                Account Holder Name:
                <strong>Technologies Private Limited</strong> , Account
                Number:<strong> 99999464764194</strong>, HDFC BANK LTD, (HDFC
                Bank, (SCO No 33 Phase :- 7 Industrial Area Mohali)) SWIFT Code:
                <strong>HDFCINBBXXX</strong> - IFSC Code:
                <strong>HDFC0006642</strong>. All disputes subject to SAS Nagar
                (Mohali) jurisdiction
              </p>
              <p style="font-weight: 600">
                Kindly send us back the Invoice copy duly Signed and with
                Company Seal.
              </p>
              <p>
                <span style="font-weight: 500; font-size: 14px"
                  >Receiver Name:</span
                ><br />
                <span style="font-weight: 500; font-size: 14px"
                  >Receiver Signature:</span
                >
                <br />
                <span style="font-weight: 500; font-size: 14px"
                  >Department:</span
                >
                <br />
                <span style="font-weight: 500; font-size: 14px"
                  >Received Date:</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <hr />
        <p>
          Website: <a href="http://www.naxtre.com">www.naxtre.com</a>, Email:
          <a href="mailto:contactus@naxtre.com">contactus@naxtre.com</a>,
          Contact No: 94647 64194
        </p>
      </div>
    </div>
  </body>
</html>

  
  `;

  try {
    // Launch Puppeteer to generate PDF
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer'
      ],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    // Generate PDF and store it in memory
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Convert Buffer to Readable Stream
    const bufferStream = new Readable();
    bufferStream.push(pdfBuffer);
    bufferStream.push(null);

    // Generate a unique name for the PDF using Date.now()
    const timestamp = Date.now();
    const publicId = `invoice_${timestamp}`;

    // Upload PDF to Cloudinary with custom public_id
    cloudinary.uploader
      .upload_stream(
        { resource_type: "raw", format: "pdf", public_id: publicId },
        (error, result) => {
          if (error) {
            console.error("Error uploading PDF to Cloudinary:", error);
            return res.status(500).send("Error uploading PDF to Cloudinary");
          }

          // Send the URL of the uploaded PDF back to the client
          res
            .status(200)
            .json({
              message: "Invoice generated and uploaded.",
              url: result.secure_url,
            });
        }
      )
      .end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});












app.post("/generate-wh-invoice", async (req, res) => {
  const invoiceData = req.body;

  const htmlContent = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tax Invoice</title>

    <style>
      body {
        background-color: #ffff;
        font-family: sans-serif;
        /* padding: 20px 0px; */
      }
      /* .background-container {
        background-image: url("invoice-header.jpg");
        background-repeat: no-repeat;
        background-size: 680px;
        margin-left: 20rem;
      } */

      p {
        font-size: 14px;
        padding-left: 5px;
        font-weight: 500;
        line-height: 1.4;
      }

      .invoice-box {
        max-width: 700px;
        margin: auto;
       
        /* border: 1px solid #1a1717; */
        background-color: #fff;
        padding-top: 7rem;
        border-top: 0;
      }

      .invoice-title {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        /* border: 2px solid #000; */
      }

      .table td,
      .table th {
        padding: 4px;
        vertical-align: middle;
        border: 2px solid #000;
        border-left: 0;
      }

      .table th {
        font-weight: 500;
      }
      /* 
      .table-bordered {
      } */

      .text-right {
        text-align: right;
      }

      .text-center {
        text-align: center;
      }

      .bank-details,
      .receiver-info {
        font-size: 14px;
        margin-top: 20px;
      }
      table td{
        font-size: 15px;
      }

      .amount-words {
        margin-top: 20px;
        font-weight: bold;
      }
      .bill-section-border {
        border-bottom: 2px solid #000;
        border-right: 2px solid #000;
      }
      .bill-div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
      }
  
    </style>
  </head>

  <body>
    <div class="background-container">
  

      <div class="invoice-box">
        <div style="border: 2px solid black; margin-top: 5px">
          <div class="bill-div" style="padding-bottom: 10px">
            <div
              class="col-md-5 bill-section-border"
              style="padding-left: 0px; padding-right: 0; padding-top: 5px"
            >
              <h6 style="border-bottom: 2px solid #000; margin-top: 0;margin-bottom: 2px;">
                <span
                  style="padding-left: 6px; font-size: 18px; font-weight: 500;"
                  >Bill to:</span
                >
              </h6>
              <p style="padding-left: 6px;margin: 0;">
                Kind Attn: Webomaze Pty Ltd<br />
                <span style="font-weight: 600;"> Webomaze Pty Ltd</span><br />
                Level 2/1 Southbank Blvd, Southbank, Victoria, Australia
              </p>
              <p style="font-weight: 600; padding-left: 6px">GST Number :</p>
            </div>

            <div>
              <h6
                style="
                  font-size: 18px;
                  margin-top: 5px;
                  margin-bottom: 6px;
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;
                "
              >
                <span style="padding-right: 8px; padding-top: 8px;font-weight: 500;"
                  >Tax Invoice</span
                >
              </h6>
              <table style="border-collapse: collapse">
                <tr>
                  <td style="border: 2px solid #000; padding: 5px">
                    Invoice Number:
                  </td>
                  <td
                    style="
                      border: 2px solid #000;
                      border-right: none;
                      padding: 5px;
                    "
                  >
                   ${invoiceData["invoice-no"]}
                  </td>
                </tr>
                <tr>
                  <td style="border: 2px solid #000; padding: 5px">
                    Issue Date:
                  </td>
                  <td
                    style="
                      border: 2px solid #000;
                      border-right: none;
                      padding: 5px;
                    "
                  >
                         ${new Date(
                           invoiceData["issue-date"]
                         ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td style="border: 2px solid #000; padding: 5px">
                    Due Date:
                  </td>
                  <td
                    style="
                      border: 2px solid #000;
                      border-right: none;
                      padding: 5px;
                    "
                  >
                         ${new Date(
                           invoiceData["due-date"]
                         ).toLocaleDateString()}
                  </td>
                </tr>
                <tr style="border-left: 2px solid #000">
                  <td style="padding-left: 3px">Ref: 23</td>
                </tr>
                <tr
                  style="
                    border-left: 2px solid #000;
                    border-bottom: 2px solid #000;
                  "
                >
                  <td style="padding-left: 3px">Dated: ${new Date(
                    invoiceData["issue-date"]
                  ).toLocaleDateString()}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12" style="padding: 0">
              <table class="table table-bordered">
                <thead style="text-align: center">
                  <tr>
                    <th>S.No.</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price(USD)</th>
                    <th style="border-right: 0; width: 174px">Total (USD)</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr style="text-align: center">
                  ${invoiceData.items
                    .map(
                      (item, index) => `
                       <tr style="text-align: center">
                           <td>${index + 1}</td>
                           <td> <strong>${item.title}</strong><br>${
                        item.description
                      }</td>
                           <td style="font-weight: 500">${item.quantity}</td>
                           <td>$${item.unit_price}</td>
                           <td style="font-weight: 500; border-right: 0">$${
                             item.total_price
                           }</td>
                       </tr>
                       `
                    )
                    .join("")}

                </tbody>
              </table>
            </div>
          </div>

          <div class="row mt-3" style="margin-top: 30px">
            <div class="col-md-12" style="padding: 0">
              <table class="table table-bordered">
                <tbody class="table-body">
                  <tr style="text-align: center">
                    <td colspan="4" class="text-right">
                      <span>Sub Total(USD)</span>
                    </td>
                    <td style="text-align: center; width: 150px">HSN/SAC</td>
                    <td style="width: 174px; border-right: 0">$${invoiceData.items
                      .reduce(
                        (acc, item) => acc + parseFloat(item.total_price),
                        0
                      )
                      .toFixed(2)}</td>
                  </tr>
                  <tr style="text-align: center">
                    <td colspan="5" class="text-right" style="height: 10px">
                      <strong>Total Amount(USD)</strong>
                    </td>
                    <td style="width: 174px; border-right: 0">
                      <strong>$${invoiceData.items
                        .reduce(
                          (acc, item) => acc + parseFloat(item.total_price),
                          0
                        )
                        .toFixed(2)}</strong>
                    </td>
                  </tr>
                  <tr style="text-align: center">
                    <td colspan="5" class="text-right">
                      <span>Payment Received(USD)</span>
                    </td>
                    <td style="border-right: 0">${
                      invoiceData.payment_received || "-"
                    }</td>
                  </tr>
                  <tr style="text-align: center">
                    <td colspan="5" class="text-right">
                      <span>Amount Due(USD)</span>
                    </td>
                    <td style="width: 174px; border-right: 0">$${invoiceData.items
                      .reduce(
                        (acc, item) => acc + parseFloat(item.total_price),
                        0
                      )
                      .toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <p style="font-size: 15px; font-weight: 600">
                Total Amount (in words): ${convertNumberToWords(
                  invoiceData.items.reduce(
                    (acc, item) => acc + parseFloat(item.total_price),
                    0
                  )
                )}Dollars only

              </p>
            </div>
          </div>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <p>For Naxtrre Technologies Private Limited</p>
            <div style="text-align: right; padding: 0">
              <table
                style="
                  border: 1px solid black;
                  border-collapse: collapse;
                  display: inline-block;
                  border-right: 0;
                "
              >
                <tr>
                  <td
                    style="
                      border: 1px solid black;
                      padding: 5px;
                      font-size: 15px;
                    "
                  >
                    PAN Number:
                  </td>
                  <td
                    style="
                      border: 1px solid black;
                      padding: 5px;
                      border-right: none;
                      font-size: 15px;
                      text-align: center;
                    "
                  >
                    AAICN9805F
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      border: 1px solid black;
                      padding: 5px;
                      font-size: 15px;
                    "
                  >
                    GST Number:
                  </td>
                  <td
                    style="
                      border: 1px solid black;
                      padding: 5px;
                      border-right: none;
                      font-size: 15px;
                    "
                  >
                    03AAICN9805F1ZL
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <p style="margin-bottom: 0.2rem">
                Payment by direct bank transfer is preferred and remittance
                shall be made to:
              </p>
              <p style="margin-top: 7px;">
                Account Holder Name:
                <strong>Technologies Private Limited</strong> , Account
                Number:<strong> 99999464764194</strong>, HDFC BANK LTD, (HDFC
                Bank, (SCO No 33 Phase :- 7 Industrial Area Mohali)) SWIFT Code:
                <strong>HDFCINBBXXX</strong> - IFSC Code:
                <strong>HDFC0006642</strong>. All disputes subject to SAS Nagar
                (Mohali) jurisdiction
              </p>
              <p style="font-weight: 600">
                Kindly send us back the Invoice copy duly Signed and with
                Company Seal.
              </p>
              <p>
                <span style="font-weight: 500; font-size: 14px"
                  >Receiver Name:</span
                ><br />
                <span style="font-weight: 500; font-size: 14px"
                  >Receiver Signature:</span
                >
                <br />
                <span style="font-weight: 500; font-size: 14px"
                  >Department:</span
                >
                <br />
                <span style="font-weight: 500; font-size: 14px"
                  >Received Date:</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </body>
</html>

  
  `;

  try {
    // Launch Puppeteer to generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    // Save PDF to a file in the 'invoices' directory
    const pdfPath = path.join(
      __dirname,
      "invoices",
      `invoice-${Date.now()}.pdf`
    );
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });
    await browser.close();

    // Send the path of the saved PDF back to the client
    res
      .status(200)
      .json({ message: "Invoice generated and saved.", path: pdfPath });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

// Ensure the 'invoices' directory exists
const invoicesDir = path.join(__dirname, "invoices");
if (!fs.existsSync(invoicesDir)) {
  fs.mkdirSync(invoicesDir);
}

function convertNumberToWords(amount) {
  // You can use a library like `number-to-words` or write your own conversion logic
  const numberToWords = require("number-to-words");
  return numberToWords.toWords(amount || 0);
}

app.get("/download-pdf/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "invoices", filename);

  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
