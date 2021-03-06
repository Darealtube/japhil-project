import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useState } from "react";
import { useSession } from "next-auth/client";
import { APPBAR_USER_QUERY } from "../../apollo/apolloQueries";
import { useQuery } from "@apollo/client";
import AppbarMenu from "./AppbarMenu";
import AppbarNoUser from "./AppbarNoUser";
import styles from "../../pages/styles/Specific/Appbar.module.css";
import dynamic from "next/dynamic";
import { AppbarUserData, AppbarVars } from "../../interfaces/QueryInterfaces";

const DynamicSwipeable = dynamic(() => import("./Drawers/Normal"));
const DynamicDrawer = dynamic(() => import("./Drawers/Swipeable"));

const Appbar = () => {
  const [session, loading] = useSession();
  const { data: user, fetchMore } = useQuery<AppbarUserData, AppbarVars>(
    APPBAR_USER_QUERY,
    {
      variables: {
        id: session?.id,
      },
      skip: !session,
      pollInterval: 60000,
    }
  );
  const [open, setOpen] = useState(false);
  const swipeable = useMediaQuery(`(max-width: 480px)`);

  const handleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div>
      {/* App Bar */}
      <AppBar>
        <Toolbar>
          {/* Drawer and Logo */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            className={styles.menuButton}
            onClick={handleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={styles.toolbarTitle}>
            Canvas
          </Typography>
          {/* Drawer and Logo */}
          {user && !loading ? (
            <AppbarMenu user={user} fetchMore={fetchMore} />
          ) : !user && !loading ? (
            <AppbarNoUser />
          ) : (
            ""
          )}
        </Toolbar>
      </AppBar>
      {/* App Bar */}

      {/* Drawer */}
      {swipeable ? (
        <DynamicSwipeable open={open} handleDrawer={handleDrawer} />
      ) : (
        <DynamicDrawer open={open} handleDrawer={handleDrawer} />
      )}
      {/* Drawer */}
    </div>
  );
};

export default Appbar;
