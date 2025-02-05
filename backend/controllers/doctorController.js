import doctorModel from "../models/doctorModel.js";


const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }  
    );

    res.json({ success: true, message: "Availability Updated", doctor: updatedDoctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password -email']);  

        res.json({ success: true, doctors}); 
    } catch (error) {
        console.error(error.message);  
        res.status(500).json({ success: false, message: error.message }); 
    }
};


export { changeAvailability ,getDoctors };
