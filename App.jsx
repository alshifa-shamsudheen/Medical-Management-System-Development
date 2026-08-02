import { useMemo, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import {
  ClipboardList,
  Edit3,
  HeartPulse,
  Home as HomeIcon,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react";
import AddPatient from "./AddPatient.jsx";
import { getPatients, savePatients } from "./patientsStore.js";
import "./home.css";

function AppLayout({ children }) {
  return (
    <main className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand-link" aria-label="MediFlow home">
          <span className="brand-icon">
            <HeartPulse size={23} aria-hidden="true" />
          </span>
          <span>MediFlow</span>
        </Link>

        <nav className="nav-buttons" aria-label="Main navigation">
          <NavLink to="/" end>
            <HomeIcon size={18} aria-hidden="true" />
            Home
          </NavLink>
          <NavLink to="/addpatient">
            <UserPlus size={18} aria-hidden="true" />
            Add Patient
          </NavLink>
          <NavLink to="/patients">
            <ClipboardList size={18} aria-hidden="true" />
            Patient List
          </NavLink>
        </nav>
      </header>

      {children}
    </main>
  );
}

function Home() {
  const patients = getPatients();

  return (
    <AppLayout>
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-chip">
            <ShieldCheck size={16} aria-hidden="true" />
            Simple care management
          </span>
          <h1>Manage patients with a calm, clear workspace.</h1>
          <p>
            Add patient details, review records, search quickly, and keep daily
            hospital work organized without a confusing interface.
          </p>
          <div className="hero-actions">
            <Link to="/addpatient" className="primary-action">
              <UserPlus size={18} aria-hidden="true" />
              Add Patient
            </Link>
            <Link to="/patients" className="secondary-action">
              <UsersRound size={18} aria-hidden="true" />
              View Patient List
            </Link>
          </div>
        </div>

        <div className="summary-panel" aria-label="Patient summary">
          <div className="summary-card total">
            <span>Total patients</span>
            <strong>{patients.length}</strong>
          </div>
          <div className="summary-card">
            <span>Records ready</span>
            <strong>{Math.max(patients.length - 1, 0)}</strong>
          </div>
          <div className="summary-card wide">
            <span>Next step</span>
            <strong>Search, edit, or delete from Patient List</strong>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function PatientList() {
  const [patients, setPatients] = useState(() => getPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return patients;
    }

    return patients.filter((patient) =>
      [patient.name, patient.age, patient.gender, patient.disease, patient.doctorName, patient.mobileNumber]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [patients, searchTerm]);

  const beginEdit = (patient) => {
    setEditingId(patient.id);
    setDraft({ ...patient });
  };

  const updateDraft = (event) => {
    setDraft({ ...draft, [event.target.name]: event.target.value });
  };

  const saveEdit = (event) => {
    event.preventDefault();
    const nextPatients = patients.map((patient) =>
      patient.id === editingId ? draft : patient
    );
    setPatients(nextPatients);
    savePatients(nextPatients);
    setEditingId(null);
    setDraft(null);
  };

  const deletePatient = (id) => {
    const nextPatients = patients.filter((patient) => patient.id !== id);
    setPatients(nextPatients);
    savePatients(nextPatients);
  };

  return (
    <AppLayout>
      <section className="page-panel">
        <div className="section-heading">
          <span className="hero-chip">
            <ClipboardList size={16} aria-hidden="true" />
            Patient list
          </span>
          <h1>Find and manage every patient record.</h1>
        </div>

        <div className="search-bar">
          <Search size={20} aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, disease, doctor, gender, mobile..."
            aria-label="Search patients"
          />
        </div>

        <div className="patient-grid">
          {filteredPatients.map((patient) => (
            <article className="patient-card" key={patient.id}>
              {editingId === patient.id ? (
                <form onSubmit={saveEdit} className="edit-form">
                  <input name="name" value={draft.name} onChange={updateDraft} aria-label="Patient name" required />
                  <input name="age" value={draft.age} onChange={updateDraft} aria-label="Age" required />
                  <select name="gender" value={draft.gender} onChange={updateDraft} aria-label="Gender" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input name="disease" value={draft.disease} onChange={updateDraft} aria-label="Disease" required />
                  <input name="doctorName" value={draft.doctorName} onChange={updateDraft} aria-label="Doctor name" required />
                  <input name="mobileNumber" value={draft.mobileNumber} onChange={updateDraft} aria-label="Mobile number" required />
                  <div className="card-actions">
                    <button type="submit" className="small-primary">Save</button>
                    <button type="button" className="small-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="patient-card-top">
                    <div>
                      <h2>{patient.name}</h2>
                      <p>{patient.disease}</p>
                    </div>
                    <span>{patient.gender}</span>
                  </div>
                  <dl className="patient-details">
                    <div>
                      <dt>Age</dt>
                      <dd>{patient.age}</dd>
                    </div>
                    <div>
                      <dt>Doctor</dt>
                      <dd>{patient.doctorName}</dd>
                    </div>
                    <div>
                      <dt>Mobile</dt>
                      <dd>{patient.mobileNumber}</dd>
                    </div>
                  </dl>
                  <div className="card-actions">
                    <button type="button" className="small-primary" onClick={() => beginEdit(patient)}>
                      <Edit3 size={16} aria-hidden="true" />
                      Edit
                    </button>
                    <button type="button" className="small-danger" onClick={() => deletePatient(patient.id)}>
                      <Trash2 size={16} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="empty-state">
            No patient found. Try a different search or add a new patient.
          </div>
        )}
      </section>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addpatient" element={<AddPatient />} />
        <Route path="/patients" element={<PatientList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
