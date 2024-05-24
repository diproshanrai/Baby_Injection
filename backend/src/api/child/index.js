const router = require('express').Router()
const { body, validationResult, param } = require('express-validator')
const db = require('../../client')
const { userAuth } = require('../../middlewares')

const nameRequired = body('name').isString().notEmpty();
const dateRequired = body('dob').isDate().notEmpty().toDate();


const childExists = param('id').custom(async (value, { req }) => {
    try {
        const child = await db.child.findFirst({
            where: {
                id: Number(req.params.id)
            }
        })
        if (!child) {
            return Promise.reject("Child doesn't exist")
        }
        if(child.parentId !== Number(req.user.id)){
            return Promise.reject("Child doesn't belong to you")
        }
        return true;
    } catch (err) {
        return Promise.reject("Child doesn't exist")
    }
}).toInt()

router.get('/', userAuth, async (req, res, next) => {
    try {
        const { oldestFirst, name } = req.query;
        const children = await db.child.findMany({
            where: {
                parentId: req.user.id,
                name: {
                    contains: name !== null ? name : undefined
                }
            },
            orderBy: {
                dob: oldestFirst ? 'asc' : 'desc',
            }
        })

        return res.json({ data: children });
    } catch (error) {
        next(error)
    }
})

router.get('/:id', userAuth, async (req, res, next) => {
    try {
        const child = await db.child.findFirst({
            where: {
                parentId: req.user.id,
                id: Number(req.params.id)
            }
        })
        if (!child) {
            res.status(404)
            next(new Error("Child not found"));
        }
        return res.json({ data: child });
    } catch (error) {
        next(error)
    }
})

router.post('/', userAuth, nameRequired, dateRequired, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: "Validation Error", errors: errors.array() });
        }

        const { name, dob } = req.body;
      
        const child = await db.child.create({
            data: {
                name: name,
                dob: dob,
                parentId: req.user.id,
            }
        })

        return res.json({ message: "Record was added", data: child });
    } catch (err) {
        next(err)
    }
})

router.put('/:id', userAuth, childExists, nameRequired, dateRequired, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: "Validation Error", errors: errors.array() });
        }

        const { id } = req.params;
        const { name, dob } = req.body;

        const child = await db.child.updateMany({
            where: {
                id: id,
                parentId: Number(req.user.id)
            },
            data: {
                name: name,
                dob: dob,
                parentId: Number(req.user.id)
            }
        })

        return res.json({ message: "Record was updated", data: child });
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", userAuth,childExists, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ message: "Validation Error", errors: errors.array() });
    }
    try {
        const child = await db.child.deleteMany({
            where: {
                id: req.params.id,
                parentId: req.user.id
            }
        })
        return res.json({ message: "Record deleted", data: child })

    } catch (error) {
        next(error)
    }
})

router.get("/:id/appointments", async(req,res,next)=>{
    try {
    
       const appointments = await db.appointment.findMany({
           where:{
               childId: Number(req.params.id),
               
           },
           orderBy:{
           	requested_time: "desc",
           },
           include:{
           	doctor: true
           }
       })
       return res.json({data: appointments})
    } catch (error) {
        next(error)
    }
})

module.exports = router
