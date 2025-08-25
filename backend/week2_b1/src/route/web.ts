import express, { Application, Request, Response } from "express";
import homeController from "../controllers/homeController";

const router = express.Router();

// Khai báo kiểu rõ ràng cho app
const initWebRoutes = (app: Application): void => {
  // cách 1: trả trực tiếp response
  router.get("/", (req: Request, res: Response): Response => {
    return res.send("Trần Mai Di");
  });

  // cách 2: gọi hàm controller (các hàm này phải có kiểu RequestHandler)
  router.get("/home", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getfindAllCrud);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  // Gắn router vào app
  app.use("/", router);
};

export default initWebRoutes;
