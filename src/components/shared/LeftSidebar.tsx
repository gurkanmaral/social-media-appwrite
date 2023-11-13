import {useEffect} from 'react'
import { Link, NavLink, useNavigate,useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'

const LeftSidebar = () => {

  const {mutate:signOut,isSuccess} = useSignOutAccount()
const navigate = useNavigate()
  const {user} = useUserContext()
  const {pathname} = useLocation()
  
  useEffect(() => {
    if(isSuccess) navigate(0)

  }, [isSuccess])
  console.log(user)

  return (
    <div className='leftsidebar'>
        <div className='flex flex-col gap-11'>  
          <Link to="/" className='flex gap-3 items-center' >
            <img src="/assets/images/camera-icon-1.svg" alt="logo"
            width={36} height={36} 
            />
            <p className='orange_gradient text-[20px] font-semibold leading-[140%] tracking-tighter'>
              CONNECT
            </p>
          </Link>

          <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
            <img 
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            className='h-14 w-14 rounded-full'
            />
            <div className='flex flex-col'>
                <p className='body-bold'>
                    {user.name}
                </p>
                <p className='small-regular text-gray-400'>
                    @{user.username}
                </p>
            </div>
          </Link>
          <ul className='flex flex-col gap-4'>
              {sidebarLinks.map((link:INavLink)=>{
                  const isActive = pathname === link.route;
                return(
                 <li className={`leftsidebar-link  group ${isActive && 'activeLink '}`} key={link.label}>
                   <NavLink to={link.route}
                   className="flex gap-4 items-center p-4">
                    <img src={link.imgURL} alt={link.label} 
                    className={`group-hover:invert-white ${isActive && 'invert-white'} `}
                    />
                        {link.label}
                    </NavLink>
                 </li>
                 )
            })}
          </ul>
        </div>
        <Button variant="ghost" className='shad-button_ghost'
            onClick={()=>signOut()}
            >
              <img 
              src="/assets/icons/logout1.svg"
              alt="logout"
              />
             <p className='small-medium lg:base-medium'>Logout</p>
            </Button>
    </div>
  )
}

export default LeftSidebar