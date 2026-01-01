import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

export const storeMasterForm = async (req, res) => {
  try {
    const {
      location,
      modelName,
      itemCode,
      invoiceNumber,
      MONumber,
      invoiceDate,
      shipmentDate,
      receivedDate,
      lotQty,
      invoiceQty,
    } = req.body;

    const dbDir = path.join(process.cwd(), "database");
    const filePath = path.join(dbDir, "demo.xlsx");

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    let worksheet;

    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet("Users");
    }

    if (!worksheet) {
      worksheet = workbook.addWorksheet("Users");
    }

    worksheet.columns = [
      { header: "Location", key: "location", width: 20 },
      { header: "Model Name", key: "modelName", width: 25 },
      { header: "Item Code", key: "itemCode", width: 20 },
      { header: "Invoice Number", key: "invoiceNumber", width: 20 },
      { header: "MO Number", key: "MONumber", width: 20 },
      { header: "Invoice Date", key: "invoiceDate", width: 20 },
      { header: "Shipment Date", key: "shipmentDate", width: 20 },
      { header: "Received Date", key: "receivedDate", width: 20 },
      { header: "Lot Qty", key: "lotQty", width: 15 },
      { header: "Invoice Qty", key: "invoiceQty", width: 15 },
    ];

    if (worksheet.rowCount === 0) {
      worksheet.getRow(1).font = { bold: true };
    }

    worksheet.addRow({
      location,
      modelName,
      itemCode,
      invoiceNumber,
      MONumber,
      invoiceDate: invoiceDate ? String(invoiceDate) : "",
      shipmentDate: shipmentDate ? String(shipmentDate) : "",
      receivedDate: receivedDate ? String(receivedDate) : "",
      lotQty,
      invoiceQty,
    });

    await workbook.xlsx.writeFile(filePath);

    return res.status(201).json({
      success: true,
      message: "Data stored successfully",
    });
  } catch (error) {
    console.error("❌ Excel Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
