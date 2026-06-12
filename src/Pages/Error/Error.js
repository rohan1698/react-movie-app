import { useNavigate } from 'react-router-dom';
import { I } from '../../components/icons/Icons';

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="view">
      <div className="empty" style={{ minHeight: '70vh', justifyContent: 'center' }}>
        <I.grid />
        <h3>404 — Page not found</h3>
        <span>The page you're looking for doesn't exist.</span>
        <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => navigate('/')}>
          <I.flame /> Back to Trending
        </button>
      </div>
    </div>
  );
};

export default Error;
