import path from "path";
import fs from "fs";
import { exec } from "child_process";

export const printUIDLabel = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "UID is required",
      });
    }

    const cleanUID = String(uid).trim();  

    const bartendPath =
      "C:\\Program Files (x86)\\Seagull\\BarTender Suite\\bartend.exe";

    const labelPath =
      "C:\\Users\\DEEPAK\\Downloads\\Bartender Feb 2026\\demo.btw";

    const xmlPath =
      "C:\\Users\\DEEPAK\\Downloads\\Bartender Feb 2026\\print.xml";

    // 🔥 Create XML Script
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<XMLScript Version="2.0">
  <Command Name="PrintLabel">
    <Print>
      <Format>${labelPath}</Format>
      <NamedSubString Name="UID">
        <Value>${cleanUID}</Value>
      </NamedSubString>
    </Print>
  </Command>
</XMLScript>`;

    // Write XML file
    fs.writeFileSync(xmlPath, xmlContent);

    const command = `"${bartendPath}" /XMLScript="${xmlPath}"`;

    console.log("Executing:", command);

    exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("Exec Error:", error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      return res.json({
        success: true,
        message: `Label printed for UID ${cleanUID}`,
      });
    });
  } catch (err) {
    console.error("Unexpected Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
