import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import uuid from "react-uuid";

import { calculatePunctuation } from "../../utils/calculatePunctuation";
import Modal from "../../components/modal";

interface FormData {
  id: string;
  nome: string;
  abates: string;
  position: string;
  punctuation: number;
}

export function FistBooyah() {
  const [alertErro, setAlertErro] = useState(false);
  const [titleAlertErro, setTitleAlertErro] = useState("");
  const [descriptionAlertErro, setDescriptionAlertErro] = useState("");

  const [name, setName] = useState("");
  const [totalKills, setTotalKills] = useState("0");
  const [selectedPosition, setSelectedPosition] = useState("");

  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [formDataList, setFormDataList] = useState<FormData[]>(() => {
    const storedData = localStorage.getItem("formDataList");
    return storedData ? JSON.parse(storedData) : [];
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);

  function displayModal(title: string, description: string) {
    setAlertErro(true);
    setTitleAlertErro(title);
    setDescriptionAlertErro(description);
  }

  function removeLine(id: string) {
    setDisabledOptions((prevDisabledOptions) => {
      const index = formDataList.findIndex((item) => item.id === id);
      const positionToRemove = formDataList[index].position;

      const newDisabledOptions = prevDisabledOptions.filter(
        (position) => position !== positionToRemove
      );

      return newDisabledOptions;
    });

    setFormDataList((prevList) => prevList.filter((item) => item.id !== id));
  }

  function editLineStatus(id: string) {
    const index = formDataList.findIndex((item) => item.id === id);
    if (index !== -1) {
      const editedItem = formDataList[index];
      setName(editedItem.nome);
      setTotalKills(editedItem.abates);
      setSelectedPosition(editedItem.position);
      setEditIndex(index);

      removeLine(id);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem("formDataList");
      if (storedData) {
        const storedFormDataList: FormData[] = JSON.parse(storedData);
        setFormDataList(storedFormDataList);
        const disabledPositions = storedFormDataList.map(
          (data) => data.position
        );
        setDisabledOptions(disabledPositions);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("formDataList", JSON.stringify(formDataList));
  }, [formDataList]);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const position = parseInt(selectedPosition);
    const abates = parseInt(totalKills);
    const punctuation = calculatePunctuation(position, abates);

    const isNameDuplicate = formDataList.some((data) => data.nome === name);
    const isPositionDuplicate = formDataList.some(
      (data) => data.position === selectedPosition
    );

    if (abates >= 44) {
      displayModal("Erro!", "44 abates é o limite de abate por personalizada");
    } else if (selectedPosition === "") {
      displayModal("Erro!", "Por favor, escolha uma posição válida.");
    } else if (isNameDuplicate) {
      displayModal("Erro!", "Você já colocou essa line na lista");
    } else if (isPositionDuplicate) {
      displayModal("Erro!", "Essa posição já foi selecionada em outra line");
    } else {
      const formData: FormData = {
        id: uuid(),
        nome: name,
        abates: totalKills,
        position: selectedPosition,
        punctuation: punctuation,
      };

      if (editIndex !== null) {
        const updatedList = [...formDataList];
        updatedList[editIndex] = formData;
        setFormDataList(updatedList);
        setEditIndex(null);
      } else {
        setFormDataList((prevList) => [...prevList, formData]);
      }

      setName("");
      setTotalKills("0");
      setSelectedPosition("");

      if (selectedPosition) {
        setDisabledOptions([...disabledOptions, selectedPosition]);
      }
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPosition(e.target.value);
  };

  return (
    <div className="ml-10 mr-10 mt-14">
      <Modal
        setAlertErro={setAlertErro}
        ShowModal={alertErro}
        description={descriptionAlertErro}
        title={titleAlertErro}
      />
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="nome"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nome da line
            </label>
            <input
              type="text"
              id="nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nome da line dos boteco"
              required
            />
          </div>
          <div>
            <label
              htmlFor="totalAbates"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Total de abates
            </label>
            <input
              type="number"
              id="totalAbates"
              value={totalKills}
              onChange={(e) => setTotalKills(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Digite a quantidade de abates, caso tenha sido te nenhuma o default e 0"
              required
            />
          </div>

          <div>
            <label
              htmlFor="position"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              posição que a line ficou
            </label>
            <select
              id="small"
              className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedPosition}
              onChange={handleSelectChange}
            >
              {[...Array(13).keys()].map((optionValue) => {
                const option = optionValue;
                const isDisabled = disabledOptions.includes(option.toString());

                return (
                  <option key={option} value={option} disabled={isDisabled}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="flex ">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Adicionar line
          </button>
          {formDataList.length < 2 ? null : (
            <button className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-5">
              Finalizar tabela
            </button>
          )}
        </div>
      </form>

      <div className="relative overflow-x-auto mt-10">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome da line
              </th>
              <th scope="col" className="px-6 py-3">
                Quantidade de abates da line
              </th>
              <th scope="col" className="px-6 py-3">
                Posição
              </th>
              <th scope="col" className="px-6 py-3">
                Pontuação
              </th>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {formDataList
              .sort((a, b) => b.punctuation - a.punctuation) // Ordena em ordem decrescente com base na pontuação
              .map((formData, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b dark:bg-gray-800 dark:border-gray-700`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {formData.nome}
                  </th>
                  <td className="px-6 py-4">{formData.abates}</td>
                  <td className="px-6 py-4">{formData.position}</td>
                  <td className="px-6 py-4">{formData.punctuation}</td>
                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => {
                        editLineStatus(formData.id);
                      }}
                    >
                      Editar
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => {
                        removeLine(formData.id);
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
