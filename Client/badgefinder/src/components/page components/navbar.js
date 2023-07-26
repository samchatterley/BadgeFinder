import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from './usercontext'
import {
  Box,
  Flex,
  IconButton,
  Image,
  Input,
  Button,
  HStack,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorMode,
  useColorModeValue,
  Switch,
  useBreakpointValue
} from '@chakra-ui/react'
import {
  faSearch,
  faArrowUpRightFromSquare,
  faHouse,
  faUsers,
  faUser,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../../assets/scouts-logo-icon.png'
import headshot from '../../assets/headshot.jpg'
import badgesIcon from '../../assets/scouts-logo-bw.png'

const useNavigation = (to) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === to
  return { navigate, isActive }
}

const NavButtonLink = ({ icon, to, image, ...props }) => {
  const { navigate, isActive } = useNavigation(to)
  const width = useBreakpointValue({ base: '100%', md: '150px' })
  const activeColor = useColorModeValue('purple.500', 'teal.500')
  const imageFilter = useColorModeValue(
    isActive ? 'invert(100%) brightness(300%)' : 'none',
    isActive ? 'brightness(0) invert(1)' : 'invert(1)'
  )

  return (
    <Button
      variant={isActive ? 'solid' : 'ghost'}
      width={width}
      as='a'
      onClick={() => navigate(to)}
      backgroundColor={isActive ? activeColor : undefined}
      color={isActive ? 'white' : 'inherit'}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {image && (
        <Image src={image} width='2.5em' height='2.5em' filter={imageFilter} />
      )}
    </Button>
  )
}

const ProfileMenu = ({ isDisplayAndAccessOpen, setDisplayAccessOpen }) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<FontAwesomeIcon icon={faChevronDown} />}
        backgroundColor='transparent'
        _hover={{ backgroundColor: 'transparent' }}
        _active={{ backgroundColor: 'transparent' }}
      >
        <ProfileMenuHeader />
      </MenuButton>
      <MenuList>
        <ProfileMenuList
          colorMode={colorMode}
          toggleColorMode={toggleColorMode}
        />
      </MenuList>
    </Menu>
  )
}

