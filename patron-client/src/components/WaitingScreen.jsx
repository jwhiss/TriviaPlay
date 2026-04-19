export default function WaitingScreen({ message }) {
  return (
    <div className="glass-panel animate-fade-in" style={{ textAlign: 'center' }}>
      <div className="spinner"></div>
      <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '16px' }}>{message}</h2>
    </div>
  );
}
