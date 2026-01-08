import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

export const storeDeviceEntry = async (req, res) => {
  try {
    const {
      MACAddress,
      GPONSN,
      SerialNumber,
      location,
      invoiceNumber,
      modelNumber,
    } = req.body;

    const dbDir = path.join(process.cwd(), "database");
    const filePath = path.join(dbDir, "device_entries.xlsx");

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    let worksheet;

    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet("Devices");
    }

    if (!worksheet) {
      worksheet = workbook.addWorksheet("Devices");

      worksheet.columns = [
        { header: "MAC Address", key: "MACAddress", width: 25 },
        { header: "GPON SN", key: "GPONSN", width: 25 },
        { header: "Serial Number", key: "SerialNumber", width: 25 },
        { header: "Location", key: "location", width: 20 },
        { header: "Invoice Number", key: "invoiceNumber", width: 20 },
        { header: "Model Number", key: "modelNumber", width: 20 },
        { header: "Entry Date", key: "entryDate", width: 25 },
      ];

      worksheet.getRow(1).font = { bold: true };
    }

    worksheet.addRow({
      MACAddress,
      GPONSN,
      SerialNumber,
      location,
      invoiceNumber,
      modelNumber,
      entryDate: new Date().toLocaleString("en-IN"),
    });

    await workbook.xlsx.writeFile(filePath);

    return res.status(201).json({
      success: true,
      message: "Device entry stored successfully",
    });
  } catch (error) {
    console.error("❌ Excel Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
