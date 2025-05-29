import React, { useState, useEffect } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { FcTodoList } from "react-icons/fc";
import axios from 'axios';
import { motion } from "framer-motion";

const CreateTache = () => {
  const [employees, setEmployees] = useState([]);
  const [task, setTask] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [query, setQuery] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [limiteDate, setLimiteDate] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8081/api/employer/')
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des employeurs!", error);
      });
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setCreationDate(today);
  }, []);

  const handleChange = (event) => {
    setTask(event.target.value);
  };

  const handleLimiteDateChange = (event) => {
    setLimiteDate(event.target.value);
  };
  const today2 = new Date().toISOString().split('T')[0]; // Résultat : "2025-02-04"
    const creerNotif=async(cin)=>{
      try{
        const response = await axios.post(`http://localhost:8081/api/notifications/creer/${cin}`,  null,
          {
            params: {
              description: `Nouvelle tâche assignée`,
              dateDepose: today2 ,
            }
          });
        console.log('Notification créé:', response.data);
      } catch (error) {
        console.error('Erreur lors de la création du Notification:', error);
      }
    }

  const creerTache = async () => {
    if (selectedEmployee && task && limiteDate) {
      try {
        const response = await axios.post(`http://localhost:8081/api/taches/creer/${selectedEmployee.cin}`, null, {
          params: {
            description: task,
            dateLimite: limiteDate,
            dateDepose: creationDate
          }
        });
        creerNotif(selectedEmployee.cin);
        setSelectedEmployee(null);
        setQuery("");
        setLimiteDate("");
        setTask("");
        console.log('Tâche créée:', response.data);
      } catch (error) {
        console.error('Erreur lors de la création de la tâche:', error);
      }
    } else {
      alert("Veuillez remplir tous les champs obligatoires.");
    }
  };

  const filteredEmployees = query === ""
    ? employees
    : employees.filter((employee) =>
        `${employee.nom} ${employee.prenom} ${employee.cin}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );

  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <FcTodoList className="text-blue-500" size={50} />
          <h2 className="text-2xl font-bold text-blue-600">Créer une tâche</h2>
        </div>

        <Combobox value={selectedEmployee} onChange={setSelectedEmployee}>
          <div className="relative">
            <Combobox.Input
              className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              placeholder="Rechercher un employé..."
              displayValue={(employee) => employee ? `${employee.nom} ${employee.prenom}` : ""}
              onChange={(event) => setQuery(event.target.value)}
            />

            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
            </Combobox.Button>

            {filteredEmployees.length > 0 && (
              <Combobox.Options className="absolute z-10 mt-2 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-sm ring-1 ring-blue-600 ring-opacity-5">
                {filteredEmployees.map((employee) => (
                  <Combobox.Option
                    key={employee.cin}
                    value={employee}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-2 ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div className="flex items-center">
                        {selected && (
                          <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                        )}
                        <span className={`truncate ${selected ? "font-semibold" : "font-normal"}`}>
                          {employee.nom} {employee.prenom} ({employee.cin})
                        </span>
                      </div>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}

            {filteredEmployees.length === 0 && (
              <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-lg py-2 px-4 text-sm text-gray-500">
                Aucun employé trouvé.
              </div>
            )}
          </div>
        </Combobox>

        <div className="mt-6">
          <label htmlFor="task" className="block text-lg font-medium text-blue-600">
            Tâche
          </label>
          <textarea
            id="task"
            className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            rows={3}
            placeholder="Décrivez la tâche..."
            value={task}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium text-blue-600 mb-2">
            Date de Création
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 focus:outline-none"
            value={creationDate}
            readOnly
            required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="deadline" className="block text-lg font-medium text-blue-600">
            Date limite
          </label>
          <input
            required
            id="deadline"
            type="date"
            value={limiteDate}
            onChange={handleLimiteDateChange}
            min={creationDate} // Empêche de choisir une date antérieure à la date de création
            className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={creerTache}
            className="flex items-center bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition mt-6"
          >
            Créer la tâche
          </button>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default CreateTache;
