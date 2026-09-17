import { getPool } from "shared";
import { Task } from "../utils/types";

/**
 *
 * @param input
 * @returns Promise -> Task
 */
export const createTask = async (input: {
  title: string;
  created_by: string;
}): Promise<Task> => {
  const result = await getPool().query<Task>(
    `INSERT INTO tasks(title,created_by) VALUES ($1,$2) RETURNING id , title ,status , created_by , created_at`,
    [input.title, input.created_by],
  );
  return result.rows[0];
};

/**
 *
 * @param input
 * @returns Promise -> Task[]
 */

export const listTasks = async (input: {
  userId: string;
  role: string;
}): Promise<Task[]> => {
  if (input.role === "ADMIN") {
    const result = await getPool().query(
      `SELECT * FROM tasks ORDER BY created_at desc`,
    );
    return result.rows;
  }

  const result = await getPool().query(
    `SELECT * FROM tasks WHERE created_by =$1 ORDER BY created_at desc`,
    [input.userId],
  );
  return result.rows;
};
/**
 *
 * @param id -> string
 * @returns Promise -> Task ?? null
 */
export const findSingleTaskById = async (id: string): Promise<Task | null> => {
  const result = await getPool().query(`SELECT * FROM tasks where id = $1`, [
    id,
  ]);

  return result.rows[0] ?? null;
};

/**
 *
 * @param id
 * @returns Promise->boolean
 */
export const deleteSingleTaskById = async (id: string): Promise<boolean> => {
  const result = await getPool().query(
    `
        DELETE FROM tasks WHERE id = $1`,
    [id],
  );

  return (result.rowCount ?? 0) > 0;
};
