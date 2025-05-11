"use client";

import { Paper, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./layout.module.css";
import Sidebar from "./components/sidebar";

function layout() {
  return (
    <div className={classes.root}>
      <Paper className={classes.sidebarWrapper} withBorder>
        <ScrollArea flex="1" px="md">
          <Sidebar />
        </ScrollArea>
      </Paper>
      <div className={classes.content}>
        {/* <Header /> */}

        <main className={classes.main}>{/* <Outlet /> */}</main>
      </div>
    </div>
    // <AppShell
    //   navbar={{
    //     width: 300,
    //     breakpoint: "sm",
    //     collapsed: { mobile: !opened },
    //   }}
    // >
    //   <AppShell.Navbar>
    //     <Stack gap="xl" py={20} px={10}>
    //       {menu.map((item: MenuItem) => (
    //         <div key={item.header}>
    //           <Title order={6} className={classes.sectionTitle}>
    //             {item.header}
    //           </Title>

    //           {item.section.map((subItem) =>
    //             subItem.dropdownItems ? (
    //               <NavLink
    //                 variant="subtle"
    //                 key={subItem.name}
    //                 label={subItem.name}
    //                 childrenOffset={0}
    //                 className={classes.sectionLink}
    //                 active={pathname.includes(subItem.href)}
    //                 leftSection={subItem.icon && <subItem.icon />}
    //               >
    //                 {subItem.dropdownItems?.map((dropdownItem) => (
    //                   <NavLink
    //                     variant="subtle"
    //                     component={Link}
    //                     href={dropdownItem.href}
    //                     key={dropdownItem.name}
    //                     label={dropdownItem.name}
    //                     active={pathname.includes(dropdownItem.href)}
    //                     className={classes.sectionDropdownItemLink}
    //                     leftSection={<span className="dot" />}
    //                   />
    //                 ))}
    //               </NavLink>
    //             ) : (
    //               <NavLink
    //                 variant="subtle"
    //                 component={Link}
    //                 href={subItem.href}
    //                 key={subItem.name}
    //                 label={subItem.name}
    //                 className={classes.sectionLink}
    //                 leftSection={subItem.icon && <subItem.icon />}
    //               />
    //             )
    //           )}
    //         </div>
    //       ))}
    //     </Stack>
    //   </AppShell.Navbar>
    //   <AppShell.Main>
    //     <p>Main</p>
    //   </AppShell.Main>
    // </AppShell>
  );
}

export default layout;
