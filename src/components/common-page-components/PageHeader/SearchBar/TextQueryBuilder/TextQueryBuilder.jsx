import "./TextQueryBuilder.css"
export default function TextQueryBuilder(props) {

    const {toggleDropdown, setTextSearch} = props;

    const searchDone = () => {
        setTextSearch(1);
        toggleDropdown();
    }

    const queryDone = () => {
        setTextSearch(0);
        toggleDropdown();
    }

    return (
        <div>
            <h3 className="headerForTextOption"> Search Choice: </h3>
            <button onClick={queryDone} className="forTextOption">Query Builder</button>
            <br></br>
            <button onClick={searchDone} className="forTextOption">Search Text</button>
        </div>
    )
}