import { Request, Response, NextFunction } from "express";
import db from "../models";                        // export default từ models/index.ts
import CRUDService from "../services/CRUDService"; // export default từ services/CRUDService.ts

// Nếu bạn có định nghĩa User model với types, có thể import để dùng type:
// import { User } from "../models/user";

const getHomePage = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    // Nếu có type User -> <User[]>; chưa có thì giữ any[]
    const data = (await db.User.findAll({ raw: true })) as any[];
    console.log("......");
    console.log(data);
    console.log("......");

    res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};

const getAboutPage = (_req: Request, res: Response): void => {
  res.render("test/about.ejs");
};

const getCRUD = (_req: Request, res: Response): void => {
  res.render("crud.ejs");
};

const getfindAllCrud = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const data = await CRUDService.getAllUser().catch((e: unknown) => {
    console.error(e);
    return [];
  });

  res.render("users/findAlluser.ejs", {
    datalist: data || [],
  });
};

const postCRUD = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await CRUDService.createNewUser(req.body);
    console.log(message);
    res.send("Post crud to server");
  } catch (e) {
    console.error(e);
    res.status(400).send("Cannot create user");
  }
};

const getEditCRUD = async (req: Request, res: Response): Promise<void> => {
  const idRaw = req.query.id;
  const userId = Number(Array.isArray(idRaw) ? idRaw[0] : idRaw);

  if (!userId || Number.isNaN(userId)) {
    res.status(400).send("Không lấy được id hợp lệ");
    return;
  }

  const userData = await CRUDService.getUserInfoById(userId).catch(
    (e: unknown) => {
      console.error(e);
      return null;
    }
  );

  if (!userData) {
    res.status(404).send("User không tồn tại");
    return;
  }

  res.render("users/updateUser.ejs", { data: userData });
};

const putCRUD = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedList = await CRUDService.updateUser(req.body);
    res.render("users/findAlluser.ejs", {
      datalist: updatedList || [],
    });
  } catch (e) {
    console.error(e);
    res.status(400).send("Cập nhật thất bại");
  }
};

const deleteCRUD = async (req: Request, res: Response): Promise<void> => {
  const idRaw = req.query.id;
  const userId = Number(Array.isArray(idRaw) ? idRaw[0] : idRaw);

  if (!userId || Number.isNaN(userId)) {
    res.status(400).send("Not find user");
    return;
  }

  try {
    await CRUDService.deleteUserById(userId);
    res.send("Deleted!");
  } catch (e) {
    console.error(e);
    res.status(400).send("Delete failed");
  }
};

// Export mặc định
export default {
  getHomePage,
  getAboutPage,
  getCRUD,
  getfindAllCrud,
  postCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
