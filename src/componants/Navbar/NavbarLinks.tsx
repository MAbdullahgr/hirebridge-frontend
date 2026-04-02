import Link from 'next/link'

const NavbarLinks = () => {
  return (
    <ul className='flex gap-12'>
      {['About', 'Jobs', 'Internship', 'Projects', 'Services', 'Contact'].map(
        (item) => (
          <li key={item}>
            <Link
              href={`/${item.toLowerCase()}`}
              className="
              relative inline-block 
              text-xl font-medium text-[#234D76] 
              transition-transform duration-300 ease-in-out 
              hover:scale-105
              after:content-[''] after:absolute after:left-0 after:-bottom-1
              after:w-0 after:h-[2px] after:bg-current 
              after:transition-all after:duration-400 after:ease-in-out
              hover:after:w-full
            "
            >
              {item}
            </Link>
          </li>
        )
      )}
    </ul>
  )
}

export default NavbarLinks
