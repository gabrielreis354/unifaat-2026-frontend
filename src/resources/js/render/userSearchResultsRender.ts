import type { User } from "../types/api";

function userLocation(user: User): string {
  return [user.city, user.state].filter(Boolean).join("/");
}

function userSearchMessageRender(container: HTMLElement, text: string, className: string): void {
  container.innerHTML = "";

  const messageElement = document.createElement("div");
  messageElement.classList.add("small", className);
  messageElement.innerText = text;

  container.append(messageElement);
}

export function userSearchErrorRender(container: HTMLElement, text: string): void {
  userSearchMessageRender(container, text, "text-danger");
}

export function userSearchInfoRender(container: HTMLElement, text: string): void {
  userSearchMessageRender(container, text, "text-muted");
}

export default function userSearchResultsRender(
  container: HTMLElement,
  users: User[],
  total: number,
  onSelect: (user: User) => void
): void {
  if (users.length === 0) {
    userSearchInfoRender(container, "Nenhum usuário encontrado.");
    return;
  }

  container.innerHTML = "";

  const totalElement = document.createElement("div");
  totalElement.classList.add("small", "text-muted", "mb-2");
  totalElement.innerText = `${total} usuário(s) encontrado(s)`;

  const ulElement = document.createElement("ul");
  ulElement.classList.add("list-group");

  users.forEach((user) => {
    const liElement = document.createElement("li");
    liElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "gap-2");

    const infoElement = document.createElement("div");
    infoElement.classList.add("small");

    const nameElement = document.createElement("strong");
    nameElement.innerText = user.name;

    const detailsElement = document.createElement("div");
    detailsElement.classList.add("text-muted");
    detailsElement.innerText = [user.email, user.job_title, userLocation(user)].filter(Boolean).join(" · ");

    infoElement.append(nameElement, detailsElement);

    const chooseButton = document.createElement("button");
    chooseButton.type = "button";
    chooseButton.classList.add("btn", "btn-outline-primary", "btn-sm");
    chooseButton.innerText = "Escolher";
    chooseButton.addEventListener("click", () => onSelect(user));

    liElement.append(infoElement, chooseButton);
    ulElement.append(liElement);
  });

  container.append(totalElement, ulElement);
}
