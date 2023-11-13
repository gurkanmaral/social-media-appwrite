import {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const Topbar = () => {

  const {mutate:signOut,isSuccess} = useSignOutAccount()
const navigate = useNavigate()
  const {user} = useUserContext()

  useEffect(() => {
    if(isSuccess) navigate(0)

  }, [isSuccess])
 

  return (
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
          <Link to="/" className='flex gap-3 items-center'>
              <img src="/assets/images/camera-icon-1.svg"
              width={40}
              height={40}
              alt="" />
               <p className='text-[20px] font-semibold leading-[140%] tracking-tighter'>
                 CONNECT
              </p>
          </Link>
          <div className='flex gap-4'>
            <Button variant="ghost" className='shad-button_ghost'
            onClick={()=>signOut()}
            >
              <img 
              src="/assets/icons/logout1.svg"
              alt="logout"
              />
            </Button>
            <Link  to={`/profile/${user.id}`}
            className='flex-center gap-3'
            >
              <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt=""
              className='h-8 w-8 rounded-full'
              />
            </Link>
          </div>
        
      </div>
    </section>
  )
}

export default Topbar