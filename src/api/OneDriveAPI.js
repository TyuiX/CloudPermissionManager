import axios from 'axios'
axios.defaults.withCredentials = false;
const api = axios.create({
    baseURL: 'http://localhost:8000/onedrive',
})

export const getFiles = (payload) => api.post(`/files`, payload)

const oneDriveAPI = {
    getFiles
}

export default oneDriveAPI