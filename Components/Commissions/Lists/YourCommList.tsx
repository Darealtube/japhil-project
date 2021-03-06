import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@material-ui/core";
import Image from "next/image";
import moment from "moment";
import styles from "../../../pages/styles/Specific/Commission.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import usePagination from "../../../Hooks/usePagination";
import Link from "next/link";
import { Commissions } from "../../../interfaces/UserInterface";

type Props = {
  yourCommissions: Commissions;
  fetchMore: any;
};

const YourCommList = ({ yourCommissions, fetchMore }: Props) => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const { More, hasMore, ref } = usePagination(
    "userId",
    fetchMore,
    yourCommissions,
    "yourCommissions",
    true
  );

  return (
    <>
      <div className={styles.list2} ref={ref} id="pendingList">
        <List>
          <InfiniteScroll
            dataLength={yourCommissions.edges.length}
            next={More}
            hasMore={hasMore}
            loader={
              <>
                <br />
                <CircularProgress />
              </>
            }
            style={{
              overflow: "hidden",
              textAlign: "center",
            }}
            scrollThreshold={0.9}
            scrollableTarget="pendingList"
          >
            {yourCommissions &&
              yourCommissions.edges.map((commission) => (
                <Link href={`/commissions/${commission.node.id}`}>
                  <ListItem
                    divider
                    key={commission.node.id}
                    button
                    component="a"
                  >
                    <ListItemAvatar>
                      <Image
                        src={
                          commission.node.fromUser.image
                            ? commission.node.fromUser.image
                            : "/user-empty-avatar.png"
                        }
                        width={40}
                        height={40}
                        className={styles.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${commission.node.title}  issued by ${
                        commission.node.fromUser.name
                      } at ${moment(commission.node.dateIssued).format("l")}`}
                      secondary={
                        mobile
                          ? `${commission.node.description}. 
                             Deadline on ${moment(
                               commission.node.deadline
                             ).format("l")}`
                          : `${commission.node.description}`
                      }
                      style={{ flexGrow: 1 }}
                    />
                    {!mobile && (
                      <Typography>
                        Deadline: {moment(commission.node.deadline).format("l")}
                      </Typography>
                    )}
                  </ListItem>
                </Link>
              ))}
          </InfiniteScroll>
        </List>
      </div>
    </>
  );
};

export default YourCommList;
