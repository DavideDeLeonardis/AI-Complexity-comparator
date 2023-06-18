import { ReactElement, RefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { FinalResponse } from '../types-interfaces';

interface ErrorProps {
   inputsAreValid: boolean | null;
   finalResponse: FinalResponse;
   language: string | null;
   innerRef?: RefObject<HTMLDivElement>;
}

const ErrorMessage = ({
   inputsAreValid,
   finalResponse,
   language,
   innerRef,
}: ErrorProps): ReactElement | null => {
   const outputError = (): string => {
      if (language === '') return 'Choose a language';
      if (!inputsAreValid) return 'Insert 2 valid functions';
      if (finalResponse === 'SOMETHING WENT WRONG')
         return 'Something went wrong! Check language and functions inserted and retry';

      return '';
   };

   return language === '' ||
      !inputsAreValid ||
      finalResponse === 'SOMETHING WENT WRONG' ? (
      <div className="error" ref={innerRef}>
         {outputError() && <FontAwesomeIcon icon={faXmark} />}
         {outputError()}
      </div>
   ) : null;
};

export default ErrorMessage;
