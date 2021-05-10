import { ObjectId } from "mongodb";
import Post from "../model/Post";
import User from "../model/User";
import moment from "moment";
import Comment from "../model/Comment";
import History from "../model/History";
import _ from "lodash";
import relayPaginate from "../utils/relayPaginate";
import Commission from "../model/Commission";
import Notification from "../model/Notification";

export const resolvers = {
  Query: {
    users(_parent, _args, _context, _info) {
      return User.find({});
    },
    async posts(_parent, args, _context, _info) {
      const posts = await Post.find({});
      const data = relayPaginate(posts, args.after, args.limit);
      return data;
    },
    userId(_parent, args, _context, _info) {
      return User.findById(args.id);
    },
    userName(_parent, args, _context, _info) {
      return User.findOne({ name: args.name });
    },
    postId(_parent, args, _context, _info) {
      return Post.findById(args.id);
    },
    commissionId(_parent, args, _context, _info) {
      return Commission.findById(args.id);
    },
    async recommendedPosts(_parent, args, _context, _info) {
      const post = await Post.findById(args.id);
      const recommended1 = await Post.find({
        tags: { $in: [...post.tags] },
        _id: { $ne: new ObjectId(args.id as string) },
      });
      const recommended2 = await Post.find({
        author: post.author,
        _id: { $ne: new ObjectId(args.id as string) },
      });
      const merge = Object.values(
        recommended2.concat(recommended1).reduce((r, o) => {
          r[o.id] = o;
          return r;
        }, {})
      );
      const data = relayPaginate(merge, args.after, args.limit);
      return data;
    },
    async newPosts(_parent, args, _context, _info) {
      const posts = await Post.find({});

      const newPosts = posts
        .sort((a, b) => moment(b.date).diff(a.date))
        .filter((post) => moment().diff(post.date, "days") <= 7);

      const data = relayPaginate(newPosts, args.after, args.limit);
      return data;
    },
    async featuredPosts(_parent, args, _context, _info) {
      const posts = await Post.find({ likes: { $gt: 0 } }); // WILL MODIFY BASED ON WEBSITE'S PERFORMANCE

      const data = relayPaginate(posts, args.after, args.limit);
      return data;
    },
    async isLikedArtist(_parent, args, _context, _info) {
      const user = await User.findById(args.userID);
      const artist = await User.findOne({ name: args.artistName });

      return artist ? user.likedArtists.includes(artist._id) : false;
    },
    async isLikedPost(_parent, args, _context, _info) {
      const user = await User.findById(args.userID);

      return user.likedPosts.includes(args.postID);
    },
    async userExists(_parent, args, _context, _info) {
      const origUser = await User.findById(args.userId).lean();
      const user = await User.findOne({ name: args.userName }).lean();

      return user ? (user?.name === origUser?.name ? false : true) : false;
    },
    async isSameUser(_parent, args, _context, _info) {
      const userOriginal = await User.findById(args.userId);
      const userCompared = await User.findOne({ name: args.userName });

      if (!userCompared || !userOriginal) {
        return true;
      }

      return userOriginal._id.toString() == userCompared._id.toString();
    },
  },
  Comment: {
    async author(parent, _args, _context, _info) {
      return User.findById(parent.author);
    },
  },
  Notification: {
    async commissioner(parent, _args, _context, _info) {
      return User.findById(parent.commissioner);
    },
  },
  Commission: {
    async fromUser(parent, _args, _context, _info) {
      return User.findById(parent.fromUser);
    },
    async toArtist(parent, _args, _context, _info) {
      return User.findById(parent.toArtist);
    },
  },
  User: {
    async likedPosts(parent, args, _context, _info) {
      const posts = await Post.find({ _id: { $in: parent.likedPosts } });
      const data = relayPaginate(posts, args.after, args.limit);
      return data;
    },
    async posts(parent, args, _context, _info) {
      const posts = await Post.find({ author: parent.id });
      const data = relayPaginate(posts, args.after, args.limit);
      return data;
    },
    async likedArtists(parent, args, _context, _info) {
      const users = await User.find({});
      const usersArray = users.filter((user) =>
        parent.likedArtists.includes(user._id)
      );
      const data = relayPaginate(usersArray, args.after, args.limit);
      return data;
    },
    async homeRecommended(parent, args, _context, _info) {
      const history = await History.find({ userId: parent.id });
      const historyArray = history.map((history) => history.viewed);
      const artists = await User.find({ posts: { $in: historyArray } });
      const artistsPostArray = _.flatten(artists.map((artist) => artist.posts));
      const posts = await Post.find({
        _id: { $in: artistsPostArray, $nin: historyArray },
      });
      const data = relayPaginate(posts, args.after, args.limit);
      return data;
    },
    async commissions(parent, args, _context, _info) {
      const commissions = await Commission.find({
        _id: { $in: parent.commissions },
        accepted: true,
      });
      const commArray = commissions.sort((a, b) =>
        moment(b.deadline).diff(a.deadline)
      );
      const data = relayPaginate(commArray, args.after, args.limit);
      return data;
    },
    async pendingCommissions(parent, args, _context, _info) {
      const commissions = await Commission.find({
        _id: { $in: parent.commissions },
        accepted: false,
      });

      const commArray = commissions.sort((a, b) =>
        moment(b.deadline).diff(a.deadline)
      );
      const data = relayPaginate(commArray, args.after, args.limit);
      return data;
    },
    async yourCommissions(parent, args, _context, _info) {
      const commissions = await Commission.find({
        _id: { $in: parent.yourCommissions },
      });
      const commArray = commissions.sort((a, b) =>
        moment(b.dateIssued).diff(a.dateIssued)
      );
      const data = relayPaginate(commArray, args.after, args.limit);
      return data;
    },
    async finishedCommissions(parent, args, _context, _info) {
      const commissions = await Commission.find({
        _id: { $in: parent.commissions, finished: true },
      });
      const commArray = commissions.sort((a, b) =>
        moment(b.dateIssued).diff(a.dateIssued)
      );
      const data = relayPaginate(commArray, args.after, args.limit);
      return data;
    },
    async yourFinishedCommissions(parent, args, _context, _info) {
      const commissions = await Commission.find({
        _id: { $in: parent.yourCommissions, finished: true },
      });
      const commArray = commissions.sort((a, b) =>
        moment(b.dateIssued).diff(a.dateIssued)
      );
      const data = relayPaginate(commArray, args.after, args.limit);
      return data;
    },
    async yourPendingCommissions(parent, args, _context, _info) {
      const commissions = await Commission.find({
        _id: { $in: parent.yourCommissions, accepted: true },
      });
      const commArray = commissions.sort((a, b) =>
        moment(b.dateIssued).diff(a.dateIssued)
      );
      const data = relayPaginate(commArray, args.after, args.limit);
      return data;
    },
    async notifications(parent, args, _context, _info) {
      const notifs = await Notification.find({
        _id: { $in: parent.notifications },
      });
      const read = notifs.filter((notif) => notif.read === false);
      const idList = notifs.map((notif) => notif._id);
      const cursor = notifs
        .map(function (e) {
          return e.id;
        })
        .indexOf(args.after);

      const final = notifs.slice(
        args.after && cursor != -1 ? cursor + 1 : 0,
        args.after && cursor != -1 ? args.limit + cursor + 1 : args.limit
      );

      return {
        totalUnreadCount: Math.abs(read.length),
        totalCount: notifs.length,
        idList: idList,
        pageInfo: {
          endCursor: final[final.length - 1]?.id,
          hasNextPage:
            final[final.length - 1]?.id == notifs[notifs.length - 1]?.id
              ? false
              : true,
        },
        edges: final.map((a) => ({ node: a })),
      };
    },
    async commissionCount(parent, _args, _context, _info) {
      const commissions = await Commission.find({
        _id: { $in: parent.commissions },
        accepted: false,
      });
      return commissions.length;
    },
  },
  Post: {
    async author(parent, _args, _context, _info) {
      return User.findById(parent.author);
    },
    async comments(parent, args, _context, _info) {
      const comments = await Comment.find({});
      const commentsArray = comments
        .sort((a, b) => moment(b.date).unix() - moment(a.date).unix())
        .filter((comment) => parent.comments.includes(comment._id));
      const data = relayPaginate(commentsArray, args.after, args.limit);
      return data;
    },
  },
  Mutation: {
    async likePost(_parent, args, _context, _info) {
      await User.findOneAndUpdate(
        { _id: args.userID },
        {
          $addToSet: {
            likedPosts: new ObjectId(args.postId as string) as never,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Post.updateOne(
        { _id: args.postId },
        {
          $inc: {
            likes: 1 as never,
          },
        },
        {
          new: true,
        }
      );

      return true;
    },
    async unlikePost(_parent, args, _context, _info) {
      await User.findOneAndUpdate(
        { _id: args.userID },
        {
          $pull: {
            likedPosts: new ObjectId(args.postId as string),
          },
        },
        {
          new: true,
        }
      );
      await Post.updateOne(
        { _id: args.postId },
        {
          $inc: {
            likes: -1 as never,
          },
        },
        {
          new: true,
        }
      );
      return true;
    },
    async editPost(_parent, args, _context, _info) {
      const post = await Post.findOneAndUpdate(
        { _id: args.postId },
        { title: args.title, description: args.description, tags: args.tags },
        {
          new: true,
        }
      );
      return true;
    },
    async deletePost(_parent, args, _context, _info) {
      const post = await Post.findById(args.postId);
      await Post.deleteOne({ _id: args.postId });
      await User.findOneAndUpdate(
        { _id: post.author },
        { $pull: { posts: new ObjectId(args.postId as string) } },
        {
          new: true,
        }
      );
      await User.updateMany(
        { likedPosts: { $in: [new ObjectId(args.postId as string)] } },
        { $pull: { likedPosts: new ObjectId(args.postId as string) } },
        {
          new: true,
        }
      );
      return true;
    },
    async createPost(_parent, args, _context, _info) {
      const post = await Post.create(args); // from body (for now)

      await User.findOneAndUpdate(
        { _id: post.author },
        // @ts-ignore
        { $push: { posts: post._id } }
      );

      return true;
    },
    async createComment(_parent, args, _context, _info) {
      const comment = await Comment.create(args);

      await Post.findByIdAndUpdate(args.postID, {
        $push: { comments: comment._id as never },
      });
      return comment;
    },
    async deleteComment(_parent, args, _context, _info) {
      await Comment.deleteOne({ _id: args.commentID });

      await Post.updateOne(
        { comments: { $in: [new ObjectId(args.commentID as string)] } },
        { $pull: { comments: new ObjectId(args.commentID as string) } }
      );

      return true;
    },
    async configUser(_parent, args, _context, _info) {
      await User.findByIdAndUpdate(
        args.userId,
        {
          name: args.name,
          age: args.age,
          country: args.country,
          language: args.language,
          birthday: args.birthday,
          phone: args.phone,
          artLevel: args.artLevel,
          artStyles: args.artStyles,
          artKinds: args.artKinds,
          newUser: false,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return true;
    },
    async editUser(_parent, args, _context, _info) {
      const data = await User.findByIdAndUpdate(
        args.userId,
        {
          name: args.name,
          userBio: args.userBio,
          country: args.country,
          birthday: args.birthday,
          artLevel: args.artLevel,
          artStyles: args.artStyles,
          artKinds: args.artKinds,
          image: args.image,
          backdrop: args.backdrop,
          phone: args.phone,
          age: args.age,
          newUser: false,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return data;
    },
    async readNotif(_parent, args, _context, _info) {
      await Notification.updateMany(
        { _id: { $in: args.notifArray } },
        {
          read: true,
        }
      );
      return true;
    },
    async likeArtist(_parent, args, _context, _info) {
      await User.findOneAndUpdate(
        { _id: args.userID },
        {
          $push: {
            likedArtists: new ObjectId(args.artistID as string) as never,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return true;
    },
    async unlikeArtist(_parent, args, _context, _info) {
      await User.findOneAndUpdate(
        { _id: args.userID },
        { $pull: { likedArtists: new ObjectId(args.artistID as string) } },
        {
          new: true,
        }
      );
      return true;
    },
    async viewPost(_parent, args, _context, _info) {
      await History.findOneAndUpdate(
        { viewed: args.viewed },
        {
          userId: args.userId,
          viewed: args.viewed,
          lastDateViewed: moment().format(),
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
      return true;
    },
    async commissionArtist(_parent, args, _context, _info) {
      const toArtist = await User.findOne({ name: args.artistName }).lean();
      const deadline = moment().add(args.deadline, "d");

      const commission = await Commission.create({
        fromUser: args.userId,
        toArtist: toArtist._id,
        title: args.title,
        description: args.description,
        sampleArt: args.sampleArt,
        width: args.width,
        height: args.height,
        deadline,
      });

      const fromUser = await User.findByIdAndUpdate(
        args.userId,
        {
          $push: {
            yourCommissions: new ObjectId(commission._id as string) as never,
          },
        },
        {
          new: true,
        }
      );

      const notification = await Notification.create({
        commissionId: commission._id,
        commissioner: args.userId,
        date: moment().format("l"),
        description: `You have a new commission request from ${fromUser.name}`,
        read: false,
      });

      await User.findByIdAndUpdate(
        toArtist._id,
        {
          $push: {
            commissions: new ObjectId(commission._id as string) as never,
            notifications: notification._id,
          },
        },
        {
          new: true,
        }
      );

      return true;
    },
    async deleteNotification(_parent, args, _context, _info) {
      await Notification.findByIdAndDelete(args.notifId);
      await User.findByIdAndUpdate(args.userId, {
        $pull: { notifications: new ObjectId(args.notifId as string) },
      });
      return true;
    },
    async deleteCommission(_parent, args, _context, _info) {
      await Commission.deleteOne({ _id: args.commissionId });

      const user = await User.findOneAndUpdate(
        { commissions: { $in: [new ObjectId(args.commissionId as string)] } },
        { $pull: { commissions: new ObjectId(args.commissionId as string) } }
      );

      await Notification.deleteOne({
        _id: { $in: user.notifications },
        commissionId: args.commissionId,
      });

      const notification = await Notification.create({
        commissioner: user._id,
        date: moment().format("l"),
        description: `Your commission to ${
          user.name
        } has been rejected. Reason: ${args.reason ? args.reason : ""}`,
        read: false,
      });

      await User.updateOne(
        {
          yourCommissions: { $in: [new ObjectId(args.commissionId as string)] },
        },
        {
          $pull: { yourCommissions: new ObjectId(args.commissionId as string) },
          $push: { notifications: notification._id },
        }
      );
      return true;
    },
    async acceptCommission(_parent, args, _context, _info) {
      const commission = await Commission.findOneAndUpdate(
        { _id: args.commissionId },
        { accepted: true },
        { new: true }
      );
      const user = await User.findById(commission.toArtist).lean();

      const notification = await Notification.create({
        commissioner: user._id,
        date: moment().format("l"),
        description: `Your commission to ${
          user.name
        } has been accepted. Message: ${args.message ? args.message : ""}`,
        read: false,
      });

      await User.updateOne(
        {
          yourCommissions: { $in: [new ObjectId(args.commissionId as string)] },
        },
        {
          $push: { notifications: notification._id },
        }
      );

      return commission;
    },
  },
};
