import './Orb.css';
import { OrbState } from '../types';

interface OrbProps {
  size?: 'sm' | 'md' | 'lg';
  state?: OrbState;
  opacity?: number;
}

export const Orb = ({ size = 'md', state = 'idle', opacity = 1 }: OrbProps) => {
  return (
    <div className={`orb-wrap orb-${size}`} style={{ opacity }}>
      <div className={`orb ${state === 'speaking' ? 'speaking' : ''}`}>
        <div className="orb-core"></div>
        <div className="orb-ring orb-ring-1"></div>
        <div className="orb-ring orb-ring-2"></div>
        <div className="orb-ring orb-ring-3"></div>
      </div>
    </div>
  );
};
