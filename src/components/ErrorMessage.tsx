import { ReactElement } from 'react';

import { FinalResponse } from '../types-interfaces';

interface ErrorProps {
   inputsAreValid: boolean;
   finalResponse: FinalResponse;
   language: string | null;
}

const ErrorMessage = ({
   inputsAreValid,
   finalResponse,
   language,
}: ErrorProps): ReactElement => {
   return (
      <div style={{ color: 'red' }}>
         {language === '' && 'Choose a language'}
         {!inputsAreValid && 'Insert 2 valid functions'}
         {finalResponse === 'SOMETHING WENT WRONG' &&
            'Something went wrong. RETRY or check language inserted.'}
      </div>
   );
};

export default ErrorMessage;
