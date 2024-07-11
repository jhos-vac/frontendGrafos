import React, { useEffect } from 'react';
import { Button, Form, Input, Select} from 'antd';
import styles from '../estilos/components.module.css';
import { createGraph, generateEntity } from "../resources/resource";


const { Option } = Select;

interface FormValues {
    nameStudent: string;
    studentLv: string;
    text: string;
}

const onFinish = async (values: FormValues) => {
    try {
        const response = await createGraph(generateEntity, values);
        console.log(response);
    } catch (error) {
        console.error('Error creating graph:', error);
    }
};

const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

const FormStudent: React.FC<{ selectedData?: any }> = ({ selectedData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        const handleResize = debounce(() => {
            console.log('Resize event handled');
        }, 100);

        const observer = new ResizeObserver(handleResize);
        const element = document.querySelector('.resize-target');
        if (element) {
            observer.observe(element);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={styles.FormStudent}>
            <Form
                className={styles.Form}
                form={form}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}
            >
                <div className={styles.DateDiv}>
                <div className={styles.divDateStudent}>
                    <p className={styles.TextForm}>Name Student</p>
                    <Form.Item name="nameStudent">
                        <Input className={styles.InputStudent} placeholder="Add name student"/>
                    </Form.Item>
                </div>

                <div className={styles.divDateStudent}>
                    <p className={styles.TextForm}>Student Level</p>
                    <Form.Item name="studentLv" className={styles.formItem}>
                        <Select className={styles.InputLevel} placeholder="Select Student Level">
                            <Option className={styles.InputForm} value="A1">A1</Option>
                            <Option className={styles.InputForm} value="A2">A2</Option>
                        </Select>
                    </Form.Item>
                </div>
                </div>

                    <p style={{textAlign: "center"}} className={styles.TextForm}>Text</p>
                    <Form.Item name="text">
                        <Input.TextArea
                            className={styles.InputText}
                            placeholder="Add Text"
                            autoSize={{minRows: 5, maxRows: 10}}
                        />
                    </Form.Item>
                <div className={styles.DivCalificationButton}>
                    <Form.Item wrapperCol={{span: 24, offset: 0}}>
                        <Button className={styles.Button} type="primary" htmlType="submit">
                            Calification
                        </Button>
                    </Form.Item>
                </div>

            </Form>

        </div>
    );
};

export default FormStudent;
