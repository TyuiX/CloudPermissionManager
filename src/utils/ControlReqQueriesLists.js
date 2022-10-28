const QUERIES_MAP = {
    "drive": "drive:drive",
    "owner": "owner:user",
    "creator": "creator:user",
    "from": "from:user",
    "to": "to:user",
    "readable": "readable:user",
    "writeable": "writeable:user",
    "shareable": "shareable:user",
    "name": "name:regexp",
    "inFolder": "inFolder:regexp",
    "folder": "folder:regexp",
    "path": "path:path",
    "sharing:none": "sharing:none",
    "sharing:anyone": "sharing:anyone",
    "sharing:individual": "sharing:individual",
    "sharing:domain": "sharing:domain"
}
const QUERIES =
    [
        "drive:drive", "owner:user", "creator:user", "from:user", "to:user", "readable:user", "writeable:user",
        "shareable:user", "name:regexp", "inFolder:regexp", "folder:regexp", "path:path", "sharing:none",
        "sharing:anyone", "sharing:individual", "sharing:domain"
    ]

const controlReqsList = {
    QUERIES,
    QUERIES_MAP
}

export default controlReqsList;