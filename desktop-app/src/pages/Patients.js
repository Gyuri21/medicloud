import React, { useEffect, useState } from "react";
import API from "../utils/API";
import "./Patients.css";
import { useNavigate } from "react-router-dom";
import { reloadOnExpiration, logout } from "../utils/authorization";
import { VscTrash } from "react-icons/vsc";

function Modal(props) {
  useEffect(() => {
    getPatientData();
  }, []);

  const [patientBloodTestResults, setPatientBloodTestResults] = useState([]);

  function getPatientData() {
    API.post("/selectPatient", {
      id: props.data.patient_id,
    }).then((result) => {
      setPatientBloodTestResults(result.data);
    });
  }
  const [selected, setSelected] = useState([]);

  function selectOne(arg) {
    setSelected(arg);
  }

  function deleteBloodtests(selected) {
    console.log(selected.blood_tests_taken_id);
    API.post("/delete_bloodtests_taken", {
      id: selected.blood_tests_taken_id,
    }).then((result) => {
      getPatientData();
    });
  }

  return (
    <div className="modalData">
      <div className="modalData-content">
        <h1>{props.data.patient_name}</h1>
        <h1>{props.data.patient_blood_type}</h1>
        <button onClick={props.onQuit} className="close-modal">
          X
        </button>
        <div className="modal-table-container">
          <table>
            <thead>
              <tr>
                <th>Név</th>
                <th>Mértékegység</th>
                <th>Ideális érték</th>
                <th>Mért érték</th>
                <th>Dátum</th>
                <th>Torles</th>
              </tr>
            </thead>
            <tbody>
              {patientBloodTestResults.map((e, index) => {
                return (
                  <tr
                    key={index}
                    onClick={() => {
                      selectOne(e);
                    }}
                  >
                    <td>{e.blood_test_component_name}</td>
                    <td>{e.blood_test_component_measurement}</td>
                    <td>{e.blood_test_component_normal_range}</td>
                    <td>{e.blood_tests_component_value}</td>
                    <td>{e.blood_tests_taken_date.split("T")[0]}</td>
                    <td>
                      <button className="" onClick={() => deleteBloodtests(e)}>
                        <VscTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Patients() {
  const sizes = ["X-Small", "Small", "Medium", "Large", "X-Large", "2X-Large"];
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [modalOn, setModalOn] = useState(false);

  function selectOne(arg) {
    setSelected(arg);
  }
  function openModalUp() {
    if (selected.patient_name) {
      setModalOn(true);
    } else {
      setModalOn(false);
    }
  }
  function closeModal() {
    setModalOn(false);
  }

  useEffect(() => {
    getPatients();
  }, []);

  function getPatients() {
    API.get("/patients").then((result) => {
      setPatients(result.data);
    });
  }

  const [value, setValue] = useState("");
  const [tableFilter, setTableFilter] = useState([]);

  const filterData = (e) => {
    if (e.target.value != "") {
      setValue(e.target.value);
      const filterTable = patients.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
      setTableFilter([...filterTable]);
    } else {
      setValue(e.target.value);
      setPatients([...patients]);
    }
  };
  let navigate = useNavigate();

  function navigatetoAddNew() {
    navigate("/patients/AddNew");
  }

  function deletePatient(selected) {
    console.log(selected.patient_id);
    API.post("/delete-patient", {
      id: selected.patient_id,
    }).then((result) => {
      getPatients();
    });
  }

  function deleteAuth(selected){
    console.log(selected.patient_id);
    API.post("/delete_Auth", {
      id: selected.patient_id,
    }).then((result) => {
      getPatients();
      deletePatient(selected);
    });
  }

  return (
    <div className="patients">
      <div className="patients-page">
        <div className="patients-top-container">
          <div className="patients-top-left"></div>
          <div className="patients-top-right">
            <button onClick={navigatetoAddNew} className="NewPatientBtn">
              Uj felvetel
            </button>
            <button onClick={openModalUp} className="NewPatientBtn">
              Kivalaszt
            </button>
            <input placeholder="Kereses" value={value} onChange={filterData} />
            {modalOn && <Modal data={selected} onQuit={closeModal} />}
          </div>
        </div>
        <div className="patients-mid-container">
          <div className="patients-left"> </div>
          <div className="patients-table-container">
            <table>
              <thead>
                <tr>
                  <th>Vercsoport</th>
                  <th>Név</th>
                  <th>Nem</th>
                  <th>Taj</th>
                  <th>Születési idő</th>
                  <th>Lakcim</th>
                  <th>Telefonszám</th>
                  <th>Emailcim</th>
                  <th>Torles</th>
                </tr>
              </thead>
              <tbody>
                {value.length > 0
                  ? tableFilter.map((patient, index) => {
                      return (
                        <tr
                          key={index}
                          onClick={() => {
                            selectOne(patient);
                          }}
                        >
                          <td>{patient.patient_blood_type}</td>
                          <td>{patient.patient_name}</td>
                          <td>{patient.patient_gender}</td>
                          <td>{patient.patient_taj}</td>
                          <td>{patient.patient_birthdate.split("T")[0]}</td>
                          <td>{patient.patient_address}</td>
                          <td>{patient.patient_phone}</td>
                          <td>{patient.patient_email}</td>

                          <td>
                            <button
                              className=""
                              onClick={() => deleteAuth(patient)}
                            >
                              <VscTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  : patients.map((patient, index) => {
                      return (
                        <tr
                          key={index}
                          onClick={() => {
                            selectOne(patient);
                          }}
                        >
                          <td>{patient.patient_blood_type}</td>
                          <td>{patient.patient_name}</td>
                          <td>{patient.patient_gender}</td>
                          <td>{patient.patient_taj}</td>
                          <td>{patient.patient_birthdate.split("T")[0]}</td>
                          <td>{patient.patient_address}</td>
                          <td>{patient.patient_phone}</td>
                          <td>{patient.patient_email}</td>

                          <td>
                            <button
                              className=""
                              onClick={() => deleteAuth(patient)}
                            >
                              <VscTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
          <div className="patients-right"></div>
        </div>
      </div>
    </div>
  );
}

export default Patients;
