// LoadingSpinner.tsx
import { BeatLoader } from "react-spinners";

type Props = {
    loading: boolean;
};

const LoadingSpinner: React.FC<Props> = ({ loading }) => {
    return (
        <BeatLoader
            loading={loading}
            size={8} 
            color="#141414ff"
        />
    );
};

export default LoadingSpinner;
