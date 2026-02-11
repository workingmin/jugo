import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item'
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span>✍️ AI创作平台</span>
          <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '8px' }}>
            AI赋能,笔落成文
          </span>
        </div>
        <nav className="nav">
          <Link to="/" className={isActive('/')}>首页</Link>
          <Link to="/create" className={isActive('/create')}>创作</Link>
          <Link to="/works" className={isActive('/works')}>作品</Link>
          <Link to="/materials" className={isActive('/materials')}>素材</Link>
          <a href="#" className="nav-item">帮助</a>
        </nav>
        <div className="user-section">
          <span className="badge">免费用户</span>
          <Link to="/profile">
            <div className="avatar">创</div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
