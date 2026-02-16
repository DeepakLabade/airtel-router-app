import path from "path";
import ExcelJS from "exceljs";

export const storeStageFourData = async (req, res) => {
  try {
    const { SerialNumber, BoxNumber, userName } = req.body;

    if (!SerialNumber) {
      return res.status(400).json({
        success:false,
        message:"SerialNumber required"
      });
    }

    const filePath = path.join(process.cwd(),"database","demo.xlsx");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const sheet = workbook.getWorksheet("Devices");

    let foundRow = null;

    // Find serial in column 1
    sheet.eachRow((row,rowNumber)=>{
      if(rowNumber>1){
        if(row.getCell(1).value == SerialNumber){
          foundRow = row;
        }
      }
    });

    if(!foundRow){
      return res.status(404).json({
        success:false,
        message:"Serial not found"
      });
    }

    // Write Stage 4 data
    foundRow.getCell(7).value = BoxNumber;
    foundRow.getCell(8).value = new Date().toLocaleString();
    foundRow.getCell(9).value = userName;

    await workbook.xlsx.writeFile(filePath);

    res.json({
      success:true,
      message:"Stage 4 Saved Successfully"
    });

  } catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};
