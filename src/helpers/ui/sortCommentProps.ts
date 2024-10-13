import type { Comment } from "../../types/comment";

const sortedProps = [
  "_id",
  "seen",
  "approved",
  "replied",
  "text",
  "repliedText",
  "user",
];

export default (comment: Comment) => {
  const updatedSortedProps = [
    ...new Set([...sortedProps, ...Object.keys(comment)]),
  ];
  const reOrderedComment: Comment | Record<string, any> = {};
  updatedSortedProps.map((prop) => {
    reOrderedComment[prop] = comment[prop as keyof Comment];
  });
  return reOrderedComment as Comment;
};
