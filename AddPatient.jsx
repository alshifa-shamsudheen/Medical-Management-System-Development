import { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Save, UserPlus } from "lucide-react";
import { getPatients, savePatients } from "./patientsStore.js";

const emptyPatient = {
  name: "",
  age: "",
  gender: "",
  disease: "",
  doctorName: "",
  mobileNumber: "",
};

const AddPatient = () => {
  const [formData, setFormData] = useState(emptyPatient);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newPatient = {
      ...formData,
      id: crypto.randomUUID(),
    };
    const patients = [newPatient, ...getPatients()];

    savePatients(patients);
    setFormData(emptyPatient);
    setMessage("Patient added successfully.");
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand-link" aria-label="MediFlow home">
          <span className="brand-icon">
            <UserPlus size={23} aria-hidden="true" />
          </span>
          <span>MediFlow</span>
        </Link>

        <nav className="nav-buttons" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/addpatient" className="active">Add Patient</Link>
          <Link to="/patients">Patient List</Link>
        </nav>
      </header>

      <section className="page-panel form-page">
        <div className="section-heading">
          <span className="hero-chip">
            <UserPlus size={16} aria-hidden="true" />
            Add patient
          </span>
          <h1>Enter patient details clearly.</h1>
          <p>Use simple fields so the record is easy to understand later.</p>
        </div>

        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit} className="patient-form">
          <label>
            Patient Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter patient name"
              required
            />
          </label>

          <label>
            Age
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
              min="1"
              required
            />
          </label>

          <label>
            Gender
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Disease
            <input
              type="text"
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              placeholder="Enter disease"
              required
            />
          </label>

          <label>
            Doctor Name
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="Enter doctor name"
              required
            />
          </label>

          <label>
            Mobile Number
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter mobile number"
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="primary-action">
              <Save size={18} aria-hidden="true" />
              Save Patient
            </button>
            <Link to="/patients" className="secondary-action">
              <ClipboardList size={18} aria-hidden="true" />
              View Patient List
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AddPatient;
