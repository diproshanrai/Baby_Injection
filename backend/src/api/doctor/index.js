const router = require("express").Router();
const db = require("../../client");
const { userAuth, doctorAuth } = require("../../middlewares");
router.get("/", async (req, res, next) => {
  try {
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
      },
    });
    return res.json({
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/appointments",doctorAuth ,async (req, res, next) => {
  try {
    const appointments = await db.appointment.findMany({
      where: {
        doctorId: Number(req.user.id),
        appointed_time: {
          gte: req.query.from?new Date(req.query.from):undefined,
          lte: req.query.to?new Date(req.query.to):undefined,
        },
        
      },
      orderBy:{
        requested_time:'desc'
      },
      include:{
        child: true,
        user: true,
      }
    });
    return res.json({ data: appointments });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const doctor = await db.user.findFirst({
      where: {
        id: Number(req.params.id),
        role: "DOCTOR",
      },
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    return res.json({ data: doctor });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/appointments", userAuth, async (req, res, next) => {
  try {
    const { childId, date, reason } = req.body;
    const appointment = await db.appointment.create({
      data: {
        doctorId: Number(req.params.id),
        userId: Number(req.user.id),
        childId: Number(childId),
        requested_time: new Date(date),
        reason: reason,
      },
    });
    return res.json({ data: appointment });
  } catch (error) {
    next(error);
  }
});

router.put("/:id/appointments", doctorAuth, async (req, res, next) => {
  try {
    const { date, cancelled } = req.body;

    const appointment = await db.appointment.updateMany({
      where: {
        id: req.params.id,
        doctorId: Number(req.user.id),
      },
      data: {
        cancelled:
          cancelled !== null && cancelled !== undefined
            ? cancelled==1
            : undefined,
        appointed_time: date? new Date(date):undefined,
      },
    });
    return res.json({ message: "Appointment Set" });
  } catch (error) {
    next(error);
  }
});



module.exports = router;
