const applicants = require("../model/applicantModel");

// add application
exports.addApplicationController = async(req,res) =>{
    const {fullname,jobtitle,qualification,email,phone,coverletter} = req.body
    const resume = req.file.filename

    //console.log(fullname,jobtitle,qualification,email,phone,coverletter);
    //console.log(resume);
    
    try {
        const existingApplicant = await applicants.findOne({jobtitle,email})
        if(existingApplicant){
            res.status(400).json("You have already applied for this post")
        } else {
            const newApplicant = new applicants({fullname,jobtitle,qualification,email,phone,coverletter, resume
            })
            await newApplicant.save()
            res.status(200).json(newApplicant)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//get all applications
exports.getAllApplicationsController =  async(req,res) =>{
try {
    const allApplications = await applicants.find()
    res.status(200).json(allApplications)
} catch (error) {
     res.status(500).json(error)
}
}