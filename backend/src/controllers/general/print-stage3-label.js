import fs from "fs";
import path from "path";
import { exec } from "child_process";

export const printStage03label = async (req, res) => {
  try {
    const { modelNo, serialNumber, macAddress, gponNo } = req.body;

    if (!modelNo || !serialNumber || !macAddress || !gponNo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const escapeXML = (value) =>
      String(value)
        .trim()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const cleanModel = escapeXML(modelNo);
    const cleanSerial = escapeXML(serialNumber);
    const cleanMac = escapeXML(macAddress);
    const cleanGpon = escapeXML(gponNo);

    const bartendPath =
      "C:\\Program Files (x86)\\Seagull\\BarTender Suite\\bartend.exe";

    const labelPath =
      "C:\\Users\\DEEPAK\\Downloads\\Bartender Feb 2026\\Wifi 5\\stage-03.btw";

    const xmlPath = path.join(
      "D:",
      "PROJECTS",
      "demo",
      "airtel-router-app",
      "backend",
      "xml",
      "stage03.xml"
    );

    // Ensure directory exists
    const dir = path.dirname(xmlPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<XMLScript Version="2.0">
  <Command Name="PrintDeviceLabel">
    <Print>
      <Format>${labelPath}</Format>

      <PrintSetup>
        <IdenticalCopiesOfLabel>1</IdenticalCopiesOfLabel>
      </PrintSetup>

      <NamedSubString Name="ModelNo">
        <Value>${cleanModel}</Value>
      </NamedSubString>

      <NamedSubString Name="SerialNumber">
        <Value>${cleanSerial}</Value>
      </NamedSubString>

      <NamedSubString Name="MacAddress">
        <Value>${cleanMac}</Value>
      </NamedSubString>

      <NamedSubString Name="GponNo">
        <Value>${cleanGpon}</Value>
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
        message: "Label printed successfully",
      });
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};