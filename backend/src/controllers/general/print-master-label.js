import fs from "fs";
import path from "path";
import { exec } from "child_process";

export const printMasterLabel = async (req, res) => {
  try {
    const { gponNumbers } = req.body;

    // ✅ Validate input
    // if (!Array.isArray(gponNumbers) || gponNumbers.length !== 9) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Exactly 9 GPON numbers required",
    //   });
    // }

    // ✅ XML Escape
    const escapeXML = (value) =>
      String(value)
        .trim()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
      
      
              const qrData = gponNumbers.join("|");

    const bartendPath =
      "C:\\Program Files (x86)\\Seagull\\BarTender Suite\\bartend.exe";

    // ✅ MASTER LABEL FILE
    const labelPath =
      "C:\\Users\\DEEPAK\\Downloads\\Bartender Feb 2026\\wIFI 6\\80X120  Wifi 6 MASTER PRINT Nov 2025.btw";

    const xmlPath = path.join(
      "D:",
      "PROJECTS",
      "demo",
      "airtel-router-app",
      "backend",
      "xml",
      "masterLabel.xml",
    );

    fs.mkdirSync(path.dirname(xmlPath), {
      recursive: true,
    });

    // ✅ Generate GPON fields dynamically
    let gponXML = "";

    gponNumbers.forEach((gpon, index) => {
      gponXML += `
      <NamedSubString Name="Gpon${index + 1}">
        <Value>${escapeXML(gpon)}</Value>
      </NamedSubString>`;
    });

    // ✅ XML Script
   const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<XMLScript Version="2.0">
  <Command Name="MasterLabelPrint">
    <Print>

      <Format><![CDATA[${labelPath}]]></Format>

      <PrintSetup>
        <IdenticalCopiesOfLabel>1</IdenticalCopiesOfLabel>
      </PrintSetup>

      ${gponXML}

      <NamedSubString Name="MasterQR">
        <Value>${qrData}</Value>
      </NamedSubString>

    </Print>
  </Command>
</XMLScript>`;

    fs.writeFileSync(xmlPath, xmlContent);

    const command = `"${bartendPath}" /XMLScript="${xmlPath}"`;

    exec(command, { timeout: 15000 }, (error) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      return res.json({
        success: true,
        message: "Master label printed successfully",
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
