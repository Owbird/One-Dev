import { Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import { INavItemProps } from "@src/data/props";
import { FC } from "react";

const NavItem: FC<INavItemProps> = ({ isActive, icon, tab, onClick }) => {
  const color = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex
      onClick={() => onClick(tab)}
      align="center"
      px="4"
      pl="4"
      py="3"
      cursor="pointer"
      color="inherit"
      _dark={{
        color: "gray.400",
      }}
      bg={isActive ? "blue.100" : "transparent"}
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
      {tab.label}
    </Flex>
  );
};

export default NavItem;
