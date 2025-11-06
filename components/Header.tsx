import Link from 'next/link'
import Logo from './Logo'

export default function Header(){
  return (
    <header className="container header">
      <div className="logo-wrap"><Logo /> <h2>Smart-Win</h2></div>
      <nav>
        <Link href="/login"><button className="ghost-cta">Login</button></Link>
      </nav>
    </header>
  )
}
