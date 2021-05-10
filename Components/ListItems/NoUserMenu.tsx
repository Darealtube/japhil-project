import { ListItem, Divider, Button } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import { signIn, signOut } from "next-auth/client";
import styles from "../../pages/styles/Specific/Lists.module.css";

const NoUserMenu = () => {
  const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signOut({ callbackUrl: `${process.env.WEB_URL}/` });
  };
  const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn(null, { callbackUrl: `${process.env.WEB_URL}/home` });
  };
  return (
    <div>
      <ListItem>
        <Button className={styles.item} onClick={handleSignIn}>
          <MeetingRoomIcon className={styles.icon} /> Login
        </Button>
      </ListItem>
      <Divider />
      <ListItem>
        <Button className={styles.item} onClick={handleSignOut}>
          <InfoIcon className={styles.icon} /> Help
        </Button>
      </ListItem>
      <ListItem>
        <Button className={styles.item}>
          <ContactSupportIcon className={styles.icon} /> Send Feedback
        </Button>
      </ListItem>
    </div>
  );
};

export default NoUserMenu;
