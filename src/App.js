import './App.css';
import PageHeader from "./components/PageHeader";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
      <>
          <PageHeader />
          <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/files" element={<div>Files</div>} />
              <Route path="/myfiles" element={<div>MyFiles</div>} />
              <Route path="/sharedfiles" element={<div>SharedFiles</div>} />
              <Route path="/folder/:folderId" element={<div>OpenFolder</div>} />
              <Route path="/file/:fileId" element={<div>OpenFile</div>} />
              <Route path="/filesnapshot" element={<div>FileSnapshot</div>} />
              <Route path="/groupsnapshot" element={<div>GroupSnapshot</div>} />
          </Routes>
      </>
  );
}

export default App;
