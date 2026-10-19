# Handoff TF07 — Views e Elasticsearch

Para o agente local que continua o trabalho. **Apague este arquivo antes do merge em `main`** (não faz parte da entrega).

## Objetivo
Tela de tarefas (`src/resources/tasks.html`): modal para criar tarefa e atribuí-la a outro usuário, achado via `POST /users/search`. Enunciado completo em `aulas/07/TF07.md`. Entrega: link do repositório Git no Google Form (prazo 26/10/2026 23:59:59). O enunciado **não exige branch específica**.

## Estado atual
- Branch: `claude/tf-form-vjgcgf` (remoto `origin` = `gabrielreis354/unifaat-2026-frontend`, fork do professor `luan-tavares/unifaat-2026-frontend`).
- Commit da implementação: `3f4ce89` (sobre `2c0a742`, que é o `main` do professor, Aula 07).
- A branch foi realinhada ao `main` do professor (a história dele foi reescrita e a estrutura mudou para `src/resources`, `src/app`, `src/routes`). Backup do estado anterior, só local na máquina da sessão em nuvem: `backup/pre-realinhamento-tf07` (TF04 do aluno + merge antigo). Não existe no remoto.
- **Implementado, mas NÃO testado de ponta a ponta** (o ambiente em nuvem não tinha Docker daemon, Postgres nem Elasticsearch). Verificado apenas: `cd src && npx tsc --noEmit` OK e `npx vite build` OK.

## Arquivos da implementação (tudo em `src/resources/`)
- `tasks.html` — botão "Nova tarefa para outro usuário" (`data-bs-toggle="modal" data-bs-target="#assign-task-modal"`) e o modal com os ids do enunciado. Extras meus: `#assign-search-btn` (botão Buscar) e `#assign-task-feedback` (alerta de erro/aviso dentro do modal).
- `js/types/api.ts` — `UserSearchFilters`. (`User` já tinha `job_title`, `city`, `state`, `is_active`.)
- `js/api/userSearchApi.ts` — `POST /users/search` com `{ filters, page, limit }`.
- `js/render/userSearchResultsRender.ts` — lista (nome, e-mail, cargo, cidade/UF), total, botão "Escolher"; exporta `userSearchErrorRender` e `userSearchInfoRender`.
- `js/listeners/assignTaskModalListeners.ts` — busca (`userSearchApi(filtros, 1, 10)`), escolha, criação (`taskCreateApi(usuario.id, { name })`), fecha o modal clicando no `[data-bs-dismiss='modal']`, limpa campos, alerta de sucesso na página, recarrega a lista (`tasksListRender`) se o alvo for o próprio usuário. Erro de API fica no modal, sem fechar.
- `js/pages/tasks.ts` — chama `assignTaskModalListeners(idUser)`.

## Regras do enunciado (conferir em qualquer ajuste)
- Alvo achado por `POST /users/search`, nunca `GET /users`.
- Sem `any`; reaproveitar `User`, `Task`, `PaginatedResponse<T>`.
- Sem `else` (early return / continue / valor padrão).
- Padrão `js/api`, `js/render`, `js/listeners`, `js/pages`.
- Não alterar o backend; não quebrar login, lista, criar, concluir, excluir; só Bootstrap e Axios.
- Não mexer no `<script src="./js/teste.ts">` do `tasks.html` (é do professor).

## O que falta fazer
1. **Subir a stack e testar** (precisa de `.env` na raiz; copie de `.env.example` e preencha `POSTGRES_USER`, `POSTGRES_PASSWORD`, `RABBITMQ_USER`, `RABBITMQ_PASSWORD`, `JWT_SECRET`):
   ```
   docker compose up -d --build
   docker compose run --rm nodecommand-container migrate
   docker compose run --rm nodecommand-container seed
   ```
   App em http://localhost:8080, Swagger em http://localhost:8080/docs. Se o Vite/frontend não compilar, veja `docker compose logs nodevitecompiler-container nodevitehmr-container`.
2. **Roteiro de teste** (login `alice.souza@example.com` / `senha123`):
   - cidade "curitiba" → 4 usuários; cargo "devops"; UF "PE"; bio "elastic".
   - texto vazio → mensagem; busca sem resultado → mensagem; derrubar o Elastic/API → mensagem de erro.
   - criar tarefa para outra pessoa, entrar com ela (`senha123`) e conferir na lista.
   - sem nome ou sem usuário escolhido → não cria, mostra aviso.
   - criar para si mesma → lista recarrega.
   - modal fecha e limpa após sucesso; Cancelar também limpa.
   - regressão: login, listar, criar (painel "Nova Tarefa"), concluir, excluir.
3. **Pontos a verificar com atenção** (incertezas minhas):
   - O fechamento do modal usa `.click()` no botão Cancelar (não há `@types/bootstrap`). Confirmar que funciona e que `hidden.bs.modal` dispara o `reset` (se o evento não disparar, limpar campos direto no `submit`, que já chama `reset()`).
   - O alerta de sucesso é inserido logo após o `<header>`; confirmar que aparece bem visualmente.
   - Aviso do Vite sobre `taskCreateApi` importado estático e dinâmico — é só warning (o import dinâmico está em `tasksListeners.ts`, do professor).
   - Conferir se o campo "UF" e a busca por `state` casam como esperado no Elasticsearch ("PE").
4. Corrigir o que falhar, rodar `cd src && npx tsc --noEmit`, commitar e dar push em `claude/tf-form-vjgcgf`.
5. **Remover este `HANDOFF-TF07.md`**, fazer merge da branch na `main` do fork (`gabrielreis354/unifaat-2026-frontend`) e dar push. Só com autorização do aluno (Gabriel).
6. Entregar: o link do repositório (https://github.com/gabrielreis354/unifaat-2026-frontend) no formulário https://docs.google.com/forms/d/e/1FAIpQLSdJEQMCfZT5hO48KjOPJpwLvxU4O7_JJaMZPW3w5OmqTCxZUQ/viewform — isso é do aluno, não envie por ele.
