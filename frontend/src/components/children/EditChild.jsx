import React from 'react'
import { Form, Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button, DatePicker, Input, notification } from 'antd'
import { doPost } from '../../utils/request'
import moment from 'moment'

export default function EditChild({handleSuccess,token,child}) {
  return (
    <div className="card my-2">
        <div className="card-header">
            Update Child
        </div>
        <div className="card-body">
            <Formik
                initialValues={{ 
                    name: child.name,
                    dob: new String(child.dob).split('T')[0]
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required(),
                    dob: Yup.date().required()
                })}
                onSubmit={async (values, {setSubmitting})=>{
                    try{
                        const response = await doPost({method:"PUT",body:values,path:`children/${child.id}`,token:token})
                        if(response.ok){
                            handleSuccess()
                            return notification.success({
                                message:"Child Date Updated"
                            })
                        }
                        throw new Error(await response.json().message)
                    }catch(err){
                        notification.error({
                            message: err.message||"Something Went Wrong"
                        })
                    }finally{
                        setSubmitting(false)
                    }
                }}
            >
                {
                    ({values,setFieldValue,handleSubmit,dirty,isSubmitting})=>(
                        <Form>
                          <div className="py-1">
                          <Field 
                            name="name"
                            placeholder="Enter Name"
                            as={Input}
                          />  
                          <ErrorMessage name='name' component="span" className='text-danger'/>
                          
                          </div>
                         <div className="py-1">
                         <DatePicker 
                          className={"w-100"}
                          value={moment(values.dob)}
                            placeholder="Date Of Birth"
                            onChange={
                                (date,dateString)=>{
                                    setFieldValue('dob',dateString)
                                }
                            }
                          />
                          <ErrorMessage name='dob' component="span" className='text-danger'/>
                          
                         </div>
                         <Button
                            onClick={handleSubmit}
                            loading={isSubmitting}
                            disabled={isSubmitting||!dirty}
                         >
                             Update
                         </Button>
                        </Form>
                    )
                }
            </Formik>
        </div>
    </div>
  )
}
