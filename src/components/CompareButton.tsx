import { ReactElement } from 'react';

interface CompareButton {
   isLoading: boolean;
   compareValidFunctions: () => Promise<void>;
}

const CompareButton = ({
   isLoading,
   compareValidFunctions,
}: CompareButton): ReactElement => {
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
