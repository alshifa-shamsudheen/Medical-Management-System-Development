const STORAGE_KEY = "mediflow-patients";

const starterPatients = [
  {
    id: "sample-1",
    name: "Ananya Sharma",
    age: "34",
    gender: "Female",
    disease: "Migraine",
    doctorName: "Dr. Mehta",
    mobileNumber: "9876543210",
  },
  {
    id: "sample-2",
    name: "Rahul Verma",
    age: "46",
    gender: "Male",
    disease: "Diabetes",
    doctorName: "Dr. Kapoor",
    mobileNumber: "9123456780",
  },
];

export function getPatients() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(starterPatients));
    return starterPatients;
  }

  try {
    return JSON.parse(stored);
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(starterPatients));
    return starterPatients;
  }
}

export function savePatients(patients) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}
