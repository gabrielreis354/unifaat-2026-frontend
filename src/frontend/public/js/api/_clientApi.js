const apiClient = axios.create({
    baseURL: "http://localhost:8081",
    withCredentials: true  // Envia cookies automaticamente
});

export default apiClient;
