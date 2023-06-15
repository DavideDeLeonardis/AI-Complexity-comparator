import { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

interface LoadingProps {
   isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps): ReactElement | null => {
   return isLoading ? (
      <div className="loading">
         <FontAwesomeIcon icon={faCircleNotch} />
      </div>
   ) : null;
};

export default Loading;
