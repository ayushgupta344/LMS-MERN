import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import Coursessection from '../../components/student/Coursessection'
import Testimonialssection from '../../components/student/Testimonialssection'
import CallToAction from '../../components/student/Call-to-action'
import Footer from '../../components/student/Footer'
const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero/>
      <Companies/>
      <Coursessection/>
      <Testimonialssection/>
      <CallToAction/>
      <Footer/>
    </div>
  )
}
export default Home
