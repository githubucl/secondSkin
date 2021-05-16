import React, { useEffect, useRef } from 'react'
import { FeaturedProducts, Hero, Services, Contact, Three } from '../components'

const HomePage = () => {
  const page = useRef()




  return (
    <main ref={page} >
      <Three page={page} />
      <Hero />
      <FeaturedProducts />
      <Services />
      <Contact />


    </main>
  )
}

export default HomePage
