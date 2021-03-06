import {
  Grid,
  Card,
  CardHeader,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Container,
  IconButton,
} from "@material-ui/core";
import Link from "next/link";
import styles from "../pages/styles/General/Home.module.css";
import Image from "next/image";
import { edges } from "../interfaces/PostInterface";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/client";

const DynamicCardPopover = dynamic(() => import("./MainPopovers/CardPopover"));

type PostData = {
  postData: edges[];
  error?: string;
};

export const CardList = ({ postData }: PostData) => {
  const [session] = useSession();
  const [editAnchor, seteditAnchor] = useState<null | HTMLElement>(null);
  const [targetId, settargetId] = useState<string>(null);
  const [admin, setadmin] = useState<boolean>(null);
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    seteditAnchor(e.currentTarget);
    settargetId(e.currentTarget.value);
    setadmin(session?.id === e.currentTarget.id);
  };

  const handleEditClose = () => {
    seteditAnchor(null);
    settargetId(null);
  };

  const handleEditExit = () => {
    setadmin(null);
  };

  return (
    <div>
      <Grid container spacing={2} className={styles.cardContainer}>
        {postData &&
          postData.map((post, index) => (
            <Grid item key={index}>
              <Card className={styles.card}>
                <CardHeader
                  avatar={
                    post.node.author.image ? (
                      <Link
                        href={`/profile/${encodeURIComponent(
                          post.node.author.name
                        )}`}
                      >
                        <Image
                          src={post.node.author.image}
                          width={40}
                          height={40}
                          className={styles.avatar}
                        />
                      </Link>
                    ) : (
                      <Avatar src="/user-empty-avatar.png" />
                    )
                  }
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={handleEdit}
                      value={post.node.id}
                      id={post.node.author.id}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={post.node.author.name}
                  subheader={post.node.date}
                />

                <Container component="div" className={styles.artContainer}>
                  {post.node.art && (
                    <Image
                      src={post.node.art}
                      layout="fill"
                      objectFit="contain"
                    />
                  )}
                </Container>

                <Link href={`/${post.node.id}`}>
                  <CardActionArea>
                    <CardContent>
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        className={styles.title}
                      >
                        {post.node.title}
                      </Typography>
                      <br />
                      {post.node.tags.map((tag, index) => (
                        <Chip key={index} label={tag} className={styles.tag} />
                      ))}
                    </CardContent>
                  </CardActionArea>
                </Link>
                <CardActions>
                  <Button size="small" color="primary">
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
      <DynamicCardPopover
        editAnchor={editAnchor}
        handleEditClose={handleEditClose}
        handleEditExit={handleEditExit}
        admin={admin}
        targetId={targetId}
      />
    </div>
  );
};
