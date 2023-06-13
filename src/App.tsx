import { ReactElement } from 'react';

import Header from './components/Header';
import Main from './components/Main';

import './assets/scss/index.scss';

const App = (): ReactElement => {
   return (
      <div className="root-container">
         <Header />
         <Main />
      </div>
   );
};

export default App;
