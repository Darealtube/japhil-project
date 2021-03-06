import {
  CircularProgress,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Divider,
  Container,
} from "@material-ui/core";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentList from "../CommentList";
import CommentForm from "../Forms/CreateComment";
import CloseIcon from "@material-ui/icons/Close";
import { edges } from "../../interfaces/CommentInterface";
import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";

interface Props {
  comment: {
    postID: string;
    content: string;
    author: string;
  };
  setComment: React.Dispatch<
    React.SetStateAction<{
      postID: string;
      content: string;
      author: string;
    }>
  >;
  addComment: (
    options?: MutationFunctionOptions<any, OperationVariables>
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  More: () => void;
  hasMore: boolean;
  comments: edges[];
  open: boolean;
  handleDrawer: () => void;
  parentRef: (node: HTMLElement) => void;
}

const CommentDrawer = ({
  comment,
  More,
  hasMore,
  comments,
  setComment,
  addComment,
  open,
  handleDrawer,
  parentRef,
}: Props) => {
  return (
    <div>
      <Drawer
        anchor={"bottom"}
        open={open}
        onClose={handleDrawer}
        style={{
          overflow: "auto",
        }}
      >
        <Toolbar>
          <Typography variant="h4" style={{ flexGrow: 1 }}>
            Comments
          </Typography>

          <IconButton onClick={handleDrawer}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <br />

        <Container
          style={{
            overflow: "auto",
            height: "100rem",
          }}
          id="Scrollable"
          ref={parentRef}
        >
          <CommentForm
            comment={comment}
            setComment={setComment}
            addComment={addComment}
          />
          <InfiniteScroll
            dataLength={comments.length}
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
            scrollThreshold={1}
            scrollableTarget="Scrollable"
          >
            <CommentList comments={comments} />
          </InfiniteScroll>
        </Container>
      </Drawer>
    </div>
  );
};

export default CommentDrawer;
