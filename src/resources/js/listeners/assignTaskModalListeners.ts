import tasksListRender from "../render/tasksListRender";
import userSearchResultsRender, { userSearchErrorRender, userSearchInfoRender } from "../render/userSearchResultsRender";
import { taskCreateApi } from "../api/taskCreateApi";
import { userSearchApi } from "../api/userSearchApi";
import type { User, UserSearchFilters } from "../types/api";

type SearchField = keyof UserSearchFilters;

const SEARCH_FIELDS: SearchField[] = ["name", "email", "job_title", "city", "state", "bio"];

function isSearchField(value: string): value is SearchField {
  return (SEARCH_FIELDS as string[]).includes(value);
}

function modalFeedbackRender(element: HTMLElement | null, text: string, className: string): void {
  if (!element) return;

  element.className = `alert py-2 small ${className}`;
  element.innerText = text;
}

function pageSuccessRender(text: string): void {
  const alertElement = document.createElement("div");
  alertElement.classList.add("alert", "alert-success", "alert-dismissible", "container", "mt-3", "mb-0");
  alertElement.setAttribute("role", "alert");
  alertElement.innerText = text;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("btn-close");
  closeButton.setAttribute("data-bs-dismiss", "alert");
  closeButton.setAttribute("aria-label", "Fechar");
  alertElement.append(closeButton);

  document.querySelector("header")?.after(alertElement);
}

export default function assignTaskModalListeners(idUser: number): void {
  const modalElement = document.querySelector<HTMLElement>("#assign-task-modal");
  const nameInput = document.querySelector<HTMLInputElement>("#assign-task-name");
  const fieldSelect = document.querySelector<HTMLSelectElement>("#assign-search-field");
  const valueInput = document.querySelector<HTMLInputElement>("#assign-search-value");
  const searchButton = document.querySelector<HTMLButtonElement>("#assign-search-btn");
  const resultsElement = document.querySelector<HTMLElement>("#assign-search-results");
  const selectedElement = document.querySelector<HTMLElement>("#assign-selected-user");
  const feedbackElement = document.querySelector<HTMLElement>("#assign-task-feedback");
  const submitButton = document.querySelector<HTMLButtonElement>("#assign-task-submit");

  if (!modalElement || !nameInput || !fieldSelect || !valueInput || !searchButton) return;
  if (!resultsElement || !selectedElement || !submitButton) return;

  let selectedUser: User | null = null;

  const selectedRender = (): void => {
    selectedElement.innerText = selectedUser
      ? `Atribuir para: ${selectedUser.name} (${selectedUser.email})`
      : "Nenhum usuário escolhido.";
  };

  const reset = (): void => {
    selectedUser = null;
    nameInput.value = "";
    valueInput.value = "";
    resultsElement.innerHTML = "";
    selectedRender();
    modalFeedbackRender(feedbackElement, "", "d-none");
  };

  const search = async (): Promise<void> => {
    const text = valueInput.value.trim();

    if (!text) {
      userSearchErrorRender(resultsElement, "Digite um texto para buscar.");
      return;
    }

    if (!isSearchField(fieldSelect.value)) {
      userSearchErrorRender(resultsElement, "Escolha um campo de busca válido.");
      return;
    }

    const filters: UserSearchFilters = { [fieldSelect.value]: text };

    userSearchInfoRender(resultsElement, "Buscando...");

    try {
      const result = await userSearchApi(filters, 1, 10);

      userSearchResultsRender(resultsElement, result.data, result.total, (user) => {
        selectedUser = user;
        selectedRender();
      });
    } catch (error) {
      userSearchErrorRender(resultsElement, "Erro ao buscar usuários. Tente novamente.");
      console.error(error);
    }
  };

  const submit = async (): Promise<void> => {
    const taskName = nameInput.value.trim();

    if (!taskName) {
      modalFeedbackRender(feedbackElement, "Digite o nome da tarefa.", "alert-warning");
      return;
    }

    if (!selectedUser) {
      modalFeedbackRender(feedbackElement, "Escolha um usuário para receber a tarefa.", "alert-warning");
      return;
    }

    const targetUser = selectedUser;

    try {
      await taskCreateApi(targetUser.id, { name: taskName });
    } catch (error) {
      modalFeedbackRender(feedbackElement, "Erro ao criar a tarefa. Tente novamente.", "alert-danger");
      console.error(error);
      return;
    }

    modalElement.querySelector<HTMLButtonElement>("[data-bs-dismiss='modal']")?.click();
    reset();
    pageSuccessRender(`Tarefa "${taskName}" criada para ${targetUser.name}.`);

    if (targetUser.id !== idUser) return;

    await tasksListRender(idUser);
  };

  searchButton.addEventListener("click", search);
  valueInput.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    search();
  });
  submitButton.addEventListener("click", submit);
  modalElement.addEventListener("hidden.bs.modal", reset);

  selectedRender();
}
