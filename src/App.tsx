import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ReactElement, Suspense } from 'react'

import CircularProgress from '@mui/material/CircularProgress';
import Home from './Routes/Home'
import NavBar from './Components/NavBar'
import SignIn from './Routes/SignIn'
import { lazyLoad } from './Utility/lazyLoad'
import { useGetAuthQuery } from './Store/RTK/authSlice'

const AboutPage = lazyLoad('../Routes/About')

const About = () => {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <AboutPage/>
    </Suspense>
  )
}

const App = ():ReactElement => {
  const { isLoading, data } = useGetAuthQuery()
  const isLoggedIn = data
  
  if(isLoading) return <CircularProgress/>
  
  return(
    <>
    {isLoggedIn ? (
        <BrowserRouter>
          <NavBar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to='/' replace={true}/>} />
          </Routes>
        </BrowserRouter>
    ) : (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="*" element={<Navigate to='/' replace={true}/>} />
        </Routes>
      </BrowserRouter>
    )}
  </>
  )
}

export default App