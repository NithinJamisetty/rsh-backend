const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const enquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  status:{
    type: String,
    default:"Pending"
  }
  createdAt: { type: Date, default: Date.now }
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);

app.post("/enquiry", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.json({ message: "Enquiry Submitted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving enquiry" });
  }
});

app.get("/", (req, res) => {
  res.send("RSH Enquiry API Running");
});


app.get("/enquiries", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching enquiries" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

app.delete("/enquiry/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Enquiry.findByIdAndDelete(id);
    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});
app.put("/enquiry/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Enquiry.findByIdAndUpdate(id, { status: "Contacted" });
    res.json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});
