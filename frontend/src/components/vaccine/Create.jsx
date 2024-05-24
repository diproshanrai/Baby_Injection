import { Button, Input, Modal, notification } from 'antd'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useToken from '../../hooks/useToken'
import { doPost } from '../../utils/request'

export default function Create({visible,handleClose, handleSuccess}) {
    const [token] = useToken()
  return (
    <Modal
        footer={[]}
        onCancel={handleClose}
        title="Add Vaccine"
        visible={visible}
    >
        <Formik
            initialValues={{ 
                name:'',
                months: null,
                description: ''
             }}
             validationSchema={Yup.object({
                 name: Yup.string().required(),
                 months: Yup.number().integer().min(0),
                 description: Yup.string().optional()
             })}
             onSubmit={async (values,{setSubmitting})=>{
                try {
                   const response = await doPost({body:values,path:"vaccine-list",token:token}) 
                   if(response.ok){
                       notification.success({
                           message:"Vaccine Added"
                       })
                       handleSuccess()
                       return handleClose()
                   }
                   throw new Error((await response.json()).message)
                } catch (error) {
                    notification.error({
                        message: error.message || "Something Went Wrong"
                    })
                }finally{
                    setSubmitting(false)
                }
             }}
        >
            {({handleSubmit, isSubmitting,isValid})=>(
                <Form>
                    <div className="py-1">
                        <Field 
                            as={Input}
                            name="name"
                            placeholder="Enter Name"
                        />
                        <ErrorMessage  name="name" className='text-danger' component="span" />
                    </div>
                    <div className="py-1">
                        <Field 
                            as={Input}
                            name="months"
                            placeholder="Enter Months"
                            type="number"
                        />
                        <ErrorMessage name="months" className='text-danger' component="span" />
                    </div>
                    <div className="py-1">
                    <Field
                        name="description"
                        placeholder="Description"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        as={Input.TextArea}
                     />
                     <ErrorMessage name="description" className='text-danger' component="span" />
                    </div>
                    <Button
                        loading={isSubmitting}
                        disabled={isSubmitting||!isValid}
                        onClick={handleSubmit}
                    >
                        Create
                    </Button>
                </Form>
            )}
        </Formik>
    </Modal>
  )
}
