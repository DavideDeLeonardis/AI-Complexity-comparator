import { ReactElement } from 'react';

import { FunctionInserted } from '../types-interfaces';

const Output = ({ funcObj }: { funcObj: FunctionInserted }): ReactElement => {
   return (
      <div className="output">
         <div className="complexity-label">
            Time Complexity function {'{ '}
            {funcObj.name}
            {' }'} :
         </div>
         <u>{funcObj.complexity}</u>
         <div className="is-faster">{funcObj.isFaster && 'FASTER!'}</div>
      </div>
   );
};

export default Output;
