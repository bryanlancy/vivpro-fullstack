import './App.css';
import SongTable from './components/SongTable';
import SongSearch from './components/SongSearch'
import SongChart from './components/SongChart';

function App() {

  return (
    <div className="App">
      <SongSearch />
      <SongTable />
      <SongChart type='scatter' />
      <SongChart type='histogram' />
      <SongChart type='bar' />
    </div>
  );
}

export default App;
