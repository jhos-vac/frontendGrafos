import React, { useEffect } from 'react';
import { Button, Form, Input, Select, Card } from 'antd';
import styles from '../estilos/components.module.css';
import { createGraph, generateEntity } from "../resources/resource";
import CalificationDisplay from "./Calificationdisplay";
import StudentDetails from "./StudentDetails";


const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

interface FormValues {
    nameStudent: string;
    studentLv: string;
    text: string;
}

const onFinish = (values: any) => {
    try {
        const response = createGraph(generateEntity, values);
        console.log(response);
    } catch (error) {
        console.error('Error creating graph:', error);
    }
};

const FormStudent: React.FC<{ selectedData?: any }> = ({ selectedData }) => {
    const [form] = Form.useForm();



    return (
        <div>
            <Form
                {...layout}
                form={form}
                name="nest-messages"
                onFinish={onFinish}
            >
                <p className={styles.TextForm}>Name Student</p>
                <Form.Item className='custom-from-item' name={['nameStudent']}>
                    <Input className={styles.InputForm} placeholder="Add name student" />
                </Form.Item>

                <p className={styles.TextForm}>Student Level</p>
                <Form.Item
                    className={styles.formItem}
                    name={['studentLv']}
                >
                    <Select className={styles.InputForm} placeholder="Select province">
                        <Option className={styles.InputForm} value="A1">A1</Option>
                        <Option className={styles.InputForm} value="A2">A2</Option>
                    </Select>
                </Form.Item>

                <p style={{ textAlign: "center", marginTop: "15%" }} className={styles.TextForm}>Text</p>
                <Form.Item name={['text']}>
                    <Input.TextArea className={styles.InputForm} placeholder="Add Text" autoSize={{ minRows: 5, maxRows: 10 }} />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button className={styles.Button} type="primary" htmlType="submit">
                        Calification
                    </Button>
                </Form.Item>
            </Form>

            {selectedData && (
                <StudentDetails student={{
                    nameStudent: selectedData.nameStudent,
                    studentLevel: selectedData.studentLevel,
                    context: selectedData.context,
                }} />
            )}
            <div className={styles.divCalification}>
                {selectedData && selectedData.calification && (
                    <CalificationDisplay calification={selectedData.calification} />
                )}
            </div>


        </div>
    );
};

export default FormStudent;
