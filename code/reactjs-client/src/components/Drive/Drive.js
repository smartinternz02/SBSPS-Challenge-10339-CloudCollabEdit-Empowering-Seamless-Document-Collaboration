import Data from "./Data";
import Header from "./Header";
import Sidebar from "./Sidebar";
import './index.css';

function Drive() {
  return (
    <>
    <Header/>
    <div className="App">
      <Sidebar/>
      <Data/>
    </div>
    </>
    
  );
}

export default Drive;
