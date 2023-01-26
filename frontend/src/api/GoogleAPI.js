import axios from 'axios'
axios.defaults.withCredentials = false;
const api = axios.create({
    baseURL: 'http://localhost:8000/google',
})

export const getFiles = (payload) => api.post(`/files`, payload)
export const updateFilePerms = (payload) => api.post(`/perm/update`, payload)

const googleAPI = {
    getFiles,
    updateFilePerms
}

export default googleAPI