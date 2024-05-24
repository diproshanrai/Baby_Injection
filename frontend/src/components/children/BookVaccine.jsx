import { Button, DatePicker, Input, Modal, notification } from "antd";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import useToken from "../../hooks/useToken";
import { doPost } from "../../utils/request";

export default function BookVaccine({
  visible,
  handleClose,
  childId,
  vaccineId,
}) {
  const [token] = useToken();
  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={[]}
      title="Book Vaccine"
    >
      <Formik
        initialValues={{
          childId: childId,
          dueDate: null,
          vaccineId: vaccineId,
          description: "",
        }}
        validationSchema={Yup.object({
          dueDate: Yup.date().required("Date is Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await doPost({
              body: values,
              path: "vaccines",
              token,
            });
            if (response.ok) {
              notification.success({
                message: "Vaccine Booked",
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
        {({ isSubmitting, isValid, handleSubmit, setFieldValue }) => (
          <Form>
            <div className="py-1">
              <DatePicker
                className={"w-100"}
                placeholder="Book A Date"
                onChange={(date, dateString) => {
                  setFieldValue("dueDate", dateString);
                }}
              />
              <ErrorMessage
                name="dueDate"
                component="span"
                className="text-danger"
              />
            </div>
            <div className="py-1">
              <Field
                name="description"
                placeholder="Remarks"
                autoSize={{ minRows: 3, maxRows: 5 }}
                as={Input.TextArea}
              />
              <ErrorMessage
                name="description"
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
        )}
      </Formik>
    </Modal>
  );
}
