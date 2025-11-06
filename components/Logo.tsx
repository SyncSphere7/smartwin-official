import Image from 'next/image'

export default function Logo() {
  return (
    <Image 
      src="/Smart_win_logo-transparent.png" 
      alt="Smart-Win" 
      width={48} 
      height={48}
      priority
    />
  )
}
