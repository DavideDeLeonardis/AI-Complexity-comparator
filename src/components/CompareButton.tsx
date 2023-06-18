import { ReactElement } from 'react';

import { CompareValidFunction } from '../types-interfaces';

interface CompareButtonProps {
   isLoading: boolean;
   compareValidFunctions: CompareValidFunction;
}

const CompareButton = ({
   isLoading,
   compareValidFunctions,
}: CompareButtonProps): ReactElement => {
   return (
      <button
         className="compare"
         disabled={isLoading}
         onClick={compareValidFunctions}
      >
         Compare
      </button>
   );
};

export default CompareButton;
