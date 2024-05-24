const router = require("express").Router();
const { body, validationResult, param } = require("express-validator");
const db = require("../../client");
const { userAuth } = require("../../middlewares");

const childRequired = body("childId")
  .notEmpty()
  .toInt()
  .custom(async (value, { req }) => {
    try {
      const { childId } = req.body;
      const child = db.child.findFirst({
        where: {
          id: childId,
          parentId: Number(req.user.id),
        },
      });
      if (!child) return Promise.reject("Child doesn't exist");
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err.message || "Something went wrong");
    }
  });

  const vaccineRequired = body("vaccineId")
  .notEmpty()
  .toInt()
  .custom(async (value, { req }) => {
    try {
      const { vaccineId } = req.body;
      const vaccineList = db.vaccineList.findFirst({
        where: {
          id: vaccineId
        },
      });
      if (!vaccineList) return Promise.reject("Vaccine doesn't exist");
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err.message || "Something went wrong");
    }
  });

const dateRequired = body("dueDate").isDate().notEmpty().toDate();

const idExists = param("id")
  .toInt()
  .custom(async (value, { req }) => {
    try {
      const { id } = req.params;
      const vaccine = await db.vaccine.findFirst({
        where: {
          id: id,
          parentId: Number(req.user.id),
        },
      });
      if (!vaccine) return Promise.reject("Record Doesn't Exist");
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err.message || "Something went wrong");
    }
  });

router.get("/", userAuth, async (req, res, next) => {
  try {
    const vaccines = await db.vaccine.findMany({
      where: {
        parentId: Number(req.user.id),
        childId: req.query.childId ? Number(req.query.childId) : undefined,
      },
      orderBy:{
      	dueDate: 'desc'
      },
      include: {
        child: true,
        vaccine: true
      },
    });

    res.json({ data: vaccines });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  userAuth,
  childRequired,
  vaccineRequired,
  dateRequired,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Validation Error", errors: errors.array() });
      }

      const { childId, dueDate, description, vaccineId } = req.body;
      const vaccine = await db.vaccine.create({
        data: {
          vaccineId: vaccineId,
          dueDate: dueDate,
          childId: childId,
          parentId:Number(req.user.id),
          description: description||undefined,
        },
      });

      return res.json({ message: "Record Added", data: vaccine });
    } catch (err) {
      next(err);
    }
  }
);

const completed = body("completed").isBoolean().optional();
router.put(
  "/:id",
  userAuth,
  idExists,
  childRequired,
  completed,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Validation Error", errors: errors.array() });
      }

      const { id } = req.params;
      const { childId, completed } = req.body;
      const vaccine = await db.vaccine.update({
        where: {
          id: id,
        },
        data: {
          childId: childId,
          completed: completed !== null ? completed : undefined,
        },
      });

      return res.json({ message: "Record Updated", data: vaccine });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", userAuth, idExists, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: errors.array() });
    }

    const { id } = req.params;
    const vaccine = await db.vaccine.delete({
      where: {
        id: id,
      },
    });

    res.json({ message: "Record Deleted", data: vaccine });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
