import { Route, Routes } from 'react-router'
import Fetchdata from './Fetchdata'
import Googleoauth from './Googleoauth'
import Updateform from './Updateform'

const Allroute = () => {
  return (
    <div >
      <Routes>
        <Route path ='/' element = {<Googleoauth />} />
        <Route path = '/home' element = {<Fetchdata />} />
        <Route path = '/data/updatedata' element = {<Updateform />}/>
      </Routes>
    </div>
  )
}

export default Allroute
