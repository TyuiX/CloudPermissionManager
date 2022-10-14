import axios from 'axios'
axios.defaults.withCredentials = false;
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
})

export const createUser = (payload) => api.post(`/register`, payload)
export const loginUser = (payload) => api.post(`/login`, payload)
export const createSnapshot = (payload) => api.post(`/snapshot/add`, payload)
export const getSnapshots = (payload) => api.post(`/snapshot/list`, payload)
export const getUserProfile = (payload) => api.post(`/user`, payload)
export const getSnapshot = (id) => api.get(`/snapshot/${id}`)
export const setLinkedGoogle = (payload) => api.post(`/google`, payload)
export const getFileFolderDif = (id) => api.get(`/fileFolderDiff/${id}`)

const managerAPI = {
    createUser,
    loginUser,
    createSnapshot,
    getSnapshots,
    getUserProfile,
    getSnapshot,
    setLinkedGoogle,
    getFileFolderDif,
}

export default managerAPI