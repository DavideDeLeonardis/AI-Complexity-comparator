import { ReactElement } from 'react';

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
   return (
      <div className="error">
         {language === '' && 'Choose a language'}
         {!inputsAreValid && 'Insert 2 valid functions.'}
         {finalResponse === 'SOMETHING WENT WRONG' &&
            'Something went wrong! Check language inserted and retry.'}
      </div>
   );
};

export default ErrorMessage;
