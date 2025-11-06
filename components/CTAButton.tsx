import React from 'react'

export default function CTAButton({ children, href }: { children: React.ReactNode, href?: string }){
  if(href) return <a href={href}><button className="cta">{children}</button></a>
  return <button className="cta">{children}</button>
}
