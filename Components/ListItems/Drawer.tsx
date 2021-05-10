import {
  ListItem,
  ListItemIcon,
  Typography,
  ListItemText,
  Divider,
  Grid,
  Badge,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PaletteIcon from "@material-ui/icons/Palette";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import ImageIcon from "@material-ui/icons/Image";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SettingsIcon from "@material-ui/icons/Settings";
import EmojiFlagsIcon from "@material-ui/icons/EmojiFlags";
import InfoIcon from "@material-ui/icons/Info";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import BrushIcon from "@material-ui/icons/Brush";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/client";
import { COMMISSION_COUNT_QUERY } from "../../apollo/apolloQueries";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link href="#">Canvas</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const MainItems = [
  {
    label: "Home",
    link: "/home",
    icon: <HomeIcon />,
  },
  {
    label: "Trending Art",
    link: "/trending",
    icon: <WhatshotIcon />,
  },
  {
    label: "Your Art",
    link: "/gallery/yourArt",
    icon: <ImageIcon />,
  },
  {
    label: "Liked Arts",
    link: "/gallery/liked",
    icon: <FavoriteIcon />,
  },
];

const MoreItems = [
  {
    label: "Settings",
    link: "/settings/account/",
    icon: <SettingsIcon />,
  },
  {
    label: "Report",
    link: "/help/report",
    icon: <EmojiFlagsIcon />,
  },
  {
    label: "Help",
    link: "/help",
    icon: <InfoIcon />,
  },
  {
    label: "Feedback",
    link: "/help/feedback",
    icon: <ContactSupportIcon />,
  },
];

const DrawerItems = () => {
  const [session] = useSession();
  const { data } = useQuery(COMMISSION_COUNT_QUERY, {
    variables: {
      id: session?.id,
    },
  });
  const TransactionItems = [
    {
      label: "Commissions",
      link: "/commissions",
      icon: <BrushIcon />,
      badge: data?.userId.commissionCount,
    },
    {
      label: "Wallet",
      link: "/transactions/wallet",
      icon: <AccountBalanceWalletIcon />,
    },
    {
      label: "Transaction History",
      link: "/transactions/history",
      icon: <ReceiptIcon />,
    },
    {
      label: "Your Cart",
      link: "/transactions/cart",
      icon: <ShoppingCartIcon />,
    },
  ];
  return (
    <div>
      <ListItem>
        <Typography variant="h4">
          <span>
            <PaletteIcon fontSize="large" /> Canvas
          </span>
        </Typography>
      </ListItem>
      <Divider />
      {MainItems.map((item) => (
        <>
          <Link href={item.link}>
            <ListItem button component="a">
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </ListItem>
          </Link>
        </>
      ))}
      <Divider />
      <ListItem>
        <Typography variant="h5">Transactions</Typography>
      </ListItem>
      {TransactionItems.map((item) => (
        <>
          {!item.badge ? (
            <Link href={item.link}>
              <ListItem button component="a">
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </ListItem>
            </Link>
          ) : (
            <Link href={item.link}>
              <ListItem button component="a">
                <ListItemIcon>{item.icon}</ListItemIcon>
                <Badge
                  color="secondary"
                  badgeContent={item.badge ? item.badge : " "}
                >
                  <ListItemText>{item.label}</ListItemText>
                </Badge>
              </ListItem>
            </Link>
          )}
        </>
      ))}
      <Divider />
      <ListItem>
        <Typography variant="h5">More</Typography>
      </ListItem>
      {MoreItems.map((item) => (
        <>
          <Link href={item.link}>
            <ListItem button component="a">
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </ListItem>
          </Link>
        </>
      ))}
      <Divider />
      <ListItem>
        <Grid container spacing={2}>
          <Grid item>
            <Typography>About</Typography>
          </Grid>
          <Grid item>
            <Typography>Terms and Conditions</Typography>
          </Grid>
          <Grid item>
            <Typography>Developers</Typography>
          </Grid>
          <Grid item>
            <Typography>Contact Us</Typography>
          </Grid>
          <Grid item>
            <Typography>Canvas Tutorial</Typography>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem>
        <Copyright />
      </ListItem>
    </div>
  );
};

export default DrawerItems;
