import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChakraProvider, Button, Spinner, VStack } from '@chakra-ui/react'
import logo from '../assets/scouts-logo.jpg'
import '../index.css'

const Landing = () => {
  const [isLoading, setIsLoading] = useState({ signIn: false, signUp: false })

  const handleClick = useMemo(
    () => (buttonType) => {
      setIsLoading((prevState) => ({ ...prevState, [buttonType]: true }))
    },
    []
  )

  const memoizedTexts = useMemo(() => {
    const introTexts = [
      'This innovative app aims to revolutionize the way Scouts earn badges by leveraging location-based data to suggest activities that satisfy badge requirements. With BadgeFinder, Scouts can easily access a directory of badge requirements, complete with suggested activities and locations, making earning badges a more interactive and engaging experience.',
      'I believe that digitizing Scouting is the future, and this app takes the first step towards this goal. While badges cannot currently be issued as NFTs, BadgeFinder aims to showcase the potential for Scouting to move in this direction in the future. I believe that issuing badges as NFTs could be a game-changer, providing Scouts with a new and innovative way to showcase their achievements and skills.',
      'BadgeFinder also serves as a portfolio that demonstrates my abilities as a full-stack developer. It features a full Figma wireframe, a RESTful API built from scratch, a MongoDB database, and a web-app built in React. In the future, I plan to release mobile versions of the app for iOS and Android, written in Swift and Kotlin, respectively.',
      "I hope that BadgeFinder will be a useful tool for Scouts looking to earn badges and explore the world around them. I'm excited to see how this app can transform the Scouting experience and inspire further innovation in the community."
    ]

    return introTexts.map((introtext) => (
      <p key={introtext} className='introtext' style={{ fontSize: '1.23rem' }}>
        {introtext}
      </p>
    ))
  }, [])

  return (
    <ChakraProvider>
      <VStack className='container' alignItems='center' spacing={3}>
        <img
          src={logo}
          alt='Scouts Logo'
          className='logo'
          style={{ width: '180px' }}
        />
        <h1 className='title' style={{ fontSize: '2.5rem' }}>
          Welcome to BadgeFinder!
        </h1>
        {memoizedTexts}
        <div>
          <Button
            className='signin-btn'
            isLoading={isLoading.signIn}
            size='md'
            bg='#00a794'
            borderRadius='full'
            width='200px'
            height='60px'
            margin='0.5rem'
            fontSize='2xl'
            boxShadow='0px 4px 6px rgba(0, 0, 0, 0.15)'
            onClick={() => handleClick('signIn')}
            colorScheme={isLoading.signIn ? 'green' : 'whiteAlpha'}
            as={Link}
            to='/auth/signin'
          >
            {isLoading.signIn ? <Spinner /> : 'Sign In'}
          </Button>
          <Button
            className='signup-btn'
            isLoading={isLoading.signUp}
            size='md'
            bg='#00a794'
            borderRadius='full'
            width='200px'
            height='60px'
            margin='0.5rem'
            fontSize='2xl'
            boxShadow='0px 4px 6px rgba(0, 0, 0, 0.15)'
            onClick={() => handleClick('signUp')}
            colorScheme={isLoading.signUp ? 'green' : 'whiteAlpha'}
            as={Link}
            to='/auth/signup'
          >
            {isLoading.signUp ? <Spinner /> : 'Sign Up'}
          </Button>
        </div>
      </VStack>
    </ChakraProvider>
  )
}

export default Landing
