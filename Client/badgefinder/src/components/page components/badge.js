import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Text,
  Image,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Checkbox
} from '@chakra-ui/react'
import axios from 'axios'
import { UserContext } from './usercontext'

const Badge = ({ badge, userId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [requirements, setRequirements] = useState([])
  const defaultBorderColor = 'white'

  const { userAchievements, setUserAchievements, handleCheckboxChange } =
    React.useContext(UserContext)
  const [badgeBorderColor, setBadgeBorderColor] = useState(null)

  const getRequirementStatus = useCallback(
    (requirementId) => {
      return Boolean(userAchievements[badge._id]?.includes(requirementId))
    },
    [userAchievements, badge]
  )

  const updateBadgeColor = useCallback(
    (badgeAchievements) => {
      if (badgeAchievements) {
        if (badgeAchievements.length === requirements.length) {
          setBadgeBorderColor('navy')
        } else if (badgeAchievements.length > 0) {
          setBadgeBorderColor('#ffe627')
        } else {
          setBadgeBorderColor(defaultBorderColor)
        }
      }
    },
    [requirements, defaultBorderColor]
  )

  useEffect(() => {
    updateBadgeColor(userAchievements[badge._id])
  }, [userAchievements, badge, updateBadgeColor])

  const onClose = () => setIsOpen(false)

  const fetchRequirements = async (badgeId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/requirements?badge_id=${badgeId}`
      )
      const data = response.data
      setRequirements(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBadgeClick = async () => {
    await fetchRequirements(badge.badge_id)
    setIsOpen(true)
  }

  const imageUrl = badge.imageUrl
  const boxShadow = useColorModeValue(
    '0 2px 4px rgba(116, 19, 220, 0.2)',
    '0 2px 4px rgba(0, 167, 148, 0.2)'
  )

  const borderStyle = {
    borderWidth: '4px',
    borderColor: badgeBorderColor || defaultBorderColor,
    boxShadow
  }

  const modalContentStyle = {
    borderRadius: '20px',
    backgroundColor: '#7413dc',
    minHeight: '90vh',
    ...borderStyle
  }

  const [margin, setMargin] = useState('0px')

  useEffect(() => {
    const modalContent = document.querySelector('.chakra-modal__content')
    if (modalContent) {
      const modalContentHeight = modalContent.offsetHeight
      const viewerHeight = window.innerHeight
      const remainingHeight = viewerHeight - modalContentHeight
      const marginValue =
        remainingHeight > 20 ? `${remainingHeight / 2}px` : '15px'
      setMargin(marginValue)
    }
  }, [isOpen])

  const BadgeImage = (
    <Box
      marginTop='2'
      display='flex'
      justifyContent='center'
      alignItems='center'
      width='150px'
      height='150px'
      borderRadius='100%'
      overflow='hidden'
      {...borderStyle}
    >
      <Image
        src={imageUrl}
        alt={badge.badge_name}
        objectFit='contain'
        width='100%'
        height='150px'
      />
    </Box>
  )

  const modalBadgeBorderStyle = {
    borderWidth: '4px',
    borderColor: badgeBorderColor || 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  }

  const ModalBadgeImage = (
    <Box
      marginTop='2'
      display='flex'
      justifyContent='center'
      alignItems='center'
      width='150px'
      height='150px'
      borderRadius='100%'
      overflow='hidden'
      {...modalBadgeBorderStyle}
    >
      <Image
        src={imageUrl}
        alt={badge.badge_name}
        objectFit='contain'
        width='100%'
        height='150px'
      />
    </Box>
  )

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${userId}`)
        setUserAchievements(response.data.badges)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [userId, setUserAchievements])

  return (
    <>
      <Box
        role='button'
        tabIndex='0'
        onClick={handleBadgeClick}
        _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
        cursor='pointer'
      >
        {imageUrl
          ? (
              BadgeImage
            )
          : (
            <Box backgroundColor='gray.300' height='150px' />
            )}
        <Box p='2'>
          <Text fontWeight='bold' fontSize='sm' textAlign='center'>
            {badge.badge_name}
          </Text>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent
          style={{
            ...modalContentStyle,
            marginTop: margin,
            marginBottom: margin
          }}
        >
          <ModalHeader color='white' textAlign='center' fontSize={28}>
            {badge.badge_name}
          </ModalHeader>
          <ModalCloseButton color='white' />
          <ModalBody>
            <VStack
              spacing={4}
              alignItems='center'
              marginBottom={4}
              marginTop={-4}
            >
              {ModalBadgeImage}
              <Text
                fontFamily='Nunito Sans'
                color='white'
                fontWeight='bold'
                fontSize={24}
              >
                Requirements:
              </Text>
            </VStack>
            <VStack spacing={4} align='left'>
              {requirements.map((requirement) => (
                <Checkbox
                  key={requirement._id}
                  isChecked={getRequirementStatus(requirement._id)}
                  onChange={(e) =>
                    handleCheckboxChange(requirement._id, e.target.checked)}
                  colorScheme='green'
                >
                  <Text fontFamily='Nunito Sans' color='white'>
                    {requirement.requirement_string}
                  </Text>
                </Checkbox>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Badge