const ProfileMenuHeader = () => {
  const [user] = useContext(UserContext)

  return (
    <HStack spacing={2}>
      <Image
        src={headshot}
        alt='Headshot'
        borderRadius='full'
        boxSize='30px'
        objectFit='cover'
      />
      <Text fontSize='lg' fontFamily='Nunito Sans' fontWeight='bold'>
        {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
      </Text>
    </HStack>
  )
}

const ProfileMenuList = ({ colorMode, toggleColorMode }) => (
  <ProfileMenuListBasic
    colorMode={colorMode}
    toggleColorMode={toggleColorMode}
  />
)

const ProfileMenuListBasic = ({ colorMode, toggleColorMode }) => {
  const [user] = useContext(UserContext)

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Loading...'

  return (
    <>
      <ProfileMenuItem image={headshot} text={userName} />
      <DisplayAndAccessibilityMenu
        colorMode={colorMode}
        toggleColorMode={toggleColorMode}
      />
      <a
        href='https://forms.gle/ApR9ouGtKUGekcar7'
        target='_blank'
        rel='noopener noreferrer'
      >
        <MenuItem>
          <HStack spacing={2}>
            <Text>Give Feedback</Text>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </HStack>
        </MenuItem>
      </a>
      <MenuItem>
        <HStack spacing={2}>
          <a
            href='https://github.com/samchatterley/badgefinder'
            target='_blank'
            rel='noopener noreferrer'
          >
            Developer Information
          </a>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </HStack>
      </MenuItem>
      <MenuItem>
        <a href='/'>Logout</a>
      </MenuItem>
    </>
  )
}

const DisplayAndAccessibilityMenu = ({ colorMode, toggleColorMode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box>
      <ProfileMenuItem
        text='Display and Accessibility'
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
      />
      {isOpen && (
        <ProfileMenuItem
          text='Dark Mode'
          fontSize='sm'
          onClick={(e) => e.stopPropagation()}
          switch={{
            isChecked: colorMode === 'dark',
            onChange: toggleColorMode,
            size: 'sm'
          }}
        />
      )}
    </Box>
  )
}

const ProfileMenuItem = ({
  image,
  text,
  icon,
  onClick,
  fontSize,
  switch: switchProps,
  isOpen,
  toggleMenu,
  children
}) => {
  return (
    <MenuItem onClick={onClick}>
      <HStack spacing={2}>
        {image && (
          <Image
            src={image}
            alt='Headshot'
            borderRadius='full'
            boxSize='30px'
            objectFit='cover'
          />
        )}
        <Text fontSize={fontSize}>{text}</Text>
        {icon && <FontAwesomeIcon icon={icon} />}
        {switchProps && (
          <Switch
            isChecked={switchProps.isChecked}
            onChange={switchProps.onChange}
            size={switchProps.size}
          />
        )}
        {typeof isOpen !== 'undefined' && (
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        )}
      </HStack>
      {children}
    </MenuItem>
  )
}

const NavBar = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderBottomColor = useColorModeValue('gray.200', 'gray.600')
  const inputBg = useColorModeValue('gray.100', 'gray.700')
  const inputColor = useColorModeValue('#606770', 'gray.300')
  const inputPlaceholderColor = useColorModeValue('gray.550', 'gray.500')
  const [isDisplayAndAccessOpen, setDisplayAccessOpen] = useState(false)
  const logoFilter = useColorModeValue(
    'none',
    'brightness(0) invert(1) hue-rotate(170deg)'
  )

  return (
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      wrap='nowrap'
      paddingX='1.75rem'
      paddingY='0.5rem'
      bg={bg}
      borderBottomWidth={1}
      borderBottomColor={borderBottomColor}
    >
      <HStack spacing={3}>
        <IconButton
          aria-label='Scouts logo'
          icon={
            <Image
              src={logo}
              alt='Scouts logo'
              borderRadius='full'
              boxSize='30px'
              filter={logoFilter}
            />
          }
          backgroundColor='transparent'
        />
        <SearchInput
          inputBg={inputBg}
          inputColor={inputColor}
          inputPlaceholderColor={inputPlaceholderColor}
        />
      </HStack>

      <HStack spacing={4}>
        <NavButtonLink icon={faHouse} to='/home' />
        <NavButtonLink image={badgesIcon} to='/badges' />
        <NavButtonLink icon={faUsers} to='/community' />
        <NavButtonLink icon={faUser} to='/profile' />
      </HStack>

      <HStack spacing={3}>
        <ProfileMenu
          isDisplayAndAccessOpen={isDisplayAndAccessOpen}
          setDisplayAccessOpen={setDisplayAccessOpen}
        />
      </HStack>
    </Flex>
  )
}

const SearchInput = ({ inputBg, inputColor, inputPlaceholderColor }) => (
  <InputGroup>
    <InputLeftElement pointerEvents='none'>
      <FontAwesomeIcon icon={faSearch} color='gray.400' />
    </InputLeftElement>
    <Input
      type='text'
      placeholder='Search BadgeFinder'
      borderRadius='50px'
      outline='none'
      fontSize='13px'
      fontFamily='Nunito Sans'
      color={inputColor}
      fontWeight='600'
      verticalAlign='middle'
      flexGrow={1}
      backgroundColor={inputBg}
      _placeholder={{ color: inputPlaceholderColor }}
      _focus={{
        borderColor: useColorModeValue('#7413dc', '#00a794'),
        boxShadow: useColorModeValue('0 0 0 1px #7413dc', '0 0 0 1px #00a794')
      }}
      pl={10}
      width='100%'
    />
  </InputGroup>
)

export default NavBar
