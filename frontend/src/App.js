import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';

import { loadSongsThunk } from './store/songs'


function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadSongsThunk())
  }, [])

  return (
    <div className="App">

    </div>
  );
}

export default App;
