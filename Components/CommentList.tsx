import {
  ListItem,
  List,
  ListItemAvatar,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Popover,
} from "@material-ui/core";
import Image from "next/image";
import React, { useState } from "react";
import styles from "../pages/styles/Specific/Post.module.css";
import { edges } from "../interfaces/CommentInterface";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CommentEditMenu from "./ListItems/CommentEditMenu";
import moment from "moment";

const CommentList = ({ comments, id }: { comments: edges[]; id: string }) => {
  const [editAnchor, seteditAnchor] = useState<null | HTMLElement>(null);
  const [targetId, settargetId] = useState(null);
  const [admin, setadmin] = useState<boolean>(null);
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    seteditAnchor(e.currentTarget);
    settargetId(e.currentTarget.value);
    setadmin(id === e.currentTarget.id);
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
      <List className={styles.commentList}>
        {comments &&
          comments.map((comment, index) => (
            <ListItem alignItems="flex-start" key={index}>
              <ListItemAvatar>
                <Image
                  src={comment.node.author.image}
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${comment.node.author.name} commented ${moment(
                  comment.node.date
                ).fromNow()}`}
                secondary={
                  <React.Fragment>{comment.node.content}</React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={handleEdit}
                  value={comment.node.id}
                  id={comment.node.author.id}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>

      <Popover
        anchorEl={editAnchor}
        keepMounted
        open={Boolean(editAnchor)}
        onClose={handleEditClose}
        onExited={handleEditExit}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List>
          <CommentEditMenu
            id={targetId}
            admin={admin}
            onClose={handleEditClose}
            onExited={handleEditExit}
          />
        </List>
      </Popover>
    </div>
  );
};

export default CommentList;
