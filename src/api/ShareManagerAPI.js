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
export const snapshotDiff = (payload) => api.post(`/snapShotDiff`, payload)
export const searchByName = (payload) => api.post(`/searchByName`, payload)
export const getControlReqs = (payload) => api.post(`/control/requirements`, payload)
export const deleteControlReq = (payload) => api.delete(`/control/requirements`, {data: payload})
export const createNewControlReqs = (payload) => api.post(`/control/requirements/add`, payload)
export const deviant = (payload) => api.post(`/getDeviantFiles`, payload)
export const createNewGroupSnapshot = (payload) => api.post(`/snapshot/group/add`, payload)
export const getGroupSnapshots = (payload) => api.post(`/snapshot/group/list`, payload)

const managerAPI = {
    createUser,
    loginUser,
    createSnapshot,
    getSnapshots,
    getUserProfile,
    getSnapshot,
    setLinkedGoogle,
    getFileFolderDif,
    snapshotDiff,
    searchByName,
    getControlReqs,
    deleteControlReq,
    createNewControlReqs,
    deviant,
    createNewGroupSnapshot,
    getGroupSnapshots
}

export default managerAPI