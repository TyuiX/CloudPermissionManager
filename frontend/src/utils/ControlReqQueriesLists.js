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

const QUERY_DESCRIPTIONS = {
    "drive": {
        opt: "drive:drive",
        desc: "files in drive drive. drive is “MyDrive” or a shared drive’s name"
    },
    "owner": {
        opt: "owner:user",
        desc: "files owned by user"
    },
    "creator": {
        opt: "creator:user",
        desc: "files created by user (equiv. to “owner” for services without ownership transfer)"
    },
    "from": {
        opt: "from:user",
        desc: "files shared by user"
    },
    "to": {
        opt: "to:user",
        desc: "files directly (i.e., ignoring inherited and group permissions) shared with user"
    },
    "readable": {
        opt: "readable:user",
        desc: "files readable (viewable) by user"
    },
    "writeable": {
        opt: "writeable:user",
        desc: "files writable (editable) by user"
    },
    "shareable": {
        opt: "shareable:user",
        desc: "files sharable by user, i.e., user can change the file’s permissions"
    },
    "name": {
        opt: "name:regexp",
        desc: "files whose name matches regexp"
    },
    "inFolder": {
        opt: "inFolder:regexp",
        desc: "files in all folders whose name matches regexp"
    },
    "folder": {
        opt: "folder:regexp",
        desc: "files under all folders whose name matches regexp"
    },
    "path": {
        opt: "path:path",
        desc: "files under the folder with path path; use “/” as separator"
    },
    "sharing:none": {
        opt: "sharing:none",
        desc: "unshared files"
    },
    "sharing:anyone": {
        opt: "sharing:anyone",
        desc: "files shared with anyone with the link"
    },
    "sharing:individual": {
        opt: "sharing:individual",
        desc: "files shared with specific users"
    },
    "sharing:domain": {
        opt: "sharing:domain",
        desc: "files shared with anyone in the owner’s domain (e.g., stonybrook.edu)"
    },
}

const QUERIES =
    [
        "drive:drive", "owner:user", "creator:user", "from:user", "to:user", "readable:user", "writeable:user",
        "shareable:user", "name:regexp", "inFolder:regexp", "folder:regexp", "path:path", "sharing:none",
        "sharing:anyone", "sharing:individual", "sharing:domain"
    ]

const controlReqsList = {
    QUERIES,
    QUERIES_MAP,
    QUERY_DESCRIPTIONS
}

export default controlReqsList;