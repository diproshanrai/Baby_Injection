import { Modal, notification, Select , DatePicker,Input,Button } from 'antd'
import { Form, Formik, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'
import useFetch from '../../hooks/useFetch'
import useToken from '../../hooks/useToken'
import { doPost } from '../../utils/request'

export default function BookAppointment({ visible, handleClose, doctor }) {
    const [token] = useToken()
    const {data} = useFetch("children",{},token)
    return (
        <Modal
            visible={visible}
            onCancel={handleClose}
            footer={[]}
            title={`Book Appointment With Doctor ${doctor.name}`}
        >
            <Formik
                initialValues={{
                    childId: null,
                    date: null,
                    reason: ''
                }}
                validationSchema={Yup.object({
                    childId: Yup.number().required("Please Select A Child"),
                    date: Yup.date().required("Date is Required"),
                    reason: Yup.string().optional()
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const response = await doPost({
                            body: values,
                            path: `doctors/${doctor.id}/appointments`,
                            token,
                        });
                        if (response.ok) {
                            notification.success({
                                message: "Appointment Requested For Booking",
                            });
                            return handleClose();
                        }
                        throw new Error(await response.json().message);
                    } catch (error) {
                        notification.error({
                            message: error.message || "Something Went Wrong",
                        });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {
                    ({ isSubmitting, isValid, setFieldValue, handleSubmit , values}) => (
                        <Form>
                            <div className="py-1">
                                <Select
                                    defaultValue={values.childId}
                                    placeholder="Select Child"
                                    onChange={(value)=>setFieldValue('childId',value)}
                                >
                                    {
                                        data && data.data && data.data.map(child=>(
                                            <Select.Option value={child.id}>
                                                {child.name}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className="py-1">
                                <DatePicker
                                    showTime
                                    className={"w-100"}
                                    placeholder="Book A Date"
                                    onChange={(date, dateString) => {
                                        setFieldValue("date", dateString);
                                    }}
                                />
                                <ErrorMessage
                                    name="date"
                                    component="span"
                                    className="text-danger"
                                />
                            </div>
                            <div className="py-1">
                                <Field
                                    name="reason"
                                    placeholder="Reason"
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                    as={Input.TextArea}
                                />
                                <ErrorMessage
                                    name="reason"
                                    component="span"
                                    className="text-danger"
                                />
                            </div>
                            <Button
                                loading={isSubmitting}
                                disabled={isSubmitting || !isValid}
                                onClick={handleSubmit}
                            >
                                Book
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </Modal>
    )
}
