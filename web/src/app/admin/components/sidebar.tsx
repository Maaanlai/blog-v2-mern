import { NavLink, Stack, Title } from "@mantine/core";
import { MenuItem } from "./menu-sections";
import { usePathname } from "next/navigation";
import { menu } from "./menu-sections";
import Link from "next/link";
import classes from "./sidebar.module.css";

function Sidebar() {
  const pathname = usePathname();

  return (
    <Stack gap="xl" py={20} px={10}>
      {menu.map((item: MenuItem) => (
        <div key={item.header}>
          <Title order={6} className={classes.sectionTitle}>
            {item.header}
          </Title>

          {item.section.map((subItem) =>
            subItem.dropdownItems ? (
              <NavLink
                variant="subtle"
                key={subItem.name}
                label={subItem.name}
                childrenOffset={0}
                className={classes.sectionLink}
                active={pathname.includes(subItem.href)}
                leftSection={subItem.icon && <subItem.icon />}
              >
                {subItem.dropdownItems?.map((dropdownItem) => (
                  <NavLink
                    variant="subtle"
                    component={Link}
                    href={dropdownItem.href}
                    key={dropdownItem.name}
                    label={dropdownItem.name}
                    active={pathname.includes(dropdownItem.href)}
                    className={classes.sectionDropdownItemLink}
                    leftSection={<span className="dot" />}
                  />
                ))}
              </NavLink>
            ) : (
              <NavLink
                variant="subtle"
                component={Link}
                href={subItem.href}
                key={subItem.name}
                label={subItem.name}
                className={classes.sectionLink}
                leftSection={subItem.icon && <subItem.icon />}
              />
            )
          )}
        </div>
      ))}
    </Stack>
  );
}

export default Sidebar;
