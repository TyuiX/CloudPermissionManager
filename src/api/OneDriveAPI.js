import axios from 'axios'
axios.defaults.withCredentials = false;
const api = axios.create({
    baseURL: 'http://localhost:8000/onedrive',
})

export const getMyFiles = (payload) => api.post(`/ODfiles`, payload)
export const getSharedFiles = (payload) => api.post(`/ODsharedfiles`, payload)

const oneDriveAPI = {
    getMyFiles,
    getSharedFiles
}

export default oneDriveAPI