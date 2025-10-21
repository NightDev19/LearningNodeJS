import { Router, Request, Response } from "express";

const router = Router();

router.get("/example", (req: Request, res: Response) => {
  res.json({ message: "This is an example route!" });
});

router.get("/user/:user", (req: Request<{ user: string }>, res: Response) => {
  const { user } = req.params; // Extract the dynamic parameter
  res.send(`This is a user route! ${user}`);
});


export default router;
