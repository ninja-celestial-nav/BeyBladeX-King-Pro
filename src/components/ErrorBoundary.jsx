import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('ErrorBoundary caught:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#ff5252' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: 'Orbitron', marginBottom: 8 }}>頁面發生錯誤</h2>
          <p style={{ color: '#8888aa', marginBottom: 16 }}>{this.state.error?.message || '未知錯誤'}</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); }}
            style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: 12, color: '#fff', fontFamily: 'Outfit', fontWeight: 600, cursor: 'pointer' }}>
            重新載入
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
