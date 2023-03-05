import { Route, Routes } from 'react-router'
import { iProps } from '../Interface/common'
import Fetchdata from './Fetchdata'
import Googleoauth from './Googleoauth'
import Registration from './Registration'
import Updateform from './Updateform'

const Allroute = (props : iProps) => {
  return (
    <div >
      <Routes>
        <Route path ='/' element = {<Googleoauth showAlert ={props.showAlert} alert ={props.alert}/>} />
        <Route path = '/registration' element = {<Registration showAlert ={props.showAlert} alert ={props.alert}/>} />
        <Route path = '/home' element = {<Fetchdata showAlert ={props.showAlert} alert ={props.alert}/>} />
        <Route path = '/data/updatedata' element = {<Updateform showAlert ={props.showAlert} alert ={props.alert}/>}/>
      </Routes>
    </div>
  )
}

export default Allroute
