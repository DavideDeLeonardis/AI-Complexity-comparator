import { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

interface LoadingProps {
   isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps): ReactElement => (
   <div className="loading">
      {isLoading && <FontAwesomeIcon icon={faCircleNotch} />}
   </div>
);

export default Loading;
