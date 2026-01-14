import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

export const getDeviceDetails = async (req, res) => {
  const { uid } = req.params;
  try {
    const dbDir = path.join(process.cwd(), "database");
    const filePath = path.join(dbDir, "demo.xlsx");

    // 1. Check if file exists
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "Database file not found" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet("Devices");

    if (!worksheet) {
      return res
        .status(404)
        .json({ success: false, message: "Worksheet 'Devices' not found" });
    }

    // 2. IMPORTANT: Define columns so you can use keys like "UIDNumber"
    worksheet.columns = [
      { header: "MAC Address", key: "MACAddress" },
      { header: "GPON SN", key: "GPONSN" },
      { header: "Serial Number", key: "SerialNumber" },
      { header: "Location", key: "location" },
      { header: "Invoice Number", key: "invoiceNumber" },
      { header: "Model Number", key: "modelNumber" },
      { header: "Entry Date", key: "entryDate" },
      { header: "History", key: "history" },
      { header: "UIDNumber", key: "UIDNumber" }, // This must match your Excel
    ];

    let foundData = null;
    const searchUID = uid.toString().trim();

    // 3. Search for the UID
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const cellValue = row.getCell("UIDNumber").value;
        const cellUID = cellValue ? cellValue.toString().trim() : "";

        if (cellUID === searchUID) {
          foundData = {
            MACAddress: row.getCell("MACAddress").value,
            GPONSN: row.getCell("GPONSN").value,
            SerialNumber: row.getCell("SerialNumber").value,
            modelNumber: row.getCell("modelNumber").value,
          };
        }
      }
    });

    if (foundData) {
      return res.json({ success: true, data: foundData });
    } else {
      return res.status(404).json({
        success: false,
        message: `UID ${uid} not found in database`,
      });
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error: " + err.message,
      });
  }
};
