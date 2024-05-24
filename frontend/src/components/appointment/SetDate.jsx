import { Button, DatePicker, Modal, notification } from "antd";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import useToken from "../../hooks/useToken";
import { doPost } from "../../utils/request";

export default function SetDate({ appointment, visible, handleClose, success }) {
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
          date: null,
        }}
        validationSchema={Yup.object({
          date: Yup.date().required("Date is Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await doPost({
              body: values,
              path: `doctors/${appointment.id}/appointments`,
              token,
              method: "PUT",
            });
            if (response.ok) {
              notification.success({
                message: "Date Set",
              });
              success()
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
                showTime
                showSecond={false}
                showHour
                showMinute
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

            <Button
              loading={isSubmitting}
              disabled={isSubmitting || !isValid}
              onClick={handleSubmit}
            >
              Set Date
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
