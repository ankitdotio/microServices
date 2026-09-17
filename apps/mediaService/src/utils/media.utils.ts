import { Attachment } from "./types";

export const converToPublicMediaAttachment = (attachment: Attachment) => {
  return {
    id: attachment.id,
    taskId: attachment.task_id,
    imageUrl: attachment.image_url,
    uploaded_by: attachment.uploaded_by,
    created_at: attachment.created_at,
  };
};
