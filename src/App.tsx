import { ReactElement } from 'react';

import Header from './components/Header';
import Main from './components/Main';

import './assets/scss/index.scss';

const App = (): ReactElement => {
   return (
      <>
         <Header />
         <Main />
      </>
   );
};

export default App;
