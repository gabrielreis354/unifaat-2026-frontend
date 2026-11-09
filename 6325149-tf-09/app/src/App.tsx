import { useState } from "react"
import { UserList } from "./components/UserList"
import { UserTasks } from "./components/UserTasks"
import type { User } from "./types"

function App() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    function handleChoose(user: User) {
        setSelectedUser(user)
    }

    return (
        <main>
            <header>
                <h1>Usuários e Tasks</h1>
                <p className="tagline">Arquivos da Aliança Rebelde</p>
            </header>
            <div className="columns">
                <UserList selectedId={selectedUser?.id ?? null} onChoose={handleChoose} />
                {selectedUser === null ? (
                    <p className="empty">Escolha um usuário para consultar as tasks.</p>
                ) : (
                    <UserTasks key={selectedUser.id} user={selectedUser} />
                )}
            </div>
        </main>
    )
}

export default App
