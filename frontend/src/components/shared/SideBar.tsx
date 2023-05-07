import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import { FiMenu } from "react-icons/fi";
import { MdHome } from "react-icons/md";

function SideBar({ children }: { children: JSX.Element }) {
  const sidebar = useDisclosure();
  const color = useColorModeValue("gray.600", "gray.300");

  const NavItem = (props: any) => {
    const { icon, children, ...rest } = props;
    return (
      <Flex
        align="center"
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        color="inherit"
        _dark={{
          color: "gray.400",
        }}
        _hover={{
          bg: "gray.100",
          _dark: {
            bg: "gray.900",
          },
          color: "gray.900",
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        {...rest}
      >
        {icon && (
          <Icon
            mx="2"
            boxSize="4"
            _groupHover={{
              color: color,
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    );
  };

  const SidebarContent = (props: any) => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{
        bg: "gray.800",
      }}
      border
      color="inherit"
      borderRightWidth="1px"
      w="30"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <Text
          fontSize="2xl"
          ml="2"
          color="brand.500"
          _dark={{
            color: "white",
          }}
          fontWeight="semibold"
        >
          One Dev
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem icon={MdHome}>Home</NavItem>
        {/*
                        <NavItem icon={FaRss}>Articles</NavItem>
                        <NavItem icon={HiCollection}>Collections</NavItem>
                        <NavItem icon={FaClipboardCheck}>Checklists</NavItem>
                        <NavItem icon={HiCode} onClick={integrations.onToggle}>
                            Integrations
                            <Icon
                                as={MdKeyboardArrowRight}
                                ml="auto"
                                transform={integrations.isOpen ? "rotate(90deg)" : ""}
                            />
                        </NavItem>
                        <Collapse in={integrations.isOpen}>
                            <NavItem pl="12" py="2">
                                Shopify
                            </NavItem>
                            <NavItem pl="12" py="2">
                                Slack
                            </NavItem>
                            <NavItem pl="12" py="2">
                                Zapier
                            </NavItem>
                        </Collapse>
                        <NavItem icon={AiFillGift}>Changelog</NavItem>
                        <NavItem icon={BsGearFill}>Settings</NavItem>
             */}
      </Flex>
    </Box>
  );

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: "gray.700",
      }}
      minH="100vh"
    >
      <SidebarContent
        display={{
          base: "none",
          md: "unset",
        }}
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box
        ml={{
          base: 0,
          md: 40,
        }}
        transition=".3s ease"
      >
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="white"
          _dark={{
            bg: "gray.800",
          }}
          borderBottomWidth="1px"
          color="inherit"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{
              base: "inline-flex",
              md: "none",
            }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
          <InputGroup
            w="96"
            display={{
              base: "none",
              md: "flex",
            }}
          >
            <Input placeholder="Search for articles..." />
          </InputGroup>
        </Flex>

        <Box as="main" p="4">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default SideBar;
