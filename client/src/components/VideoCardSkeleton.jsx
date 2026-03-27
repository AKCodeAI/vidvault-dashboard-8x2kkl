export default function VideoCardSkeleton({ count = 8 }) {
  return Array.from({ length: count }, (_, i) => (
    <div className="video-card" key={i} style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
      <div style={{ padding: 'var(--space-md)' }}>
        <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '50%' }} />
      </div>
    </div>
  ));
}
