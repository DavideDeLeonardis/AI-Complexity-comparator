import { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { FinalResponse } from '../types-interfaces';

interface ErrorProps {
   inputsAreValid: boolean | null;
   finalResponse: FinalResponse;
   language: string | null;
}

const ErrorMessage = ({
   inputsAreValid,
   finalResponse,
   language,
}: ErrorProps): ReactElement => {
   const outputError = (): string => {
      if (language === '') return 'Choose a language';
      if (!inputsAreValid) return 'Insert 2 valid functions';
      if (finalResponse === 'SOMETHING WENT WRONG')
         return 'Something went wrong! Check language and functions inserted and retry';

      return '';
   };

   return (
      <div className="error">
         {outputError() && <FontAwesomeIcon icon={faXmark} />}
         {outputError()}
      </div>
   );
};

export default ErrorMessage;
